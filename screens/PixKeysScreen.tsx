import React, { useState, useEffect } from "react";
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
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidPixKey } from "../utils/pixGenerator";

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
      donationKey: "sua-chave-pix@email.com", //TODO: ALTERE AQUI para sua chave Pix
      donationName: "Desenvolvedor Pix Direto",
      donationCity: "São Paulo",
    });
  };

  const isSmallScreen = height < 700;
  const activeKey = pixKeys.find((k) => k.isActive);

  return (
    <Box flex={1} bg="$blue50">
      {/* Header */}
      <Box
        px="$4"
        pt={isSmallScreen ? "$8" : "$12"}
        pb={isSmallScreen ? "$3" : "$6"}
      >
        <HStack alignItems="center" mb="$4">
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
              {pixKeys.length === 1 ? "chave cadastrada" : "chaves cadastradas"}
            </Text>
          </VStack>
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
              <VStack p="$4">
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
                  <VStack p="$4">
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
                  </VStack>
                </Card>
              ))}
            </VStack>
          )}

          {/* Add New Key Button */}
          <Button
            onPress={() => navigation.navigate("Config")}
            size="lg"
            mb="$8"
          >
            <ButtonIcon as={Plus} mr="$2" />
            <ButtonText>Adicionar Nova Chave Pix</ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </Box>
  );
}
