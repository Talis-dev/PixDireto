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
  Input,
  InputField,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@gluestack-ui/themed";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Home,
  ShoppingCart,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

interface Product {
  id: string;
  name: string;
  value: number;
}

export default function ProductsScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [productValue, setProductValue] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProducts();
    });
    return unsubscribe;
  }, [navigation]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await AsyncStorage.getItem("products");
      if (productsData) {
        const prods: Product[] = JSON.parse(productsData);
        setProducts(prods);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setLoading(false);
    }
  };

  const handleSelectProduct = async (product: Product) => {
    try {
      // Verifica se tem configuração de Pix
      const pixKey = await AsyncStorage.getItem("pixKey");
      const merchantName = await AsyncStorage.getItem("merchantName");
      const merchantCity = await AsyncStorage.getItem("merchantCity");

      if (!pixKey || !merchantName || !merchantCity) {
        Alert.alert(
          "Configuração necessária",
          "Configure sua chave Pix antes de gerar QR Code.",
          [{ text: "OK", onPress: () => navigation.navigate("Config") }]
        );
        return;
      }

      // Navega direto para QRCode com o valor do produto
      navigation.navigate("QRCode", {
        amount: product.value,
      });
    } catch (error) {
      console.error("Erro ao selecionar produto:", error);
      Alert.alert("Erro", "Não foi possível processar o produto.");
    }
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setProductName("");
    setProductValue("");
  };

  const handleStartEdit = (product: Product) => {
    setIsAdding(true);
    setEditingId(product.id);
    setProductName(product.name);
    // Formata o valor com separadores de milhares e decimais
    const formattedValue = formatInputValue((product.value * 100).toString());
    setProductValue(formattedValue);
  };

  const formatInputValue = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, "");

    if (!numbers) return "";

    // Converte para número e formata
    const numValue = parseInt(numbers);
    const valueInReais = numValue / 100;

    // Formata com separadores
    const formatted = valueInReais.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatted;
  };

  const handleValueChange = (text: string) => {
    const formatted = formatInputValue(text);
    setProductValue(formatted);
  };

  const handleSaveProduct = async () => {
    if (!productName.trim()) {
      Alert.alert("Erro", "Digite o nome do produto");
      return;
    }

    // Remove formatação e converte para número
    const cleanValue = productValue.replace(/\./g, "").replace(",", ".");
    const value = parseFloat(cleanValue);

    if (isNaN(value) || value <= 0) {
      Alert.alert("Erro", "Digite um valor válido maior que zero");
      return;
    }

    try {
      let updatedProducts: Product[];

      if (editingId) {
        // Editando produto existente
        updatedProducts = products.map((p) =>
          p.id === editingId ? { ...p, name: productName, value } : p
        );
      } else {
        // Adicionando novo produto
        const newProduct: Product = {
          id: Date.now().toString(),
          name: productName,
          value,
        };
        updatedProducts = [...products, newProduct];
      }

      setProducts(updatedProducts);
      await AsyncStorage.setItem("products", JSON.stringify(updatedProducts));

      setIsAdding(false);
      setProductName("");
      setProductValue("");
      setEditingId(null);

      Alert.alert(
        "Sucesso",
        editingId ? "Produto atualizado!" : "Produto adicionado!"
      );
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const product = products.find((p) => p.id === productId);

    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir "${product?.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedProducts = products.filter(
                (p) => p.id !== productId
              );
              setProducts(updatedProducts);
              await AsyncStorage.setItem(
                "products",
                JSON.stringify(updatedProducts)
              );
              Alert.alert("Sucesso", "Produto excluído!");
            } catch (error) {
              console.error("Erro ao excluir produto:", error);
              Alert.alert("Erro", "Não foi possível excluir o produto.");
            }
          },
        },
      ]
    );
  };

  const handleCancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setProductName("");
    setProductValue("");
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const isSmallScreen = height < 700;

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
                Produtos Salvos
              </Text>
              <Text size="sm" color="$gray600" mt="$1">
                {products.length}{" "}
                {products.length === 1
                  ? "produto cadastrado"
                  : "produtos cadastrados"}
              </Text>
            </VStack>

            {/* Home Button */}
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
          </HStack>

          {/* Add/Edit Form */}
          {isAdding && (
            <Card size="md" mb="$4" bg="$blue100">
              <VStack space="md" p="$4">
                <Text size="lg" bold color="$gray800">
                  {editingId ? "Editar Produto" : "Novo Produto"}
                </Text>

                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Nome do Produto</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Ex: Corte de cabelo"
                      value={productName}
                      onChangeText={setProductName}
                    />
                  </Input>
                </FormControl>

                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Valor (R$)</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="0,00"
                      value={productValue}
                      onChangeText={handleValueChange}
                      keyboardType="numeric"
                    />
                  </Input>
                </FormControl>

                <HStack space="sm">
                  <Button onPress={handleSaveProduct} flex={1} bg="$blue600">
                    <ButtonText>
                      {editingId ? "Atualizar" : "Salvar"}
                    </ButtonText>
                  </Button>
                  <Button
                    onPress={handleCancelEdit}
                    flex={1}
                    variant="outline"
                    borderColor="$gray400"
                  >
                    <ButtonText color="$gray700">Cancelar</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </Card>
          )}
        </Box>

        <ScrollView style={{ flex: 1 }}>
          <Box px="$4">
            {/* Products List */}
            {products.length === 0 ? (
              <Card size="md" mb="$4">
                <VStack p="$6" alignItems="center">
                  <ShoppingCart color="#9CA3AF" size={48} strokeWidth={1.5} />
                  <Text size="md" color="$gray500" textAlign="center" mt="$4">
                    Nenhum produto cadastrado.{"\n"}Adicione produtos com
                    valores pré-definidos!
                  </Text>
                </VStack>
              </Card>
            ) : (
              <VStack space="sm" mb="$4">
                {products.map((product) => (
                  <Pressable
                    key={product.id}
                    onPress={() => handleSelectProduct(product)}
                  >
                    <Card size="md" bg="white">
                      <HStack
                        px="$4"
                        py="$3"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <VStack flex={1}>
                          <Text size="md" bold color="$gray800">
                            {product.name}
                          </Text>
                          <Text size="xl" bold color="$green600" mt="$1">
                            {formatCurrency(product.value)}
                          </Text>
                        </VStack>

                        <HStack space="xs">
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              handleStartEdit(product);
                            }}
                            style={{
                              borderWidth: 1,
                              borderColor: "#BFDBFE",
                              borderRadius: 8,
                              padding: 8,
                            }}
                          >
                            <Edit color="#3B82F6" size={18} />
                          </Pressable>
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.id);
                            }}
                            style={{
                              borderWidth: 1,
                              borderColor: "#FCA5A5",
                              borderRadius: 8,
                              padding: 8,
                            }}
                          >
                            <Trash2 color="#EF4444" size={18} />
                          </Pressable>
                        </HStack>
                      </HStack>
                    </Card>
                  </Pressable>
                ))}
              </VStack>
            )}

            {/* Add New Product Button */}
            {!isAdding && (
              <Button onPress={handleStartAdd} size="lg" mb="$8">
                <ButtonIcon as={Plus} mr="$2" />
                <ButtonText>Adicionar Novo Produto</ButtonText>
              </Button>
            )}
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
