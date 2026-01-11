import React from "react";
import { ScrollView, Linking, Image } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  Card,
} from "@gluestack-ui/themed";
import { ArrowLeft, ExternalLink, Shield, Heart } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import packageJson from "../package.json";

export default function AboutScreen({ navigation }: any) {
  const openPrivacyPolicy = () => {
    Linking.openURL("https://pix-direto.vercel.app/");
  };

  const openWebsite = () => {
    Linking.openURL("https://staranytech.com");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <Box flex={1} bg="$blue50">
        {/* Header */}
        <Box px="$4" pt="$3" pb="$2">
          <HStack alignItems="center" space="md">
            <Button
              size="sm"
              variant="link"
              onPress={() => navigation.goBack()}
            >
              <ButtonIcon as={ArrowLeft} color="$blue600" size="xl" />
            </Button>
            <Text size="xl" bold color="$blue900">
              Sobre o App
            </Text>
          </HStack>
        </Box>

        <ScrollView>
          <Box p="$4">
            {/* Logo e Versão */}
            <Card size="md" variant="elevated" mb="$4">
              <VStack space="md" alignItems="center" py="$4">
                <Image
                  source={require("../assets/icon.png")}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                  }}
                />
                <Text size="2xl" bold color="$blue900">
                  PixDireto
                </Text>
                <Text size="sm" color="$coolGray600">
                  Versão {packageJson.version}
                </Text>
              </VStack>
            </Card>

            {/* Descrição */}
            <Card size="md" variant="elevated" mb="$4">
              <VStack space="sm" p="$4">
                <Text size="lg" bold color="$blue900" mb="$2">
                  📱 Sobre o Aplicativo
                </Text>
                <Text size="sm" color="$coolGray700" lineHeight="$lg">
                  O PixDireto é um aplicativo gratuito e profissional para gerar
                  QR Codes Pix de forma rápida e segura. Gerencie múltiplas
                  chaves, cadastre produtos e exporte em PDF - tudo funcionando
                  100% offline!
                </Text>
              </VStack>
            </Card>

            {/* Recursos */}
            <Card size="md" variant="elevated" mb="$4">
              <VStack space="sm" p="$4">
                <Text size="lg" bold color="$blue900" mb="$2">
                  ✨ Recursos Principais
                </Text>
                <VStack space="xs">
                  <Text size="sm" color="$coolGray700">
                    • Geração instantânea de QR Codes Pix
                  </Text>
                  <Text size="sm" color="$coolGray700">
                    • Múltiplas chaves Pix (CPF, CNPJ, email, telefone)
                  </Text>
                  <Text size="sm" color="$coolGray700">
                    • Cadastro de produtos com valores fixos
                  </Text>
                  <Text size="sm" color="$coolGray700">
                    • Exportação profissional em PDF
                  </Text>
                  <Text size="sm" color="$coolGray700">
                    • Compartilhamento via WhatsApp, Email, etc
                  </Text>
                  <Text size="sm" color="$coolGray700">
                    • Funciona 100% offline
                  </Text>
                  <Text size="sm" color="$coolGray700">
                    • Seus dados ficam apenas no seu celular
                  </Text>
                </VStack>
              </VStack>
            </Card>

            {/* Privacidade */}
            <Card size="md" variant="elevated" mb="$4">
              <VStack space="md" p="$4">
                <HStack space="sm" alignItems="center">
                  <Shield size={24} color="#10B981" />
                  <Text size="lg" bold color="$blue900">
                    Privacidade e Segurança
                  </Text>
                </HStack>
                <Text size="sm" color="$coolGray700" lineHeight="$lg">
                  Seus dados são 100% seus! Todas as informações ficam
                  armazenadas apenas no seu celular. Não coletamos, não
                  compartilhamos e não enviamos nada para servidores externos.
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  action="secondary"
                  onPress={openPrivacyPolicy}
                >
                  <ButtonText>Ver Política de Privacidade</ButtonText>
                  <ButtonIcon as={ExternalLink} ml="$2" />
                </Button>
              </VStack>
            </Card>

            {/* Desenvolvedor */}
            <Card size="md" variant="elevated" mb="$4">
              <VStack space="md" p="$4">
                <HStack space="sm" alignItems="center">
                  <Heart size={24} color="#EF4444" />
                  <Text size="lg" bold color="$blue900">
                    Desenvolvido com ❤️
                  </Text>
                </HStack>
                <Text size="sm" color="$coolGray700">
                  Por: Star Any Tech
                </Text>
                <Text size="sm" color="$coolGray700">
                  Email: contato@staranytech.com
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  action="secondary"
                  onPress={openWebsite}
                >
                  <ButtonText>Visitar Website</ButtonText>
                  <ButtonIcon as={ExternalLink} ml="$2" />
                </Button>
              </VStack>
            </Card>

            {/* Agradecimentos */}
            <Card size="md" variant="elevated" mb="$4">
              <VStack space="sm" p="$4">
                <Text size="lg" bold color="$blue900" mb="$2">
                  🙏 Agradecimentos
                </Text>
                <Text size="sm" color="$coolGray700" lineHeight="$lg">
                  Obrigado por usar o PixDireto! Se você gostou do aplicativo,
                  considere avaliá-lo na Play Store e compartilhar com outros
                  empreendedores.
                </Text>
              </VStack>
            </Card>

            {/* Informações Legais */}
            <Box alignItems="center" py="$6">
              <Text size="xs" color="$coolGray500" textAlign="center">
                © 2026 Star Any Tech
              </Text>
              <Text size="xs" color="$coolGray500" textAlign="center" mt="$1">
                Todos os direitos reservados
              </Text>
              <Text
                size="xs"
                color="$coolGray500"
                textAlign="center"
                mt="$2"
                lineHeight="$sm"
              >
                Este aplicativo não tem vínculo com o Banco Central do Brasil ou
                instituições financeiras. QR Codes gerados seguem o padrão EMV
                do Pix.
              </Text>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
