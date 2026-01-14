import React, { useState, useEffect } from "react";
import { ScrollView, Alert, FlatList } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  Pressable,
  Divider,
} from "@gluestack-ui/themed";
import { ArrowLeft, Trash2, Copy, FileDown } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as Print from "expo-print";
import { SafeAreaView } from "react-native-safe-area-context";

interface PixHistory {
  id: string;
  pixKey: string;
  merchantName: string;
  pixCode: string;
  amount?: number;
  createdAt: string;
  isDonation: boolean;
}

export default function HistoryScreen({ navigation }: any) {
  const [history, setHistory] = useState<PixHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();

    // Recarregar histórico ao voltar para a tela
    const unsubscribe = navigation.addListener("focus", () => {
      loadHistory();
    });

    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const historyData = await AsyncStorage.getItem("pixHistory");
      const parsedHistory: PixHistory[] = historyData
        ? JSON.parse(historyData)
        : [];

      // Ordenar por data mais recente primeiro
      parsedHistory.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setHistory(parsedHistory);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      Alert.alert("Erro", "Não foi possível carregar o histórico.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPixCode = async (pixCode: string) => {
    try {
      await Clipboard.setStringAsync(pixCode);
      Alert.alert(
        "Sucesso",
        "Código Pix copiado para a área de transferência!"
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível copiar o código.");
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Limpar Histórico",
      "Tem certeza que deseja remover todo o histórico? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Limpar",
          onPress: async () => {
            try {
              await AsyncStorage.setItem("pixHistory", JSON.stringify([]));
              setHistory([]);
              Alert.alert("Sucesso", "Histórico limpo.");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível limpar o histórico.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount?: number) => {
    if (!amount || amount === 0) return "Valor livre";
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleExportPDF = async () => {
    try {
      if (history.length === 0) {
        Alert.alert("Aviso", "Não há histórico para exportar.");
        return;
      }

      let htmlContent = `
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
                font-family: Arial, sans-serif;
                padding: 20px;
                background: #f5f5f5;
              }
              .container {
                background: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 800px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 3px solid #32BCAD;
                padding-bottom: 20px;
              }
              .header h1 {
                color: #1a1a1a;
                font-size: 28px;
                margin-bottom: 10px;
              }
              .header p {
                color: #666;
                font-size: 14px;
              }
              .table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              .table th {
                background: #32BCAD;
                color: white;
                padding: 12px;
                text-align: left;
                font-weight: bold;
              }
              .table td {
                padding: 12px;
                border-bottom: 1px solid #e0e0e0;
                font-size: 13px;
              }
              .table tr:nth-child(even) {
                background: #f9f9f9;
              }
              .badge {
                display: inline-block;
                background: #FCD34D;
                color: #78350F;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #e0e0e0;
                padding-top: 20px;
              }
              .total {
                margin-top: 20px;
                padding: 15px;
                background: #F0F9FF;
                border-left: 4px solid #32BCAD;
                border-radius: 4px;
              }
              .total p {
                font-size: 14px;
                color: #1a1a1a;
                margin: 5px 0;
              }
              .total strong {
                color: #32BCAD;
                font-size: 18px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Histórico de PIX</h1>
                <p>Relatório gerado em ${new Date().toLocaleDateString(
                  "pt-BR",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}</p>
              </div>
              
              <table class="table">
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Mercador</th>
                    <th>Valor</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
      `;

      let totalAmount = 0;

      history.forEach((item) => {
        const amount = item.amount || 0;
        totalAmount += amount;

        const formattedDate = new Date(item.createdAt).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );

        const formattedAmount = formatAmount(item.amount);
        const type = item.isDonation ? "Doação" : "Pagamento";

        htmlContent += `
                  <tr>
                    <td>${formattedDate}</td>
                    <td>${item.merchantName}</td>
                    <td>${formattedAmount}</td>
                    <td>${
                      item.isDonation
                        ? '<span class="badge">Doação</span>'
                        : "Pagamento"
                    }</td>
                  </tr>
        `;
      });

      const formattedTotal = totalAmount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      htmlContent += `
                </tbody>
              </table>

              <div class="total">
                <p>Total de transações: <strong>${history.length}</strong></p>
                <p>Valor total: <strong>${formattedTotal}</strong></p>
              </div>

              <div class="footer">
                <p>Pix Direto © 2024 | Relatório de histórico de transações</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const filename = `Historico_PIX_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      await Print.printAsync({
        html: htmlContent,
        fileName: filename,
        printerUrl: undefined,
      });

      Alert.alert("Sucesso", "Histórico exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      Alert.alert("Erro", "Não foi possível exportar o histórico.");
    }
  };

  const renderHistoryItem = ({ item }: { item: PixHistory }) => (
    <Box>
      <Pressable
        onPress={() => handleCopyPixCode(item.pixCode)}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack flex={1} space="xs">
            <HStack alignItems="center" space="sm">
              <Text bold color="$gray800" size="md">
                {item.merchantName}
              </Text>
              {item.isDonation && (
                <Box bg="$amber100" px="$2" py="$1" rounded="$md">
                  <Text size="xs" color="$amber700" bold>
                    Doação
                  </Text>
                </Box>
              )}
            </HStack>
            <Text color="$gray600" size="sm">
              {formatAmount(item.amount)}
            </Text>
            <Text color="$gray500" size="xs">
              {formatDate(item.createdAt)}
            </Text>
          </VStack>
          <VStack alignItems="flex-end" space="sm">
            <Pressable
              onPress={() => handleCopyPixCode(item.pixCode)}
              style={{
                padding: 8,
                backgroundColor: "#32BCAD20",
                borderRadius: 8,
              }}
            >
              <Copy color="#32BCAD" size={18} />
            </Pressable>
          </VStack>
        </HStack>
      </Pressable>
      <Divider my="$2" />
    </Box>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F0F9FF" }}
      edges={["top", "bottom"]}
    >
      <Box flex={1} bg="#F0F9FF">
        {/* Header */}
        <HStack
          px="$6"
          py="$4"
          alignItems="center"
          justifyContent="space-between"
          bg="#F0F9FF"
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ padding: 8, marginLeft: -8 }}
          >
            <ArrowLeft color="#3B82F6" size={24} />
          </Pressable>
          <Text size="2xl" bold color="$gray800">
            Histórico de PIX
          </Text>
          <Box width={40} />
        </HStack>

        {/* Content */}
        {history.length === 0 ? (
          <VStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            space="md"
            px="$6"
          >
            <Text size="lg" color="$gray600" textAlign="center">
              Nenhum PIX gerado ainda
            </Text>
            <Text size="sm" color="$gray500" textAlign="center">
              Seus códigos PIX gerados aparecerão aqui
            </Text>
          </VStack>
        ) : (
          <>
            <FlatList
              data={history}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 8,
                paddingVertical: 8,
              }}
              scrollEnabled={true}
            />
            <Box px="$6" pb="$6" pt="$4">
              <VStack space="md">
                <Button
                  size="lg"
                  onPress={handleExportPDF}
                  style={{
                    backgroundColor: "#32BCAD",
                  }}
                >
                  <ButtonIcon as={FileDown} mr="$2" />
                  <ButtonText>Exportar PDF</ButtonText>
                </Button>
                <Button
                  size="lg"
                  action="negative"
                  onPress={handleClearHistory}
                  variant="outline"
                >
                  <ButtonText>Limpar Histórico</ButtonText>
                  <ButtonIcon as={Trash2} ml="$2" />
                </Button>
              </VStack>
            </Box>
          </>
        )}
      </Box>
    </SafeAreaView>
  );
}
