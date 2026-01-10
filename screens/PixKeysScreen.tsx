import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Alert, Pressable, Dimensions } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  Card,
} from "@gluestack-ui/themed";
import {
  ArrowLeft,
  Plus,
  Check,
  Edit,
  Trash2,
  Coffee,
  Home,
  FileDown,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidPixKey } from "../utils/pixGenerator";
import QRCode from "react-native-qrcode-svg";
import { generatePixCode } from "../utils/pixGenerator";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

interface PixKey {
  id: string;
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  isActive: boolean;
}

export default function PixKeysScreen({ navigation }: any) {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [loading, setLoading] = useState(true);
  const qrCodeRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    loadPixKeys();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadPixKeys();
    });
    return unsubscribe;
  }, [navigation]);

  const loadPixKeys = async () => {
    try {
      setLoading(true);
      const keysData = await AsyncStorage.getItem("pixKeys");
      if (keysData) {
        const keys: PixKey[] = JSON.parse(keysData);
        setPixKeys(keys);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar chaves:", error);
      setLoading(false);
    }
  };

  const handleSelectKey = async (keyId: string) => {
    try {
      const updatedKeys = pixKeys.map((key) => ({
        ...key,
        isActive: key.id === keyId,
      }));

      setPixKeys(updatedKeys);
      await AsyncStorage.setItem("pixKeys", JSON.stringify(updatedKeys));

      // Atualizar valores no formato antigo para compatibilidade
      const activeKey = updatedKeys.find((k) => k.isActive);
      if (activeKey) {
        await AsyncStorage.setItem("pixKey", activeKey.pixKey);
        await AsyncStorage.setItem("merchantName", activeKey.merchantName);
        await AsyncStorage.setItem("merchantCity", activeKey.merchantCity);
      }

      Alert.alert("Sucesso", "Chave Pix ativa atualizada!");
    } catch (error) {
      console.error("Erro ao selecionar chave:", error);
      Alert.alert("Erro", "Não foi possível ativar esta chave.");
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    const keyToDelete = pixKeys.find((k) => k.id === keyId);

    if (keyToDelete?.isActive && pixKeys.length > 1) {
      Alert.alert(
        "Atenção",
        "Esta é a chave ativa. Selecione outra chave antes de excluir."
      );
      return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir a chave ${keyToDelete?.pixKey}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedKeys = pixKeys.filter((k) => k.id !== keyId);
              setPixKeys(updatedKeys);
              await AsyncStorage.setItem(
                "pixKeys",
                JSON.stringify(updatedKeys)
              );

              if (updatedKeys.length === 0) {
                await AsyncStorage.removeItem("pixKey");
                await AsyncStorage.removeItem("merchantName");
                await AsyncStorage.removeItem("merchantCity");
              }

              Alert.alert("Sucesso", "Chave Pix excluída!");
            } catch (error) {
              console.error("Erro ao excluir chave:", error);
              Alert.alert("Erro", "Não foi possível excluir a chave.");
            }
          },
        },
      ]
    );
  };

  const handleDonate = () => {
    navigation.navigate("QRCode", {
      amount: 5.0,
      isDonation: true,
      donationKey: "staranytech@gmail.com", //TODO: ALTERE AQUI para sua chave Pix
      donationName: "Desenvolvedor Pix Direto",
      donationCity: "São Paulo",
    });
  };

  const handleGeneratePDF = async (key: PixKey) => {
    try {
      const qrCodeRef = qrCodeRefs.current[key.id];
      if (!qrCodeRef) {
        Alert.alert("Erro", "QR Code não está disponível.");
        return;
      }

      // Gerar código Pix sem valor (valor livre)
      const pixCode = generatePixCode({
        pixKey: key.pixKey,
        merchantName: key.merchantName,
        merchantCity: key.merchantCity,
      });

      // Ler o ícone do app como base64
      const iconAsset = Asset.fromModule(require("../assets/icon.png"));
      await iconAsset.downloadAsync();
      // @ts-ignore - FileSystem tipos não são detectados corretamente
      const iconBase64 = await FileSystem.readAsStringAsync(
        iconAsset.localUri!,
        { encoding: "base64" }
      );

      // Obter QR Code como base64
      qrCodeRef.toDataURL(async (dataURL: string) => {
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: 'Arial', sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  padding: 20px;
                  background: #f5f5f5;
                }
                .plaquinha {
                  background: white;
                  border: 3px solid #32BCAD;
                  border-radius: 16px;
                  padding: 40px;
                  max-width: 400px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                  text-align: center;
                }
                .header {
                  margin-bottom: 30px;
                }
                .title {
                  font-size: 28px;
                  font-weight: bold;
                  color: #1a1a1a;
                  margin-bottom: 8px;
                }
                .amount {
                  font-size: 32px;
                  font-weight: bold;
                  color: #32BCAD;
                  margin-bottom: 20px;
                }
                .qrcode-wrapper {
                  text-align: center;
                }
                .qrcode-container {
                  background: white;
                  padding: 20px;
                  border-radius: 12px;
                  margin: 20px auto;
                  display: inline-block;
                }
                .qrcode-container img {
                  display: block;
                  width: 300px;
                  height: 300px;
                }
                .merchant-info {
                  margin: 20px 0;
                  padding: 20px;
                  background: #f8f9fa;
                  border-radius: 8px;
                }
                .merchant-name {
                  font-size: 20px;
                  font-weight: bold;
                  color: #1a1a1a;
                  margin-bottom: 5px;
                }
                .footer {
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 2px solid #e0e0e0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 10px;
                }
                .app-icon {
                  width: 24px;
                  height: 24px;
                  border-radius: 6px;
                }
                .footer-text {
                  font-size: 12px;
                  color: #666;
                }
                .app-name {
                  font-weight: bold;
                  color: #32BCAD;
                }
              </style>
            </head>
            <body>
              <div class="plaquinha">
                <div class="header">
                  <div class="title">Pagamento Pix</div>
                  <div class="amount">Valor livre</div>
                </div>
                
                <div class="qrcode-wrapper">
                  <div class="qrcode-container">
                    <img src="data:image/png;base64,${dataURL}" alt="QR Code Pix" />
                  </div>
                </div>
                
                <div class="merchant-info">
                  <div class="merchant-name">${key.merchantName}</div>
                </div>
                
                <div class="footer">
                  <img class="app-icon" src="data:image/png;base64,${iconBase64}" alt="Pix Direto" />
                  <div class="footer-text">
                    <span class="app-name">Pix Direto</span><br/>
                    Baixe o app na Play Store ou Apple gratuitamente
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;

        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Salvar QR Code Pix",
          UTI: "com.adobe.pdf",
        });

        Alert.alert("Sucesso", "QR Code salvo em PDF!");
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
    }
  };

  const isSmallScreen = height < 700;
  const activeKey = pixKeys.find((k) => k.isActive);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#EFF6FF" }}
      edges={["top", "bottom"]}
    >
      <Box flex={1} bg="$blue50">
        {/* Header */}
        <Box
          px="$4"
          pt={isSmallScreen ? "$3" : "$4"}
          pb={isSmallScreen ? "$2" : "$3"}
        >
          <HStack alignItems="center" mb="$4" position="relative">
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 12,
                padding: 8,
              }}
            >
              <ArrowLeft color="#3B82F6" size={24} />
            </Pressable>
            <VStack flex={1}>
              <Text size={isSmallScreen ? "2xl" : "3xl"} bold color="$gray800">
                Minhas Chaves Pix
              </Text>
              <Text size="sm" color="$gray600" mt="$1">
                {pixKeys.length}{" "}
                {pixKeys.length === 1
                  ? "chave cadastrada"
                  : "chaves cadastradas"}
              </Text>
            </VStack>

            {/* Home Button */}
            {pixKeys.length > 0 && (
              <Pressable
                onPress={() => navigation.navigate("Home")}
                style={{
                  padding: 8,
                  backgroundColor: "#32BCAD",
                  borderRadius: 20,
                }}
              >
                <Home color="#FFFFFF" size={24} />
              </Pressable>
            )}
          </HStack>

          {/* Donate Button */}
          <Button onPress={handleDonate} size="md" bg="$amber600" mb="$4">
            <ButtonIcon as={Coffee} mr="$2" />
            <ButtonText>☕ Doar um Café ao Desenvolvedor</ButtonText>
          </Button>
        </Box>

        <ScrollView style={{ flex: 1 }}>
          <Box px="$4">
            {/* Active Key Card */}
            {activeKey && (
              <Card
                size="md"
                mb="$4"
                style={{
                  backgroundColor: "#DBEAFE",
                  borderColor: "#3B82F6",
                  borderWidth: 2,
                }}
              >
                <VStack px="$4">
                  <HStack alignItems="center" mb="$2">
                    <Check color="#3B82F6" size={20} />
                    <Text size="sm" bold color="$blue700" ml="$2">
                      CHAVE ATIVA
                    </Text>
                  </HStack>
                  <Text size="lg" bold color="$gray800" mb="$1">
                    {activeKey.merchantName}
                  </Text>
                  <Text size="sm" color="$gray600" mb="$1">
                    {activeKey.pixKey}
                  </Text>
                  <Text size="xs" color="$gray500">
                    📍 {activeKey.merchantCity}
                  </Text>
                </VStack>
              </Card>
            )}

            {/* Keys List */}
            <Text size="md" bold color="$gray700" mb="$3">
              Todas as Chaves
            </Text>

            {pixKeys.length === 0 ? (
              <Card size="md" mb="$4">
                <VStack p="$6" alignItems="center">
                  <Text size="md" color="$gray500" textAlign="center">
                    Nenhuma chave cadastrada.{"\n"}Adicione sua primeira chave
                    Pix!
                  </Text>
                </VStack>
              </Card>
            ) : (
              <VStack space="sm" mb="$4">
                {pixKeys.map((key) => (
                  <Card
                    key={key.id}
                    size="md"
                    style={{
                      backgroundColor: "white",
                      borderColor: key.isActive ? "#3B82F6" : "#E5E7EB",
                      borderWidth: 1,
                    }}
                  >
                    <VStack px="$4">
                      <HStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb="$2"
                      >
                        <VStack flex={1}>
                          <Text size="md" bold color="$gray800">
                            {key.merchantName}
                          </Text>
                          <Text size="sm" color="$gray600" mt="$1">
                            {key.pixKey}
                          </Text>
                          <Text size="xs" color="$gray500" mt="$1">
                            📍 {key.merchantCity}
                          </Text>
                        </VStack>
                        {key.isActive && (
                          <Box bg="$blue100" rounded="$full" px="$3" py="$1">
                            <Text size="xs" bold color="$blue700">
                              ATIVA
                            </Text>
                          </Box>
                        )}
                      </HStack>

                      <HStack space="sm" mt="$3">
                        {!key.isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => handleSelectKey(key.id)}
                            flex={1}
                          >
                            <ButtonIcon as={Check} mr="$1" />
                            <ButtonText>Ativar</ButtonText>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() =>
                            navigation.navigate("Config", { editKeyId: key.id })
                          }
                          flex={1}
                        >
                          <ButtonIcon as={Edit} mr="$1" />
                          <ButtonText>Editar</ButtonText>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => handleGeneratePDF(key)}
                          style={{ borderColor: "#32BCAD" }}
                          flex={1}
                        >
                          <ButtonIcon as={FileDown} color="#32BCAD" mr="$1" />
                          <ButtonText style={{ color: "#32BCAD" }}>
                            PDF
                          </ButtonText>
                        </Button>
                        <Pressable
                          onPress={() => handleDeleteKey(key.id)}
                          style={{
                            borderWidth: 1,
                            borderColor: "#FCA5A5",
                            borderRadius: 8,
                            padding: 8,
                            justifyContent: "center",
                            alignItems: "center",
                            minWidth: 44,
                          }}
                        >
                          <Trash2 color="#EF4444" size={18} />
                        </Pressable>
                      </HStack>

                      {/* QR Code invisível para gerar PDF */}
                      <Box style={{ height: 0, overflow: "hidden" }}>
                        <QRCode
                          value={generatePixCode({
                            pixKey: key.pixKey,
                            merchantName: key.merchantName,
                            merchantCity: key.merchantCity,
                          })}
                          size={300}
                          getRef={(ref) => (qrCodeRefs.current[key.id] = ref)}
                        />
                      </Box>
                    </VStack>
                  </Card>
                ))}
              </VStack>
            )}

            {/* Add New Key Button */}
            <Button
              onPress={() => navigation.navigate("Config")}
              size="lg"
              mb="$4"
            >
              <ButtonIcon as={Plus} mr="$2" />
              <ButtonText>Adicionar Nova Chave Pix</ButtonText>
            </Button>

            {/* About Button - Discreto */}
            <Button
              onPress={() => navigation.navigate("About")}
              size="sm"
              variant="link"
              mb="$8"
            >
              <ButtonText size="xs" color="$coolGray500">
                Sobre • Política de Privacidade
              </ButtonText>
            </Button>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
