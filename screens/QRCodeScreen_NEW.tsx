import React, { useState, useEffect } from "react";
import { ScrollView, Alert } from "react-native";
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
import { ArrowLeft, Copy, Share2, CheckCircle } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generatePixCode } from "../utils/pixGenerator";

export default function QRCodeScreen({ route, navigation }: any) {
  const { amount } = route.params;
  const [pixCode, setPixCode] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePix();
  }, []);

  const generatePix = async () => {
    try {
      const pixKey = await AsyncStorage.getItem("pixKey");
      const name = await AsyncStorage.getItem("merchantName");
      const city = await AsyncStorage.getItem("merchantCity");

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

      await Clipboard.setStringAsync(message);
      Alert.alert(
        "Código Copiado",
        "O código Pix foi copiado. Você pode compartilhá-lo em qualquer aplicativo.",
        [{ text: "OK" }]
      );
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
    <Box flex={1} bg="$blue50">
      {/* Header */}
      <Box px="$6" pt="$12" pb="$6">
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
              QR Code Pix
            </Text>
            <Text size="md" color="$gray600" mt="$1">
              Escaneie para pagar
            </Text>
          </VStack>
        </HStack>
      </Box>

      <ScrollView style={{ flex: 1 }}>
        <Box px="$6">
          {/* Amount Display */}
          <Box alignItems="center" py="$6">
            <Text size="sm" color="$gray500" mb="$2">
              Valor a receber
            </Text>
            <Text size="5xl" bold color="$green600">
              {formatAmount(amount)}
            </Text>
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
                  <QRCode value={pixCode} size={280} />
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
              <Text bold>2.</Text> Ou envie o código copiado via WhatsApp/Email
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
  );
}
