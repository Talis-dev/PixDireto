import React, { useState, useEffect } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
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
import { Settings, Save } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidPixKey } from "../utils/pixGenerator";

export default function ConfigScreen({ navigation }: any) {
  const [pixKey, setPixKey] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState({ pixKey: "", name: "", city: "" });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const savedPixKey = await AsyncStorage.getItem("pixKey");
      const savedName = await AsyncStorage.getItem("merchantName");
      const savedCity = await AsyncStorage.getItem("merchantCity");

      if (savedPixKey) setPixKey(savedPixKey);
      if (savedName) setName(savedName);
      if (savedCity) setCity(savedCity);
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
      await AsyncStorage.setItem("pixKey", pixKey.trim());
      await AsyncStorage.setItem("merchantName", name.trim());
      await AsyncStorage.setItem("merchantCity", city.trim());

      navigation.navigate("Home");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ flex: 1, backgroundColor: "#F0F9FF" }}>
        <Box px="$6" pt="$12" pb="$8">
          {/* Header */}
          <VStack space="lg" alignItems="center" mb="$8">
            <Box bg="$blue600" rounded="$full" p="$4" mb="$2">
              <Settings color="white" size={32} />
            </Box>
            <Text size="3xl" bold color="$gray800">
              Configuração
            </Text>
            <Text size="md" color="$gray600" textAlign="center">
              Configure seus dados para receber pagamentos via Pix
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
          <Button size="lg" mt="$8" onPress={handleSave}>
            <ButtonIcon as={Save} mr="$2" />
            <ButtonText>Salvar Configurações</ButtonText>
          </Button>

          {/* Info Card */}
          <Box mt="$8" bg="$blue50" rounded="$xl" p="$4" borderColor="$blue200" borderWidth={1}>
            <Text size="md" bold color="$blue800" mb="$2">
              ℹ️ Informações Importantes
            </Text>
            <Text size="sm" color="$blue700" lineHeight="$sm">
              • Seus dados são salvos apenas no seu dispositivo{"\n"}
              • A chave Pix deve estar ativa na sua conta{"\n"}
              • O nome será exibido para quem efetuar o pagamento
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

