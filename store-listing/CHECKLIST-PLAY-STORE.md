# ✅ Checklist para Publicação na Google Play Store

## 📱 1. PREPARAÇÃO DO APP

### Configurações Técnicas

- [x] `app.json` configurado com todas as informações
- [x] `versionCode: 1` definido para primeira versão
- [x] `package: com.talisdev.pixdireto` configurado
- [x] Permissões necessárias declaradas
- [ ] Build APK/AAB gerado com sucesso (executar `eas build --platform android`)
- [ ] App testado em dispositivo real
- [ ] Verificar funcionamento offline
- [ ] Testar geração de QR Codes
- [ ] Testar exportação de PDF
- [ ] Testar múltiplas chaves

### Código

- [x] Sem erros críticos de TypeScript
- [x] Funcionalidades principais implementadas
- [x] Interface responsiva
- [x] SafeAreaView configurado
- [x] Navegação funcionando

## 🎨 2. ASSETS GRÁFICOS NECESSÁRIOS

### Ícone do App

- [x] Icon.png (1024x1024 px) - já existe em `/assets/icon.png`
- [x] Adaptive Icon (foreground) - já existe em `/assets/adaptive-icon.png`
- [ ] Feature Graphic (1024x500 px) - **CRIAR**

### Screenshots (OBRIGATÓRIO - mínimo 2, máximo 8)

- [ ] Screenshot 1: Tela inicial com keypad (**TIRAR**)
- [ ] Screenshot 2: QR Code gerado (**TIRAR**)
- [ ] Screenshot 3: Lista de chaves Pix (**TIRAR**)
- [ ] Screenshot 4: Tela de produtos (**TIRAR**)
- [ ] Screenshot 5: PDF gerado (opcional)

**Requisitos de Screenshots:**

- Formato: JPEG ou PNG de 24 bits
- Dimensões: Entre 320px e 3840px
- Proporção: Entre 16:9 e 9:16
- Recomendado: 1080x1920 px (portrait)

### Vídeo Promocional (Opcional mas recomendado)

- [ ] Vídeo de 30-120 segundos mostrando o app
- [ ] Upload no YouTube como não listado
- [ ] Adicionar link no Google Play Console

## 📝 3. TEXTOS DA LOJA (SEO/ASO)

### Título do App (máx 50 caracteres)

```
PixDireto - QR Code Pix Rápido
```

**Caracteres: 34/50** ✅

### Descrição Curta (máx 80 caracteres)

```
Gere QR Codes Pix instantaneamente! Aceite pagamentos rápido e fácil.
```

**Caracteres: 74/80** ✅

### Descrição Completa (máx 4000 caracteres)

- [x] Arquivo criado em `/store-listing/description-pt-BR.md`
- [ ] Copiar para Google Play Console
- [ ] Incluir emojis para melhor visualização
- [ ] Destacar benefícios principais
- [ ] Incluir chamada para ação

### Keywords/Tags para ASO

```
Primárias: pix, qr code pix, gerador pix, pagamento pix
Secundárias: cobrança pix, receber pix, aceitar pix, chave pix
Long-tail: qr code pix offline, gerador qr code pix gratis, app pix vendedor
Nicho: vendedor ambulante, food truck, freelancer pix, feira
```

## 🔐 4. INFORMAÇÕES LEGAIS

### Política de Privacidade

- [x] Arquivo criado em `/store-listing/privacy-policy.md`
- [ ] Hospedar online (GitHub Pages, Google Sites ou seu site)
- [ ] Adicionar URL no Google Play Console
- [ ] **OBRIGATÓRIO pela LGPD e Google Play**

### Termos de Serviço (Opcional mas recomendado)

- [ ] Criar documento de termos
- [ ] Hospedar online
- [ ] Adicionar link no app/loja

### Informações de Contato

- [ ] Email de suporte válido
- [ ] Website ou página de suporte (opcional)
- [ ] Link para política de privacidade

## 🏪 5. CADASTRO NO GOOGLE PLAY CONSOLE

### Conta de Desenvolvedor

- [ ] Criar conta Google Play Console (taxa única de $25 USD)
- [ ] Verificar identidade
- [ ] Configurar informações de pagamento (se for cobrar)

### Informações do App

- [ ] Nome do app
- [ ] Descrição curta e completa
- [ ] Categoria: **Ferramentas** ou **Negócios**
- [ ] Tags de conteúdo
- [ ] Email de contato
- [ ] Site (opcional)
- [ ] Telefone (opcional)

### Classificação de Conteúdo

- [ ] Preencher questionário de classificação
- [ ] Esperado: Livre (todos os públicos)

### Público-Alvo

- [ ] Definir faixa etária: 18+ (aplicativo de negócios)
- [ ] Confirmar que não é direcionado a crianças

### Dados de Segurança

- [ ] Declarar que não coleta dados
- [ ] Informar que funciona offline
- [ ] Listar permissões utilizadas

## 📦 6. BUILD E UPLOAD

### Gerar Build de Produção

```bash
# 1. Instalar EAS CLI (se ainda não tiver)
npm install -g eas-cli

# 2. Login no Expo
eas login

# 3. Configurar build
eas build:configure

# 4. Gerar AAB (Android App Bundle - formato requerido)
eas build --platform android --profile production

# 5. Baixar o AAB gerado
```

### Upload na Play Store

- [ ] Fazer upload do AAB no Google Play Console
- [ ] Criar release de produção
- [ ] Adicionar notas de versão (changelog)
- [ ] Selecionar países de distribuição (Brasil + outros)
- [ ] Definir preço (Grátis)

## 🎯 7. OTIMIZAÇÃO ASO (App Store Optimization)

### Título Otimizado

- [x] Incluir keyword principal "Pix"
- [x] Incluir "QR Code"
- [x] Manter nome da marca "PixDireto"
- [x] Abaixo de 50 caracteres

### Descrição Otimizada

- [x] Primeiros 250 caracteres com keywords principais
- [x] Benefícios claros e específicos
- [x] Casos de uso mencionados
- [x] Chamada para ação no final
- [x] Emojis para destaque visual

### Categoria Correta

**Recomendado**:

- Principal: **Ferramentas** (Tools)
- Secundária: **Negócios** (Business)

### Tags/Keywords

- [ ] Usar todas as 5 tags permitidas
- [ ] Combinar keywords de alto volume com baixa concorrência

## 📊 8. ESTRATÉGIA DE LANÇAMENTO

### Pré-Lançamento

- [ ] Teste beta fechado (opcional, com amigos/família)
- [ ] Teste beta aberto (opcional, para coletar feedback)
- [ ] Corrigir bugs reportados

### Lançamento

- [ ] Publicar em modo produção
- [ ] Monitorar reviews nas primeiras 24h
- [ ] Responder comentários rapidamente

### Pós-Lançamento

- [ ] Compartilhar nas redes sociais
- [ ] Pedir para amigos avaliarem (5 estrelas)
- [ ] Criar página no Facebook/Instagram
- [ ] Fazer vídeo demonstrativo para YouTube
- [ ] Divulgar em grupos de empreendedores

## 🎨 9. MARKETING E PROMOÇÃO

### Materiais Promocionais

- [ ] Banner para redes sociais
- [ ] Post de lançamento
- [ ] Vídeo de demonstração
- [ ] GIFs mostrando funcionalidades

### Canais de Divulgação

- [ ] WhatsApp Status
- [ ] Instagram Stories/Feed
- [ ] Facebook
- [ ] LinkedIn (público B2B)
- [ ] Grupos de vendedores ambulantes
- [ ] Fóruns de empreendedorismo

### Estratégia de Reviews

- [ ] Pedir avaliações de usuários reais
- [ ] Responder TODOS os reviews
- [ ] Implementar sugestões válidas
- [ ] Manter rating acima de 4.0

## 🔄 10. ATUALIZAÇÕES FUTURAS

### Versão 1.1 (Sugestões)

- [ ] Adicionar histórico de pagamentos (opcional)
- [ ] Temas claro/escuro
- [ ] Mais opções de customização do PDF
- [ ] Estatísticas de vendas
- [ ] Backup na nuvem (opcional)

### Manutenção

- [ ] Atualizar dependências regularmente
- [ ] Monitorar crashes no Google Play Console
- [ ] Responder dúvidas de usuários
- [ ] Melhorar baseado em feedback

## 📋 11. INFORMAÇÕES ADICIONAIS PLAY STORE

### Faixa de Preço

✅ **Grátis** (Recomendado para crescimento rápido)

### Compras no App

❌ **Não** (app é totalmente gratuito)

### Anúncios

❌ **Não** (app não tem anúncios)

### Público-Alvo

👥 **Adultos 18+** (aplicativo de negócios)

### Classificação de Conteúdo

🔓 **Livre** (sem violência, drogas, linguagem imprópria, etc)

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **CRIAR Feature Graphic** (1024x500px)
2. **TIRAR Screenshots** do app (mínimo 4)
3. **HOSPEDAR Política de Privacidade** online
4. **GERAR Build AAB** com `eas build --platform android`
5. **CRIAR conta** no Google Play Console
6. **FAZER upload** do AAB
7. **PREENCHER** todas as informações da loja
8. **PUBLICAR**! 🎉

---

## ⚠️ ATENÇÃO

- **Taxa única Google Play**: $25 USD para criar conta de desenvolvedor
- **Revisão inicial**: Pode levar de 1-3 dias para aprovação
- **Política de Privacidade**: É OBRIGATÓRIA, mesmo para apps que não coletam dados
- **Screenshots**: Mínimo de 2 capturas de tela obrigatórias

**BOA SORTE COM O LANÇAMENTO! 🚀**
