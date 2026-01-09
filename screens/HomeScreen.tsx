import React, { useState, useEffect } from "react";
import { Vibration, Pressable } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
} from "@gluestack-ui/themed";
import { Delete, QrCode, Settings } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }: any) {
  const [amount, setAmount] = useState("0");
  const [hasConfig, setHasConfig] = useState(false);

  useEffect(() => {
    checkConfig();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      checkConfig();
    });
    return unsubscribe;
  }, [navigation]);

  const checkConfig = async () => {
    try {
      const pixKey = await AsyncStorage.getItem("pixKey");
      const name = await AsyncStorage.getItem("merchantName");
      const city = await AsyncStorage.getItem("merchantCity");

      setHasConfig(!!(pixKey && name && city));
    } catch (error) {
      console.error("Erro ao verificar configuração:", error);
    }
  };

  const handleNumberPress = (num: string) => {
    Vibration.vibrate(10);
    if (amount === "0") {
      setAmount(num);
    } else if (amount.length < 10) {
      setAmount(amount + num);
    }
  };

  const handleDelete = () => {
    Vibration.vibrate(10);
    if (amount.length === 1) {
      setAmount("0");
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const formatCurrency = (value: string): string => {
    const numValue = parseFloat(value) / 100;
    return numValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleGenerateQRCode = () => {
    if (!hasConfig) {
      navigation.navigate("Config");
      return;
    }

    const numAmount = parseFloat(amount) / 100;
    if (numAmount > 0) {
      navigation.navigate("QRCode", { amount: numAmount });
    }
  };

  const KeypadButton = ({
    value,
    onPress,
  }: {
    value: string;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        height: 80,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#F3F4F6",
      }}
    >
      <Text size="2xl" bold color="$gray800">
        {value}
      </Text>
    </Pressable>
  );

  return (
    <Box flex={1} bg="$blue50">
      {/* Header */}
      <Box px="$6" pt="$12" pb="$6">
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Text size="3xl" bold color="$gray800">
              Pix Direto
            </Text>
            <Text size="md" color="$gray600" mt="$1">
              {hasConfig ? "Digite o valor" : "Configure sua chave Pix"}
            </Text>
          </VStack>
          <Pressable
            onPress={() => navigation.navigate("Config")}
            style={{
              backgroundColor: "white",
              borderRadius: 50,
              padding: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Settings color="#3B82F6" size={24} />
          </Pressable>
        </HStack>
      </Box>

      {/* Amount Display */}
      <Box px="$6" py="$8" alignItems="center">
        <Text size="sm" color="$gray500" mb="$2">
          Valor do Pix
        </Text>
        <Text size="5xl" bold color="$blue600">
          {formatCurrency(amount)}
        </Text>
      </Box>

      {/* Custom Keypad */}
      <Box flex={1} px="$6" pb="$8" justifyContent="flex-end">
        <VStack space="md">
          {/* Row 1 */}
          <HStack space="md">
            <Box flex={1}>
              <KeypadButton value="1" onPress={() => handleNumberPress("1")} />
            </Box>
            <Box flex={1}>
              <KeypadButton value="2" onPress={() => handleNumberPress("2")} />
            </Box>
            <Box flex={1}>
              <KeypadButton value="3" onPress={() => handleNumberPress("3")} />
            </Box>
          </HStack>

          {/* Row 2 */}
          <HStack space="md">
            <Box flex={1}>
              <KeypadButton value="4" onPress={() => handleNumberPress("4")} />
            </Box>
            <Box flex={1}>
              <KeypadButton value="5" onPress={() => handleNumberPress("5")} />
            </Box>
            <Box flex={1}>
              <KeypadButton value="6" onPress={() => handleNumberPress("6")} />
            </Box>
          </HStack>

          {/* Row 3 */}
          <HStack space="md">
            <Box flex={1}>
              <KeypadButton value="7" onPress={() => handleNumberPress("7")} />
            </Box>
            <Box flex={1}>
              <KeypadButton value="8" onPress={() => handleNumberPress("8")} />
            </Box>
            <Box flex={1}>
              <KeypadButton value="9" onPress={() => handleNumberPress("9")} />
            </Box>
          </HStack>

          {/* Row 4 */}
          <HStack space="md">
            <Box flex={1}>
              <KeypadButton
                value="00"
                onPress={() => handleNumberPress("00")}
              />
            </Box>
            <Box flex={1}>
              <KeypadButton value="0" onPress={() => handleNumberPress("0")} />
            </Box>
            <Box flex={1}>
              <Pressable
                onPress={handleDelete}
                style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: 16,
                  height: 80,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: "#FEE2E2",
                }}
              >
                <Delete color="#EF4444" size={28} />
              </Pressable>
            </Box>
          </HStack>
        </VStack>

        {/* Generate QR Code Button */}
        <Button
          onPress={handleGenerateQRCode}
          size="lg"
          mt="$6"
          isDisabled={amount === "0"}
        >
          <ButtonIcon as={QrCode} mr="$2" />
          <ButtonText>Gerar QR Code</ButtonText>
        </Button>

        {!hasConfig && (
          <Box
            mt="$4"
            bg="$yellow50"
            rounded="$xl"
            p="$4"
            borderColor="$yellow200"
            borderWidth={1}
          >
            <Text size="sm" color="$yellow800" textAlign="center">
              ⚠️ Configure sua chave Pix antes de gerar o QR Code
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

