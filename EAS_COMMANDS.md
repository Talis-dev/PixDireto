# Comandos Úteis — Expo EAS

## Build

| Perfil | Comando | Saída | Uso |
|--------|---------|-------|-----|
| Produção | `eas build --platform android --profile production` | `.aab` | Play Store |
| Preview | `eas build --platform android --profile preview` | `.apk` | Teste em dispositivo |
| Development | `eas build --platform android --profile development` | `.apk` | Dev com DevClient |

## Publicar na Play Store

```bash
# Enviar build gerada para a Play Store
eas submit --platform android

# Build + submit em um só comando
eas build --platform android --profile production --auto-submit
```

## Atualização OTA (sem nova build)

```bash
# Publicar atualização JS/assets sem passar pela loja
eas update --branch production --message "descrição da atualização"
```

## Login / Conta

```bash
eas whoami          # Ver conta logada
eas login           # Fazer login
eas logout          # Sair
```

## Informações do Projeto

```bash
eas build:list                          # Ver histórico de builds
eas build:view <BUILD_ID>               # Ver detalhes de uma build
eas credentials                         # Gerenciar certificados/keystore
```

## Dicas Rápidas

- Sempre incrementar **`versionCode`** no `app.json` antes de uma nova build de produção
- O perfil **preview** (APK) é ideal para testes antes de enviar para a loja
- Após `eas build`, o link para download/acompanhamento aparece no terminal
- O arquivo `eas.json` contém todos os perfis configurados neste projeto
