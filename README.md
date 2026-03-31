# 🎨 Sytudio - E-Commerce Full-Stack

<div align="center">

<img width="1890" height="1077" alt="Captura de tela 2026-03-26 152844" src="https://github.com/user-attachments/assets/adf2ad02-b5b8-4f89-b206-6e11f7bee672" />

**Uma plataforma de e-commerce moderna, segura e escalável construída com React, Node.js e MongoDB**

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%3E%3D18.0.0-61dafb.svg)](https://react.dev/)

</div>

---

## 📋 Sobre

**Sytudio** é uma solução completa de e-commerce desenvolvida para pequenas e médias empresas que desejam uma plataforma robusta, segura e fácil de manter. O sistema oferece uma experiência moderna tanto para administradores quanto para clientes.

### 🎯 Ideal Para
- Boutiques e lojas online
- Criadores de conteúdo
- Microempresas B2C
- Qualquer negócio que precise vender online

---

## ✨ Funcionalidades

### 👨‍💼 Painel Administrativo
- ✅ **Gestão de Produtos** - Criar, editar, deletar e gerenciar inventário
- ✅ **Upload de Imagens** - Integração com Cloudinary para armazenamento otimizado
- ✅ **Carrossel de Produtos** - Múltiplas imagens por produto
- ✅ **Gestão de Entregas** - Acompanhamento de pedidos e status
- ✅ **Dashboard Intuitivo** - Interface limpa e responsiva
- ✅ **Autenticação JWT** - Login seguro com tokens

### 🛍️ Frontend Cliente
- ✅ **Catálogo Responsivo** - Visualização perfeita em qualquer dispositivo
- ✅ **Atualização em Real-Time** - Socket.io para sincronização instantânea
- ✅ **Filtros Avançados** - Busca e categorização de produtos
- ✅ **Seções Dinâmicas** - About, Portfolio, contato
- ✅ **Design Moderno** - Interface agradável e intuitiva

### 🔐 Segurança
- ✅ **Criptografia de Senhas** - bcrypt com salt
- ✅ **Rate Limiting** - Proteção contra brute force
- ✅ **Validação de Entrada** - Sanitização de dados
- ✅ **CORS Configurado** - Acesso controlado
- ✅ **Helmet.js** - Headers de segurança HTTP
- ✅ **JWT com Expiração** - Tokens com 7 dias de validade

### 💳 Integrações
- ✅ **Cloudinary** - Armazenamento de imagens
- ✅ **NodeMailer** - Sistema de email
- ✅ **Socket.io** - Comunicação em tempo real

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ODM
- **Autenticação:** JWT (JSON Web Tokens)
- **Upload:** Multer + Cloudinary
- **Segurança:** bcrypt, Helmet, express-rate-limit, express-validator
- **Comunicação Real-time:** Socket.io

### Frontend
- **UI Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** CSS3 + CSS Modules
- **Estado:** Context API
- **Comunicação:** Fetch API + Socket.io
- **Responsividade:** Mobile-first design

### Deployment
- **Hospedagem:** Render.com
- **Banco de Dados:** MongoDB Atlas
- **CDN/Storage:** Cloudinary

---

## 📁 Estrutura do Projeto

```
Sytudio/
├── backend/                 # API Node.js + Express
│   ├── config/             # Configurações (DB, Cloudinary)
│   ├── controllers/        # Lógica de negócio
│   ├── models/             # Schemas Mongoose
│   ├── routes/             # Endpoints da API
│   ├── middleware/         # Auth, validação, rate limit
│   └── server.js           # Entrada da aplicação
│
├── admin/                  # Painel administrativo (React + Vite)
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas (Login, Dashboard, etc)
│   │   ├── context/        # AdminContext + PrivateRoute
│   │   └── App.jsx
│   └── vite.config.js
│
├── frontend/               # Loja pública (React + Vite)
│   ├── src/
│   │   ├── components/     # Navbar, Products, Footer, etc
│   │   ├── pages/          # Home, About
│   │   ├── context/        # FrontContext + Socket.io
│   │   ├── hooks/          # Custom hooks (scroll reveal)
│   │   └── assets/         # Imagens, vídeos
│   └── vite.config.js
│
└── README.md               # Este arquivo
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 16+ e npm/yarn
- MongoDB (local ou Atlas)
- Conta Cloudinary (gratuita)
- Conta Stripe (testes)

### 1️⃣ Instalação Local

**Clone o repositório:**
```bash
git clone https://github.com/KenzoSant/Sytudio.git
cd Sytudio
```

**Setup Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edite .env com suas credenciais
npm run server
```

**Setup Admin:**
```bash
cd ../admin
npm install
npm run dev
# Acesse: http://localhost:5173
```

**Setup Frontend:**
```bash
cd ../frontend
npm install
npm run dev
# Acesse: http://localhost:5174
```

### 2️⃣ Variáveis de Ambiente

**backend/.env:**
```env
MONGO_URI=mongodb+srv://seu-user:senha@cluster.mongodb.net/sytudio
PORT=4000
NODE_ENV=development
JWT_SECRET=sua_chave_super_secreta_aqui
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
STRIPE_SECRET_KEY=sua_stripe_key
EMAIL=seu_email@gmail.com
EMAIL_PASS=seu_app_password
```

**admin/.env.local:**
```env
VITE_API_URL=http://localhost:4000
```

**frontend/.env.local:**
```env
VITE_API_URL=http://localhost:4000
```

---

## 🔒 Segurança

Este projeto implementa as melhores práticas de segurança:

| Medida | Descrição |
|--------|-----------|
| **JWT** | Autenticação baseada em tokens com expiração |
| **bcrypt** | Hashing de senhas com salt |
| **Rate Limiting** | Proteção contra força bruta e DDoS |
| **CORS** | Whitelist de origens permitidas |
| **Input Validation** | Sanitização e validação de dados |
| **Helmet.js** | Headers de segurança HTTP |
| **HTTPS** | Em produção, certificados SSL/TLS |

---

## 📊 Performance

- 🎯 **Frontend:** Otimizado com Vite
- ⚡ **API:** Response time médio < 200ms
- 📱 **Mobile:** 100% responsivo
- 🚀 **Deploy:** CDN com Cloudinary

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Distribuído sob a licença ISC. Veja [LICENSE](LICENSE) para mais detalhes.

---

## � Suporte

Tem dúvidas ou encontrou um bug?

- 🐛 Issues: [GitHub Issues](https://github.com/KenzoSant/Sytudio/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/KenzoSant/Sytudio/discussions)

---

## 🎯 Roadmap

- [ ] Integração com múltiplos gateways de pagamento
- [ ] Sistema de avaliações de clientes
- [ ] Dashboard com gráficos de vendas
- [ ] Modo escuro
- [ ] Suporte a múltiplos idiomas
- [ ] App mobile nativa

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

[⬆ Voltar ao topo](#-sytudio---e-commerce-full-stack)

</div>

