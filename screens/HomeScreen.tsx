import React, { useState, useEffect } from "react";
import { Vibration, Pressable, Dimensions } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
} from "@gluestack-ui/themed";
import { Delete, QrCode, Settings, Key } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PixIcon } from "../icons/PixIcon";

const { height } = Dimensions.get("window");

export default function HomeScreen({ navigation }: any) {
  const [amount, setAmount] = useState("0");
  const [hasConfig, setHasConfig] = useState(false);
  const [activeMerchantName, setActiveMerchantName] = useState("");

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
      if (name) {
        setActiveMerchantName(name);
      }
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

  const isSmallScreen = height < 700;

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
        borderRadius: 12,
        minHeight: isSmallScreen ? 56 : 64,
        flex: 1,
        aspectRatio: 1.3,
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
      <Text size={isSmallScreen ? "xl" : "2xl"} bold color="$gray800">
        {value}
      </Text>
    </Pressable>
  );

  return (
    <Box flex={1} bg="$blue50">
      {/* Header */}
      <Box
        px="$4"
        pt={isSmallScreen ? "$8" : "$12"}
        pb={isSmallScreen ? "$3" : "$6"}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack flex={1}>
            <Text size={isSmallScreen ? "2xl" : "3xl"} bold color="$gray800">
              Pix Direto
            </Text>
            <Text size="sm" color="$gray600" mt="$1">
              {hasConfig ? `${activeMerchantName}` : "Configure sua chave Pix"}
            </Text>
          </VStack>
          <HStack space="sm">
            <Pressable
              onPress={() => navigation.navigate("PixKeys")}
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
              <Key color="#10B981" size={24} />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Config")}
              style={{
                backgroundColor: "#32BCAD",
                borderRadius: 50,
                padding: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <PixIcon width={24} height={24} />
            </Pressable>
          </HStack>
        </HStack>
      </Box>

      {/* Amount Display */}
      <Box px="$4" py={isSmallScreen ? "$3" : "$6"} alignItems="center">
        <Text size="xs" color="$gray500" mb="$1">
          Valor do Pix
        </Text>
        <Text size={isSmallScreen ? "3xl" : "4xl"} bold color="$blue600">
          {formatCurrency(amount)}
        </Text>
      </Box>

      {/* Custom Keypad */}
      <Box
        flex={1}
        px="$4"
        pb={isSmallScreen ? "$4" : "$6"}
        justifyContent="flex-end"
      >
        <VStack space={isSmallScreen ? "xs" : "sm"}>
          {/* Row 1 */}
          <HStack space={isSmallScreen ? "xs" : "sm"}>
            <KeypadButton value="1" onPress={() => handleNumberPress("1")} />
            <KeypadButton value="2" onPress={() => handleNumberPress("2")} />
            <KeypadButton value="3" onPress={() => handleNumberPress("3")} />
          </HStack>

          {/* Row 2 */}
          <HStack space={isSmallScreen ? "xs" : "sm"}>
            <KeypadButton value="4" onPress={() => handleNumberPress("4")} />
            <KeypadButton value="5" onPress={() => handleNumberPress("5")} />
            <KeypadButton value="6" onPress={() => handleNumberPress("6")} />
          </HStack>

          {/* Row 3 */}
          <HStack space={isSmallScreen ? "xs" : "sm"}>
            <KeypadButton value="7" onPress={() => handleNumberPress("7")} />
            <KeypadButton value="8" onPress={() => handleNumberPress("8")} />
            <KeypadButton value="9" onPress={() => handleNumberPress("9")} />
          </HStack>

          {/* Row 4 */}
          <HStack space={isSmallScreen ? "xs" : "sm"}>
            <KeypadButton value="00" onPress={() => handleNumberPress("00")} />
            <KeypadButton value="0" onPress={() => handleNumberPress("0")} />
            <Pressable
              onPress={handleDelete}
              style={{
                backgroundColor: "#FEF2F2",
                borderRadius: 12,
                minHeight: isSmallScreen ? 56 : 64,
                flex: 1,
                aspectRatio: 1.3,
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
              <Delete color="#EF4444" size={isSmallScreen ? 22 : 26} />
            </Pressable>
          </HStack>
        </VStack>

        {/* Generate QR Code Button */}
        <Button
          onPress={handleGenerateQRCode}
          size={isSmallScreen ? "md" : "lg"}
          mt={isSmallScreen ? "$3" : "$4"}
          isDisabled={amount === "0"}
        >
          <ButtonIcon as={QrCode} mr="$2" />
          <ButtonText>Gerar QR Code</ButtonText>
        </Button>

        {!hasConfig && (
          <Box
            mt="$3"
            bg="$yellow50"
            rounded="$xl"
            p="$3"
            borderColor="$yellow200"
            borderWidth={1}
          >
            <Text size="xs" color="$yellow800" textAlign="center">
              ⚠️ Configure sua chave Pix antes de gerar o QR Code
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
