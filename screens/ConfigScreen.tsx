import React, { useState, useEffect } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  BackHandler,
  Modal,
  FlatList,
  Image,
} from "react-native";
import { BankImage } from "../components/BankImage";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  ButtonIcon,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  Divider,
} from "@gluestack-ui/themed";
import { Save, ArrowLeft, Home, ChevronDown } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidPixKey } from "../utils/pixGenerator";
import { BANKS, Bank } from "../utils/banks";
import { PixIcon } from "../icons/PixIcon";
import { SafeAreaView } from "react-native-safe-area-context";

interface PixKey {
  id: string;
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  bankId?: string;
  isActive: boolean;
}

export default function ConfigScreen({ navigation, route }: any) {
  const [pixKey, setPixKey] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [errors, setErrors] = useState({ pixKey: "", name: "", city: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editKeyId, setEditKeyId] = useState<string | null>(null);
  const [hasKeys, setHasKeys] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    // Listener para o botão voltar do Android
    // Se é primeira vez (sem chaves cadastradas), sai do app ao invés de voltar
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isFirstTime) {
          // Sair do app na primeira vez
          BackHandler.exitApp();
          return true;
        }
        // Deixar a navegação normal acontecer
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isFirstTime]);

  const loadConfig = async () => {
    try {
      // Verificar se tem chaves cadastradas
      const keysData = await AsyncStorage.getItem("pixKeys");
      const keys: PixKey[] = keysData ? JSON.parse(keysData) : [];
      const hasExistingKeys = keys.length > 0;
      setHasKeys(hasExistingKeys);
      setIsFirstTime(!hasExistingKeys);

      const editId = route?.params?.editKeyId;

      if (editId) {
        // Modo de edição
        setIsEditing(true);
        setEditKeyId(editId);

        const keyToEdit = keys.find((k) => k.id === editId);
        if (keyToEdit) {
          setPixKey(keyToEdit.pixKey);
          setName(keyToEdit.merchantName);
          setCity(keyToEdit.merchantCity);
          if (keyToEdit.bankId) {
            const bank = BANKS.find((b) => b.id === keyToEdit.bankId);
            setSelectedBank(bank || null);
          }
          if (selectedBank) {
            await AsyncStorage.setItem("merchantBankId", selectedBank.id);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { pixKey: "", name: "", city: "" };
    let isValid = true;

    if (!pixKey.trim()) {
      newErrors.pixKey = "Chave Pix é obrigatória";
      isValid = false;
    } else if (!isValidPixKey(pixKey)) {
      newErrors.pixKey = "Chave Pix inválida";
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
      isValid = false;
    } else if (name.trim().length < 3) {
      newErrors.name = "Nome deve ter no mínimo 3 caracteres";
      isValid = false;
    }

    if (!city.trim()) {
      newErrors.city = "Cidade é obrigatória";
      isValid = false;
    } else if (city.trim().length < 3) {
      newErrors.city = "Cidade deve ter no mínimo 3 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const keysData = await AsyncStorage.getItem("pixKeys");
      let keys: PixKey[] = keysData ? JSON.parse(keysData) : [];

      if (isEditing && editKeyId) {
        // Atualizar chave existente
        keys = keys.map((key) =>
          key.id === editKeyId
            ? {
                ...key,
                pixKey: pixKey.trim(),
                merchantName: name.trim(),
                merchantCity: city.trim(),
                bankId: selectedBank?.id,
              }
            : key
        );

        // Atualizar valores antigos se for a chave ativa
        const editedKey = keys.find((k) => k.id === editKeyId);
        if (editedKey?.isActive) {
          await AsyncStorage.setItem("pixKey", pixKey.trim());
          await AsyncStorage.setItem("merchantName", name.trim());
          await AsyncStorage.setItem("merchantCity", city.trim());
          if (selectedBank) {
            await AsyncStorage.setItem("merchantBankId", selectedBank.id);
          }
        }

        Alert.alert("Sucesso", "Chave Pix atualizada!");
      } else {
        // Adicionar nova chave
        const newKey: PixKey = {
          id: Date.now().toString(),
          pixKey: pixKey.trim(),
          merchantName: name.trim(),
          merchantCity: city.trim(),
          bankId: selectedBank?.id,
          isActive: keys.length === 0, // Primeira chave é ativa por padrão
        };

        keys.push(newKey);

        // Se for a primeira chave, salvar no formato antigo também
        if (newKey.isActive) {
          await AsyncStorage.setItem("pixKey", newKey.pixKey);
          await AsyncStorage.setItem("merchantName", newKey.merchantName);
          await AsyncStorage.setItem("merchantCity", newKey.merchantCity);
        }

        Alert.alert("Sucesso", "Chave Pix adicionada!");
      }

      await AsyncStorage.setItem("pixKeys", JSON.stringify(keys));

      // Se é primeira vez, redirecionar para Home
      if (!isEditing && !hasKeys) {
        navigation.navigate("Home");
      } else {
        // Caso contrário, voltar para PixKeys
        navigation.navigate("PixKeys");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      Alert.alert("Erro", "Não foi possível salvar a chave.");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F0F9FF" }}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1, backgroundColor: "#F0F9FF" }}>
          <Box px="$6" pt="$3" pb="$8">
            {/* Back Button - Só mostrar se não é primeira vez */}
            {!isFirstTime && (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{
                  position: "absolute",
                  top: 12,
                  left: 24,
                  zIndex: 10,
                  padding: 8,
                }}
              >
                <ArrowLeft color="#3B82F6" size={24} />
              </Pressable>
            )}
            {/* Home Button */}
            {hasKeys && (
              <Pressable
                onPress={() => navigation.navigate("Home")}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 24,
                  zIndex: 10,
                  padding: 8,
                  backgroundColor: "#32BCAD",
                  borderRadius: 20,
                }}
              >
                <Home color="#FFFFFF" size={24} />
              </Pressable>
            )}
            {/* Header */}
            <VStack space="lg" alignItems="center" mb="$8">
              <Box bg="#32BCAD" rounded="$full" p="$4" mb="$2">
                <PixIcon width={32} height={32} />
              </Box>
              <Text size="3xl" bold color="$gray800">
                {isEditing ? "Editar Chave Pix" : "Nova Chave Pix"}
              </Text>
              <Text size="md" color="$gray600" textAlign="center">
                {isEditing
                  ? "Atualize os dados da sua chave Pix"
                  : "Adicione uma nova chave para receber pagamentos"}
              </Text>
            </VStack>

            {/* Form */}
            <VStack space="xl">
              {/* Bank Selection */}
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>
                    Instituição Bancária
                  </FormControlLabelText>
                </FormControlLabel>
                <Pressable
                  onPress={() => setShowBankModal(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: "white",
                  }}
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center" space="md" flex={1}>
                      {selectedBank ? (
                        <>
                          <BankImage
                            bankId={selectedBank.id}
                            source={selectedBank.logo}
                            width={40}
                            height={40}
                            resizeMode="contain"
                          />
                          <VStack flex={1}>
                            <Text bold color="$gray800" size="md">
                              {selectedBank.name}
                            </Text>
                            <Text size="xs" color="$gray500">
                              Código: {selectedBank.code}
                            </Text>
                          </VStack>
                        </>
                      ) : (
                        <Text color="$gray400">Selecione um banco</Text>
                      )}
                    </HStack>
                    <ChevronDown
                      color="#9CA3AF"
                      size={20}
                      style={{ marginLeft: 8 }}
                    />
                  </HStack>
                </Pressable>
              </FormControl>

              <FormControl isInvalid={!!errors.pixKey}>
                <FormControlLabel>
                  <FormControlLabelText>Chave Pix</FormControlLabelText>
                </FormControlLabel>
                <Input variant="outline" size="lg">
                  <InputField
                    placeholder="CPF, Email, Telefone ou Chave Aleatória"
                    value={pixKey}
                    onChangeText={(text) => {
                      setPixKey(text);
                      if (errors.pixKey) setErrors({ ...errors, pixKey: "" });
                    }}
                  />
                </Input>
                {errors.pixKey ? (
                  <FormControlError>
                    <FormControlErrorText>{errors.pixKey}</FormControlErrorText>
                  </FormControlError>
                ) : (
                  <FormControlHelper>
                    <FormControlHelperText size="xs">
                      Ex: 000.000.000-00, email@example.com, +5511999999999
                    </FormControlHelperText>
                  </FormControlHelper>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.name}>
                <FormControlLabel>
                  <FormControlLabelText>Nome Completo</FormControlLabelText>
                </FormControlLabel>
                <Input variant="outline" size="lg">
                  <InputField
                    placeholder="Seu nome ou nome da empresa"
                    value={name}
                    maxLength={25}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                  />
                </Input>
                {errors.name && (
                  <FormControlError>
                    <FormControlErrorText>{errors.name}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.city}>
                <FormControlLabel>
                  <FormControlLabelText>Cidade</FormControlLabelText>
                </FormControlLabel>
                <Input variant="outline" size="lg">
                  <InputField
                    placeholder="Sua cidade"
                    value={city}
                    maxLength={15}
                    onChangeText={(text) => {
                      setCity(text);
                      if (errors.city) setErrors({ ...errors, city: "" });
                    }}
                  />
                </Input>
                {errors.city && (
                  <FormControlError>
                    <FormControlErrorText>{errors.city}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </VStack>

            {/* Save Button */}
            <Button size="lg" onPress={handleSave} mt="$8">
              <ButtonIcon as={Save} mr="$2" />
              <ButtonText>
                {isEditing ? "Atualizar Chave" : "Adicionar Chave"}
              </ButtonText>
            </Button>

            {/* Info Card */}
            <Box
              mt="$8"
              bg="$blue50"
              rounded="$xl"
              p="$4"
              borderColor="$blue200"
              borderWidth={1}
            >
              <Text size="md" bold color="$blue800" mb="$2">
                ℹ️ Informações Importantes
              </Text>
              <Text size="sm" color="$blue700" lineHeight="$sm">
                • Seus dados são salvos apenas no seu dispositivo{"\n"}• A chave
                Pix deve estar ativa na sua conta{"\n"}• O nome será exibido
                para quem efetuar o pagamento
              </Text>
            </Box>
          </Box>
        </ScrollView>

        {/* Bank Selection Modal */}
        <Modal
          visible={showBankModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowBankModal(false)}
        >
          <Box flex={1} bg="rgba(0,0,0,0.5)" justifyContent="flex-end">
            <Box
              bg="white"
              rounded="$3xl"
              pt="$6"
              pb="$8"
              maxHeight="80%"
              style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            >
              {/* Header */}
              <HStack
                px="$6"
                pb="$4"
                justifyContent="space-between"
                alignItems="center"
                borderBottomWidth={1}
                borderBottomColor="$gray200"
              >
                <Text size="2xl" bold color="$gray800">
                  Selecione seu banco
                </Text>
                <Pressable
                  onPress={() => setShowBankModal(false)}
                  style={{ padding: 8 }}
                >
                  <Text size="2xl" color="$gray500">
                    ×
                  </Text>
                </Pressable>
              </HStack>

              {/* Bank List */}
              <FlatList
                data={BANKS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setSelectedBank(item);
                      setShowBankModal(false);
                    }}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "#F3F4F6",
                    }}
                  >
                    <HStack alignItems="center" space="md">
                      <BankImage
                        bankId={item.id}
                        source={item.logo}
                        width={40}
                        height={40}
                        resizeMode="contain"
                      />
                      <VStack flex={1}>
                        <Text bold color="$gray800" size="md">
                          {item.name}
                        </Text>
                        <Text size="xs" color="$gray500">
                          Código: {item.code}
                        </Text>
                      </VStack>
                      {selectedBank?.id === item.id && (
                        <Box
                          width={24}
                          height={24}
                          rounded="$full"
                          bg="#32BCAD"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Text bold color="white">
                            ✓
                          </Text>
                        </Box>
                      )}
                    </HStack>
                  </Pressable>
                )}
                scrollEnabled={true}
                contentContainerStyle={{ paddingVertical: 8 }}
              />
            </Box>
          </Box>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
