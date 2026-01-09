import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, Text, TouchableOpacity } from "react-native";
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
  const [qrCodeRef, setQrCodeRef] = useState<any>(null);

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
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          "Erro",
          "Compartilhamento não disponível neste dispositivo."
        );
        return;
      }

      // Create a message with the Pix code
      const message = `Pague via Pix - ${merchantName}\nValor: R$ ${amount.toFixed(
        2
      )}\n\nCódigo Pix:\n${pixCode}`;

      // For sharing text, we'll use Clipboard and alert the user
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
    <View className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <View className="px-6 pt-12 pb-6 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4 p-2"
          activeOpacity={0.7}
        >
          <ArrowLeft color="#3B82F6" size={24} />
        </TouchableOpacity>
        <View>
          <Text className="text-3xl font-bold text-gray-800">QR Code Pix</Text>
          <Text className="text-gray-600 mt-1">Escaneie para pagar</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Amount Display */}
        <View className="items-center py-6">
          <Text className="text-gray-500 text-sm mb-2">Valor a receber</Text>
          <Text className="text-5xl font-bold text-green-600">
            {formatAmount(amount)}
          </Text>
        </View>

        {/* QR Code Card */}
        <View className="bg-white shadow-lg rounded-3xl overflow-hidden mb-6">
          <View className="p-8 items-center">
            {pixCode ? (
              <View className="bg-white p-6 rounded-2xl shadow-sm">
                <QRCode
                  value={pixCode}
                  size={280}
                  backgroundColor="white"
                  color="black"
                  getRef={(ref) => setQrCodeRef(ref)}
                />
              </View>
            ) : (
              <View className="bg-gray-100 rounded-2xl p-20">
                <Text className="text-gray-400 text-center">
                  Gerando QR Code...
                </Text>
              </View>
            )}

            {merchantName && (
              <View className="mt-6 items-center">
                <Text className="text-gray-500 text-sm">Beneficiário</Text>
                <Text className="text-gray-800 font-semibold text-lg mt-1">
                  {merchantName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mb-8">
          <TouchableOpacity
            onPress={handleCopyCode}
            className="rounded-xl py-4 px-6 flex-row items-center justify-center mb-3"
            style={{
              backgroundColor: copied ? "#DCFCE7" : "#3B82F6",
            }}
            activeOpacity={0.8}
          >
            {copied ? (
              <CheckCircle color="#10B981" size={24} />
            ) : (
              <Copy color="white" size={24} />
            )}
            <Text
              className={copied ? "text-green-700 font-semibold text-base ml-2" : "text-white font-semibold text-base ml-2"}
            >
              {copied ? "Código Copiado!" : "Copiar Código Pix"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            className="bg-white border-2 border-blue-500 rounded-xl py-4 px-6 flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Share2 color="#3B82F6" size={24} />
            <Text className="text-blue-600 font-semibold text-base ml-2">
              Compartilhar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View className="bg-blue-50 rounded-xl p-5 mb-8 border border-blue-200">
          <Text className="text-blue-800 font-semibold mb-3 text-base">
            📱 Como receber o pagamento
          </Text>
          <Text className="text-blue-700 text-sm leading-6">
            <Text className="font-semibold">1.</Text> Mostre este QR Code para o
            pagador{"\n"}
            <Text className="font-semibold">2.</Text> Ou envie o código copiado
            via WhatsApp/Email{"\n"}
            <Text className="font-semibold">3.</Text> O pagador escaneia ou cola
            o código no app do banco{"\n"}
            <Text className="font-semibold">4.</Text> O pagamento é confirmado
            em segundos!
          </Text>
        </View>

        {/* Code Preview */}
        {pixCode && (
          <View className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
            <Text className="text-gray-600 font-semibold mb-2 text-sm">
              Código Pix (Copia e Cola)
            </Text>
            <Text
              className="text-gray-700 text-xs font-mono"
              numberOfLines={3}
              ellipsizeMode="middle"
            >
              {pixCode}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
