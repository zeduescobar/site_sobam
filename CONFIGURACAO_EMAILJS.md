# Configuração do EmailJS para o Site SOBAM

## Passo a Passo para Configurar o EmailJS

### 1. Criar Conta no EmailJS
- Acesse: https://www.emailjs.com/
- Clique em "Sign Up" e crie uma conta gratuita
- Faça login na sua conta

### 2. Configurar Email Service
- No dashboard, clique em "Email Services"
- Clique em "Add New Service"
- Escolha "Gmail" (ou outro provedor de email)
- Conecte sua conta de email (exemplo: seu-email@gmail.com)
- Anote o **Service ID** que será gerado

### 3. Criar Template de Email
- No dashboard, clique em "Email Templates"
- Clique em "Create New Template"
- Use este template como base:

```html
<h2>Nova Solicitação de Orçamento - SOBAM</h2>

<p><strong>Nome:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Telefone:</strong> {{from_phone}}</p>
<p><strong>Modalidade:</strong> {{modalidade}}</p>

<hr>
<p><em>Este email foi enviado através do formulário do site SOBAM.</em></p>
```

- Salve o template e anote o **Template ID**

### 4. Obter User ID
- No dashboard, clique em "Account" → "API Keys"
- Copie o **Public Key** (User ID)

### 5. Atualizar o Código
No arquivo `script.js`, substitua as seguintes linhas:

```javascript
// Linha 15: Substitua pelo seu User ID
emailjs.init("SEU_USER_ID_AQUI");

// Linha 108: Substitua pelo seu Service ID
'SEU_SERVICE_ID_AQUI',

// Linha 109: Substitua pelo seu Template ID
'SEU_TEMPLATE_ID_AQUI',
```

### 6. Testar o Formulário
- Abra o site no navegador
- Preencha o formulário de contato
- Verifique se o email chega na sua caixa de entrada

## Configurações Recomendadas

### Para Gmail:
- **Service**: Gmail
- **Email**: seu-email@gmail.com
- **Senha**: Use uma senha de aplicativo (não sua senha normal)

### Para Outlook/Hotmail:
- **Service**: Outlook
- **Email**: seu-email@outlook.com
- **Senha**: Sua senha normal

### Para Email Corporativo:
- **Service**: Custom SMTP
- **Host**: smtp.suaempresa.com
- **Port**: 587 ou 465
- **Email**: seu-email@suaempresa.com

## Solução de Problemas

### Email não chega:
1. Verifique se o Service ID está correto
2. Verifique se o Template ID está correto
3. Verifique se o User ID está correto
4. Verifique a pasta de spam
5. Teste com um email diferente

### Erro no console:
1. Abra o DevTools (F12)
2. Vá para a aba Console
3. Verifique se há mensagens de erro
4. Certifique-se de que o EmailJS foi carregado

### Formulário não envia:
1. Verifique se todos os campos obrigatórios estão preenchidos
2. Verifique se o JavaScript está funcionando
3. Teste em diferentes navegadores

## Limites da Conta Gratuita
- **200 emails por mês** (suficiente para a maioria dos sites)
- **2 templates de email**
- **1 serviço de email**

## Backup com WhatsApp
O sistema está configurado para:
1. Tentar enviar o email primeiro
2. Se der sucesso, abrir o WhatsApp após 2 segundos
3. Se der erro, abrir o WhatsApp imediatamente

Isso garante que você sempre receba as solicitações, mesmo se houver problemas com o EmailJS.

## Suporte
Se precisar de ajuda:
- EmailJS: https://www.emailjs.com/support/
- Documentação: https://www.emailjs.com/docs/
- Comunidade: https://community.emailjs.com/
