import React, { useState, useEffect } from "react";
import { ScrollView, Alert, Share } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  Card,
  Pressable,
} from "@gluestack-ui/themed";
import {
  ArrowLeft,
  Copy,
  Share2,
  CheckCircle,
  FileDown,
} from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generatePixCode } from "../utils/pixGenerator";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QRCodeScreen({ route, navigation }: any) {
  const { amount, isDonation, donationKey, donationName, donationCity } =
    route.params || {};
  const [pixCode, setPixCode] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [copied, setCopied] = useState(false);
  const qrCodeRef = React.useRef<any>(null);

  useEffect(() => {
    generatePix();
  }, []);

  const generatePix = async () => {
    try {
      let pixKey, name, city;

      if (isDonation) {
        // Usar dados de doação
        pixKey = donationKey;
        name = donationName;
        city = donationCity;
      } else {
        // Usar dados do usuário
        pixKey = await AsyncStorage.getItem("pixKey");
        name = await AsyncStorage.getItem("merchantName");
        city = await AsyncStorage.getItem("merchantCity");
      }

      if (!pixKey || !name || !city) {
        Alert.alert(
          "Configuração Incompleta",
          "Por favor, configure seus dados antes de gerar o QR Code.",
          [{ text: "OK", onPress: () => navigation.navigate("Config") }]
        );
        return;
      }

      setMerchantName(name);

      const code = generatePixCode({
        pixKey,
        merchantName: name,
        merchantCity: city,
        amount,
      });

      setPixCode(code);
    } catch (error) {
      console.error("Erro ao gerar código Pix:", error);
      Alert.alert("Erro", "Não foi possível gerar o código Pix.");
    }
  };

  const handleSavePDF = async () => {
    try {
      if (!qrCodeRef.current) {
        Alert.alert("Erro", "QR Code não está disponível.");
        return;
      }

      // Ler o ícone do app como base64
      const iconAsset = Asset.fromModule(require("../assets/icon.png"));
      await iconAsset.downloadAsync();
      // @ts-ignore - FileSystem tipos não são detectados corretamente
      const iconBase64 = await FileSystem.readAsStringAsync(
        iconAsset.localUri!,
        { encoding: "base64" }
      );

      // Obter QR Code como base64
      qrCodeRef.current.toDataURL(async (dataURL: string) => {
        const formattedAmount = amount
          ? amount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : "Valor livre";

        const title = isDonation ? "Doação" : "Pagamento Pix";

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
                  <div class="title">${title}</div>
                  ${
                    amount ? `<div class="amount">${formattedAmount}</div>` : ""
                  }
                </div>
                
                <div class="qrcode-wrapper">
                  <div class="qrcode-container">
                    <img src="data:image/png;base64,${dataURL}" alt="QR Code Pix" />
                  </div>
                </div>
                
                <div class="merchant-info">
                  <div class="merchant-name">${merchantName}</div>
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
      console.error("Erro ao salvar PDF:", error);
      Alert.alert("Erro", "Não foi possível salvar o PDF.");
    }
  };

  const handleCopyCode = async () => {
    try {
      await Clipboard.setStringAsync(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar código:", error);
      Alert.alert("Erro", "Não foi possível copiar o código.");
    }
  };

  const handleShare = async () => {
    try {
      const message = `Pague via Pix - ${merchantName}\nValor: R$ ${amount.toFixed(
        2
      )}\n\nCódigo Pix:\n${pixCode}`;

      const result = await Share.share({
        message: message,
        title: "Compartilhar Código Pix",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartilhado com um app específico
          console.log("Compartilhado com:", result.activityType);
        } else {
          // Compartilhado
          console.log("Código compartilhado");
        }
      } else if (result.action === Share.dismissedAction) {
        // Cancelado
        console.log("Compartilhamento cancelado");
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      Alert.alert("Erro", "Não foi possível compartilhar o código.");
    }
  };

  const formatAmount = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#EFF6FF" }}
      edges={["top", "bottom"]}
    >
      <Box flex={1} bg="$blue50">
        {/* Header */}
        <Box px="$6" pt="$3" pb="$3">
          <HStack alignItems="center">
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                padding: 8,
              }}
            >
              <ArrowLeft color="#3B82F6" size={24} />
            </Pressable>
            <VStack>
              <Text size="3xl" bold color="$gray800">
                {isDonation ? "☕ Doar um Café" : "QR Code Pix"}
              </Text>
              <Text size="md" color="$gray600" mt="$1">
                {isDonation ? "Obrigado pelo apoio!" : "Escaneie para pagar"}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <ScrollView style={{ flex: 1 }}>
          <Box px="$6" pb="$8">
            {/* Adiciona padding bottom para botões de navegação */}
            {/* Amount Display */}
            <Box alignItems="center" py="$6">
              <Text size="sm" color="$gray500" mb="$2">
                {isDonation ? "Valor da doação" : "Valor a receber"}
              </Text>
              <Text
                size="5xl"
                bold
                color={isDonation ? "$amber600" : "$green600"}
              >
                {formatAmount(amount)}
              </Text>
              {isDonation && (
                <Text size="sm" color="$amber700" mt="$2" textAlign="center">
                  ☕ Sua doação ajuda a manter este app gratuito!
                </Text>
              )}
            </Box>

            {/* QR Code Card */}
            <Card
              size="lg"
              mb="$6"
              style={{
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                borderRadius: 24,
              }}
            >
              <Box p="$8" alignItems="center">
                {pixCode ? (
                  <Box
                    bg="white"
                    p="$6"
                    rounded="$2xl"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <QRCode
                      value={pixCode}
                      size={280}
                      getRef={(ref) => (qrCodeRef.current = ref)}
                    />
                  </Box>
                ) : (
                  <Box bg="$gray100" rounded="$2xl" p="$20">
                    <Text color="$gray400" textAlign="center">
                      Gerando QR Code...
                    </Text>
                  </Box>
                )}

                {merchantName && (
                  <VStack mt="$6" alignItems="center">
                    <Text size="sm" color="$gray500">
                      Beneficiário
                    </Text>
                    <Text size="lg" bold color="$gray800" mt="$1">
                      {merchantName}
                    </Text>
                  </VStack>
                )}
              </Box>
            </Card>

            {/* Action Buttons */}
            <VStack space="md" mb="$8">
              <Button
                onPress={handleCopyCode}
                size="lg"
                bg={copied ? "$green100" : "$blue600"}
              >
                <ButtonIcon as={copied ? CheckCircle : Copy} mr="$2" />
                <ButtonText color={copied ? "$green700" : "white"}>
                  {copied ? "Código Copiado!" : "Copiar Código Pix"}
                </ButtonText>
              </Button>

              <Button onPress={handleSavePDF} size="lg" bg="$purple600">
                <ButtonIcon as={FileDown} mr="$2" />
                <ButtonText>Salvar PDF para Impressão</ButtonText>
              </Button>

              <Button onPress={handleShare} size="lg" variant="outline">
                <ButtonIcon as={Share2} mr="$2" />
                <ButtonText>Compartilhar</ButtonText>
              </Button>
            </VStack>

            {/* Instructions */}
            <Box
              mb="$8"
              bg="$blue50"
              rounded="$xl"
              p="$5"
              borderColor="$blue200"
              borderWidth={1}
            >
              <Text size="md" bold color="$blue800" mb="$3">
                📱 Como receber o pagamento
              </Text>
              <Text size="sm" color="$blue700" lineHeight="$lg">
                <Text bold>1.</Text> Mostre este QR Code para o pagador{"\n"}
                <Text bold>2.</Text> Ou envie o código copiado via
                WhatsApp/Email
                {"\n"}
                <Text bold>3.</Text> O pagador escaneia ou cola o código no app
                do banco{"\n"}
                <Text bold>4.</Text> O pagamento é confirmado em segundos!
              </Text>
            </Box>

            {/* Code Preview */}
            {pixCode && (
              <Box
                mb="$8"
                bg="$gray50"
                rounded="$xl"
                p="$4"
                borderColor="$gray200"
                borderWidth={1}
              >
                <Text size="sm" bold color="$gray600" mb="$2">
                  Código Pix (Copia e Cola)
                </Text>
                <Text size="xs" color="$gray700" numberOfLines={3}>
                  {pixCode}
                </Text>
              </Box>
            )}
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
