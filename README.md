# 💳 Pix Direto

Aplicativo mobile para geração de QR Codes Pix de forma rápida e profissional.

## 🚀 Stack Tecnológica

- **Expo** - Framework React Native
- **HeroUI Native v3** - Biblioteca de componentes UI modernos
- **Tailwind v4** via **Uniwind** - Estilização
- **TypeScript** - Tipagem estática
- **Lucide React Native** - Ícones
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Armazenamento local

## ✨ Funcionalidades

### 🔧 Tela de Configuração

- Formulário para cadastro de Chave Pix (CPF, Email, Telefone ou Chave Aleatória)
- Campo para Nome do beneficiário (exibido no QR Code)
- Campo para Cidade
- Validação completa de dados
- Armazenamento seguro local com AsyncStorage

### 🏠 Tela Home

- Teclado numérico customizado com design moderno
- Display de valor em tempo real formatado em R$
- Feedback tátil (vibração) ao pressionar teclas
- Validação: só permite gerar QR Code com configuração completa
- Acesso rápido às configurações

### 📱 Tela QR Code

- Geração de QR Code Pix seguindo padrão EMV Co
- **CRC16 CCITT-FALSE** para validação em todos os bancos brasileiros
- Display do valor a receber
- Botão para copiar código Pix (Copia e Cola)
- Botão para compartilhar código
- Instruções de uso para o recebedor
- Preview do código Pix completo

## 🔐 Geração de Pix Estático (BR Code)

O app implementa a especificação completa do **EMV Co** para QR Codes Pix:

### Campos Implementados:

- **00** - Payload Format Indicator
- **26** - Merchant Account Information (Chave Pix)
- **52** - Merchant Category Code
- **53** - Transaction Currency (BRL)
- **54** - Transaction Amount
- **58** - Country Code (BR)
- **59** - Merchant Name
- **60** - Merchant City
- **62** - Additional Data (TxID)
- **63** - CRC16 (CCITT-FALSE)

### Algoritmo CRC16:

```typescript
- Polinômio: 0x1021
- Valor inicial: 0xFFFF
- Padrão: CCITT-FALSE
- Saída: 4 dígitos hexadecimais
```

## 📁 Estrutura de Arquivos

```
PixDireto/
├── screens/
│   ├── ConfigScreen.tsx    # Tela de configuração
│   ├── HomeScreen.tsx       # Tela principal com teclado
│   └── QRCodeScreen.tsx     # Tela de exibição do QR Code
├── utils/
│   └── pixGenerator.ts      # Lógica de geração de Pix + CRC16
├── App.js                   # Configuração de navegação e providers
├── global.css              # Configuração Tailwind + HeroUI
├── package.json
└── tsconfig.json
```

## 🎯 Como Usar

### 1. Instalação

```bash
npm install
```

### 2. Executar o App

```bash
# iOS
npm run ios

# Android
npm run android

# Web (desenvolvimento)
npm run web
```

### 3. Primeiro Acesso

1. O app abrirá na tela de **Configuração**
2. Preencha sua **Chave Pix** (CPF, Email, Telefone ou Chave Aleatória)
3. Informe seu **Nome** (será exibido para quem pagar)
4. Informe sua **Cidade**
5. Toque em **Salvar Configurações**

### 4. Gerando QR Code

1. Na tela **Home**, digite o valor desejado usando o teclado numérico
2. Toque em **Gerar QR Code**
3. Mostre o QR Code para o pagador OU
4. Copie o código Pix e envie via WhatsApp/Email

## 🔒 Segurança e Privacidade

- ✅ Todos os dados são armazenados **apenas no dispositivo**
- ✅ Nenhuma informação é enviada para servidores externos
- ✅ Código 100% open source e auditável
- ✅ Geração de Pix segue padrão oficial do Banco Central

## 🎨 Design

O app utiliza um design moderno e clean com:

- Gradientes sutis (azul/branco)
- Cards com sombras suaves
- Feedback visual em todas as interações
- Tema responsivo e acessível
- Componentes HeroUI Native para consistência

## 📝 Validações Implementadas

### Chave Pix:

- ✅ CPF (11 dígitos)
- ✅ CNPJ (14 dígitos)
- ✅ Email (formato válido)
- ✅ Telefone (+5511999999999)
- ✅ Chave Aleatória (UUID)

### Dados do Beneficiário:

- ✅ Nome mínimo 3 caracteres, máximo 25
- ✅ Cidade mínimo 3 caracteres, máximo 15
- ✅ Todos os campos obrigatórios

## 🛠 Tecnologias Utilizadas

| Biblioteca                                | Versão         | Uso                 |
| ----------------------------------------- | -------------- | ------------------- |
| expo                                      | ~54.0.31       | Framework base      |
| heroui-native                             | ^1.0.0-beta.11 | Componentes UI      |
| react-navigation                          | latest         | Navegação           |
| react-native-qrcode-svg                   | ^6.3.21        | Geração de QR Code  |
| expo-clipboard                            | ~8.0.8         | Copiar código       |
| expo-sharing                              | ~14.0.8        | Compartilhar        |
| lucide-react-native                       | ^0.562.0       | Ícones              |
| @react-native-async-storage/async-storage | latest         | Armazenamento local |

## 📱 Compatibilidade

- ✅ iOS 13+
- ✅ Android 6.0+
- ✅ Testado em simuladores e dispositivos reais

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👨‍💻 Desenvolvido com

- ❤️ Passion
- ☕ Café
- 🎵 Boa música
- 🚀 Expo & React Native

---

**Pix Direto** - Receba pagamentos Pix de forma simples e profissional! 💰
