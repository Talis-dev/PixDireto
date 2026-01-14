import React, { useState, useEffect } from "react";
import { Vibration, Pressable, Dimensions, Image } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
} from "@gluestack-ui/themed";
import {
  Delete,
  QrCode,
  Settings,
  Key,
  ShoppingCart,
  Clock,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PixIcon } from "../icons/PixIcon";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function HomeScreen({ navigation, route }: any) {
  const [amount, setAmount] = useState("0");
  const [hasConfig, setHasConfig] = useState(false);
  const [activeMerchantName, setActiveMerchantName] = useState("");

  useEffect(() => {
    checkConfig();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      checkConfig();
      // Verifica se há um valor selecionado vindo da tela de produtos
      if (route.params?.selectedValue) {
        const valueInCents = Math.round(route.params.selectedValue * 100);
        setAmount(valueInCents.toString());
        // Limpa o parâmetro para não aplicar novamente
        navigation.setParams({ selectedValue: undefined });
      }
    });
    return unsubscribe;
  }, [navigation, route.params?.selectedValue]);

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
          <HStack justifyContent="space-between" alignItems="center">
            <HStack flex={1} space="sm">
              <Image
                source={require("../assets/PixDiretoLogo.png")}
                style={{
                  width: isSmallScreen ? 50 : 68,
                  height: isSmallScreen ? 30 : 38,
                  borderRadius: isSmallScreen ? 8 : 10,
                }}
              />
              <VStack flex={1}>
                <Text
                  size={isSmallScreen ? "2xl" : "3xl"}
                  bold
                  color="$gray800"
                >
                  Pix Direto
                </Text>
                <Text size="sm" color="$gray600" mt="$1">
                  {hasConfig
                    ? `${activeMerchantName}`
                    : "Configure sua chave Pix"}
                </Text>
              </VStack>
            </HStack>
            <HStack space="sm">
              <Pressable
                onPress={() => navigation.navigate("Products")}
                style={{
                  backgroundColor: "#10B981",
                  borderRadius: 50,
                  padding: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <ShoppingCart color="#FFFFFF" size={24} />
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("PixKeys")}
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
          <Text size="md" color="$gray500" mb="$1">
            Valor do Pix
          </Text>
          <Text size={isSmallScreen ? "5xl" : "6xl"} bold color="$blue600">
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
          {/* History Button - Above Keypad */}
          <Pressable
            onPress={() => navigation.navigate("History")}
            style={{
              backgroundColor: "#a6a8ff",
              borderRadius: 12,
              padding: 12,
              marginBottom: isSmallScreen ? 8 : 12,
              alignSelf: "flex-start",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Clock color="#FFFFFF" size={24} />
          </Pressable>

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
              <KeypadButton
                value="00"
                onPress={() => handleNumberPress("00")}
              />
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

            {/* Row 5 - Generate QR Code Button (Green) */}
            <Pressable
              onPress={handleGenerateQRCode}
              disabled={amount === "0"}
              style={{
                backgroundColor: amount === "0" ? "#D1D5DB" : "#10B981",
                borderRadius: 12,
                minHeight: isSmallScreen ? 56 : 64,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              <QrCode color="#FFFFFF" size={isSmallScreen ? 26 : 32} />
              <Text
                size={isSmallScreen ? "md" : "lg"}
                bold
                color="#FFFFFF"
                mt="$1"
                textAlign="center"
              >
                Gerar QR Code
              </Text>
            </Pressable>
          </VStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
