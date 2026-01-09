# 🚀 Guia de Inicialização - Pix Direto

## Pré-requisitos

- Node.js 18+ instalado
- Expo CLI instalado globalmente: `npm install -g expo-cli`
- Para iOS: Xcode instalado (apenas macOS)
- Para Android: Android Studio instalado

## 📱 Como Executar o App

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Iniciar o Servidor de Desenvolvimento

```bash
npm start
```

ou

```bash
npx expo start
```

### 3️⃣ Executar no Dispositivo/Emulador

Após iniciar o servidor, você verá um QR Code no terminal. Escolha uma opção:

#### **Opção A: Dispositivo Físico** (Recomendado)

1. Instale o app **Expo Go** no seu celular:

   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Abra o app **Expo Go**
3. Escaneie o QR Code exibido no terminal
4. Aguarde o app carregar

#### **Opção B: Emulador iOS**

```bash
npm run ios
```

ou pressione `i` no terminal do Expo

#### **Opção C: Emulador Android**

```bash
npm run android
```

ou pressione `a` no terminal do Expo

#### **Opção D: Web** (para testes rápidos)

```bash
npm run web
```

ou pressione `w` no terminal do Expo

## 🔧 Scripts Disponíveis

| Comando           | Descrição                |
| ----------------- | ------------------------ |
| `npm start`       | Inicia o servidor Expo   |
| `npm run android` | Abre no emulador Android |
| `npm run ios`     | Abre no emulador iOS     |
| `npm run web`     | Abre no navegador        |

## 📝 Primeiro Uso

1. Ao abrir o app pela primeira vez, você será direcionado para a **Tela de Configuração**
2. Preencha os campos:
   - **Chave Pix**: Sua chave (CPF, Email, Telefone ou Chave Aleatória)
   - **Nome**: Seu nome ou nome da empresa
   - **Cidade**: Sua cidade
3. Toque em **Salvar Configurações**
4. Você será redirecionado para a **Tela Home**
5. Digite um valor usando o teclado numérico
6. Toque em **Gerar QR Code**
7. Mostre o QR Code ou compartilhe o código Pix!

## 🐛 Troubleshooting

### Erro: "Unable to resolve module"

```bash
# Limpar cache do Metro Bundler
npx expo start -c
```

### Erro: "Network response timed out"

```bash
# Verifique se o celular e o computador estão na mesma rede Wi-Fi
# Tente usar o modo Tunnel:
npx expo start --tunnel
```

### App não carrega no Expo Go

```bash
# Reinstalar dependências
rm -rf node_modules
npm install
npx expo start -c
```

### Erros de TypeScript

```bash
# Reinstalar tipos
npm install --save-dev @types/react @types/react-native typescript
```

## 📱 Testando QR Codes Pix

Para testar se os QR Codes estão funcionando:

1. Gere um QR Code no app
2. Abra o app do seu banco
3. Vá em **Pix** → **Pagar** → **Ler QR Code**
4. Escaneie o QR Code gerado
5. Verifique se os dados aparecem corretamente:
   - Valor
   - Nome do beneficiário
   - Cidade

## 🔒 Segurança

- ⚠️ **IMPORTANTE**: Use apenas suas próprias chaves Pix reais
- ⚠️ Nunca compartilhe chaves Pix de terceiros
- ✅ Os dados são salvos apenas no seu dispositivo
- ✅ Nenhuma informação é enviada para servidores externos

## 💡 Dicas

- O QR Code gerado segue o padrão oficial do Banco Central
- Funciona em todos os bancos e apps de pagamento do Brasil
- Você pode gerar QR Codes sem valor (deixe R$ 0,00)
- Para alterar a configuração, toque no ícone ⚙️ na tela Home

## 🆘 Precisa de Ajuda?

- Verifique a documentação do Expo: [docs.expo.dev](https://docs.expo.dev)
- Veja a documentação do HeroUI Native: [heroui.com](https://v3.heroui.com/docs/native/getting-started/quick-start)

---

**Pix Direto** - Desenvolvido com ❤️ usando Expo + HeroUI Native
