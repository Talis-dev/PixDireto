import React, { useState, useEffect } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
} from "react-native";
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
} from "@gluestack-ui/themed";
import { Save, ArrowLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidPixKey } from "../utils/pixGenerator";
import { PixIcon } from "../icons/PixIcon";

interface PixKey {
  id: string;
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  isActive: boolean;
}

export default function ConfigScreen({ navigation, route }: any) {
  const [pixKey, setPixKey] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState({ pixKey: "", name: "", city: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editKeyId, setEditKeyId] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const editId = route?.params?.editKeyId;

      if (editId) {
        // Modo de edição
        setIsEditing(true);
        setEditKeyId(editId);

        const keysData = await AsyncStorage.getItem("pixKeys");
        if (keysData) {
          const keys: PixKey[] = JSON.parse(keysData);
          const keyToEdit = keys.find((k) => k.id === editId);
          if (keyToEdit) {
            setPixKey(keyToEdit.pixKey);
            setName(keyToEdit.merchantName);
            setCity(keyToEdit.merchantCity);
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
              }
            : key
        );

        // Atualizar valores antigos se for a chave ativa
        const editedKey = keys.find((k) => k.id === editKeyId);
        if (editedKey?.isActive) {
          await AsyncStorage.setItem("pixKey", pixKey.trim());
          await AsyncStorage.setItem("merchantName", name.trim());
          await AsyncStorage.setItem("merchantCity", city.trim());
        }

        Alert.alert("Sucesso", "Chave Pix atualizada!");
      } else {
        // Adicionar nova chave
        const newKey: PixKey = {
          id: Date.now().toString(),
          pixKey: pixKey.trim(),
          merchantName: name.trim(),
          merchantCity: city.trim(),
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
      navigation.navigate("PixKeys");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      Alert.alert("Erro", "Não foi possível salvar a chave.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ flex: 1, backgroundColor: "#F0F9FF" }}>
        <Box px="$6" pt="$12" pb="$8">
          {/* Back Button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              top: 48,
              left: 24,
              zIndex: 10,
              padding: 8,
            }}
          >
            <ArrowLeft color="#3B82F6" size={24} />
          </Pressable>

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
              Pix deve estar ativa na sua conta{"\n"}• O nome será exibido para
              quem efetuar o pagamento
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
