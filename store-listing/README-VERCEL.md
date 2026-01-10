# 🚀 Como Hospedar a Política de Privacidade na Vercel

## Método 1: Deploy Direto pela CLI (Recomendado)

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Fazer Login
```bash
vercel login
```

### 3. Fazer Deploy
```bash
cd store-listing
vercel --prod
```

**Pronto!** Sua política estará disponível em: `https://seu-projeto.vercel.app`

---

## Método 2: Deploy pelo GitHub + Vercel Dashboard

### 1. Criar Repositório no GitHub
- Faça push dos arquivos `privacy-policy.html` e `vercel.json` para um repositório

### 2. Conectar na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Configure:
   - **Root Directory**: `store-listing`
   - **Framework Preset**: Other
   - **Build Command**: (deixe vazio)
   - **Output Directory**: (deixe vazio)

### 3. Deploy
- Clique em "Deploy"
- Aguarde alguns segundos
- Sua URL estará pronta!

---

## Método 3: Deploy Manual (Arrastar e Soltar)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Arraste a pasta `store-listing` para a área de upload
3. Aguarde o deploy
4. Pronto!

---

## 📋 URLs Configuradas

Após o deploy, sua política estará acessível em:

- `https://seu-projeto.vercel.app/`
- `https://seu-projeto.vercel.app/privacy`
- `https://seu-projeto.vercel.app/privacidade`
- `https://seu-projeto.vercel.app/privacy-policy`

Todas as URLs acima redirecionam para o mesmo arquivo HTML!

---

## 🎯 Próximos Passos

### 1. Personalizar Domínio (Opcional)
Na Vercel Dashboard:
- Settings → Domains
- Adicione um domínio personalizado (ex: `privacy.pixdireto.com`)

### 2. Atualizar o app.json
Adicione a URL da política no `app.json`:

```json
{
  "expo": {
    "privacy": "public",
    "privacyPolicyUrl": "https://seu-projeto.vercel.app/"
  }
}
```

### 3. Adicionar no Google Play Console
Ao publicar o app:
1. Vá em **Política de Privacidade**
2. Cole a URL: `https://seu-projeto.vercel.app/`

### 4. Atualizar Informações de Contato
No arquivo `privacy-policy.html`, substitua:
- `talisdev@exemplo.com` → seu email real
- `pixdireto.vercel.app` → sua URL real após deploy
- `[seu-site.com]` → seu site/portfólio (se tiver)

---

## ✅ Checklist Final

- [ ] Deploy feito na Vercel
- [ ] URL funcionando e acessível
- [ ] Email de contato atualizado no HTML
- [ ] Website atualizado no HTML
- [ ] URL adicionada no `app.json`
- [ ] URL testada em navegador mobile
- [ ] URL adicionada no Google Play Console

---

## 🔧 Troubleshooting

### Erro: "No HTML file found"
**Solução:** Certifique-se de que `privacy-policy.html` está na pasta raiz do deploy.

### Erro: "Build failed"
**Solução:** Use `vercel.json` fornecido. Ele configura o projeto como site estático.

### Página não carrega
**Solução:** Verifique se o arquivo `vercel.json` está junto com o `privacy-policy.html`.

### Erro 404
**Solução:** Aguarde 1-2 minutos após o deploy. CDN da Vercel pode demorar para propagar.

---

## 💡 Dicas Extras

### Favicon Personalizado
Adicione na pasta `store-listing`:
```html
<link rel="icon" type="image/png" href="./favicon.png">
```

### Analytics (Opcional)
Se quiser monitorar acessos, adicione:
- Google Analytics
- Vercel Analytics (gratuito)
- Plausible (privacidade focada)

### SSL Automático
✅ Vercel fornece HTTPS automático e gratuito!

### Atualizações
Sempre que atualizar o HTML:
1. Commit no Git (se usando GitHub)
2. Vercel faz redeploy automático
3. OU execute `vercel --prod` novamente

---

## 📞 Suporte

**Vercel Docs:** https://vercel.com/docs  
**Vercel Community:** https://github.com/vercel/vercel/discussions

---

## 🎉 Pronto!

Agora você tem uma **Política de Privacidade profissional** hospedada gratuitamente na Vercel! 🚀

Use a URL no Google Play Console e estará em conformidade com as regras da Play Store e da LGPD.
