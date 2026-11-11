# Imóveis com Sávio (@imoveiscomsavio) — Portal Imobiliário Premium

Portal imobiliário institucional de alto padrão projetado para o corretor de imóveis responsável pelo perfil [@imoveiscomsavio](https://www.instagram.com/imoveiscomsavio/).

---

## 🌟 Principais Recursos

1. **Portal Público Cinematográfico**
   - Hero editorial de alto impacto com busca rápida interativa.
   - Catálogo completo de imóveis (Venda, Aluguel e Lançamentos).
   - Páginas individuais compartilháveis para cada imóvel com galeria, mapa, ficha técnica e simulador de financiamento.
   - Área exclusiva para Lançamentos & Empreendimentos.
   - Apresentação institucional de Sávio com transparência de dados profissionais.
   - Formulários multifuncionais de captação (Comprar, Vender, Avaliar, Investir).
   - Botão de WhatsApp flutuante inteligente com mensagem pré-formatada do imóvel em tela.

2. **Landing Pages Comerciais Individuais**
   - Criação de páginas exclusivas de alta conversão para qualquer imóvel ou campanha em 1 clique.
   - URLs dedicadas para anúncios em Instagram, Facebook Ads e Google Ads com rastreamento de origem e UTMs.

3. **Painel Administrativo Privado**
   - Acesso discreto no centro do rodapé do site ("Painel Admin").
   - Dashboard analítico em tempo real: visitantes, visualizações, leads capturados, cliques no WhatsApp e taxa de conversão.
   - Gestão completa de Imóveis (CRUD, galeria, publicação, destaque, duplicação).
   - Gestão de Empreendimentos.
   - Gestão de Landing Pages individuais.
   - CRM de Leads com status de atendimento, notas internas e exportação para CSV.
   - Configurações globais do site (Nome, CRECI, telefones, WhatsApp, Instagram, logo, bio e cores) refletidas imediatamente sem mexer em código.

4. **Banco de Dados e Autenticação Firebase**
   - Firebase Firestore provisionado com regras de segurança ativas.
   - Firebase Authentication via Google Login e suporte a e-mail/senha.
   - Auto-configuração inteligente e auto-seeding para inicialização imediata.

5. **Armazenamento de Imagens com Vercel Blob**
   - Suporte nativo a Vercel Blob para upload seguro de fotografias de imóveis e banners.
   - Fallback integrado para URLs de imagens de alta resolução e upload local para testes e pré-visualizações.

---

## 🔐 Acesso Administrativo Inicial

- **Link no site:** Rodapé central -> "Painel Admin"
- **E-mail inicial:** `admin@x.com` ou login com conta Google de administrador
- **Senha inicial:** `admin4321` (com recomendação e suporte à troca na interface)

---

## 🛠️ Instalação e Execução Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (porta 3000)
npm run dev

# Compilar para produção
npm run build
```

---

## ☁️ Publicação na Vercel

1. Suba o código para seu repositório no GitHub.
2. Na Vercel, crie um novo projeto importando o repositório.
3. Nas variáveis de ambiente do projeto na Vercel:
   - Adicione o token `BLOB_READ_WRITE_TOKEN` obtido na aba **Storage > Blob** da Vercel para uploads diretos.
4. Execute o deploy. O portal estará ativo e conectado ao Firebase Firestore!
