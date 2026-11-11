# WEB DESIGNER AI PRO — CATÁLOGO DE COMPONENTES E SKILLS
## Projeto: Portal Imobiliário Premium @imoveiscomsavio

Este documento detalha o catálogo de design system, bibliotecas de componentes de elite, microinterações, animações e efeitos visuais aplicados na construção da experiência digital de **Imóveis com Sávio**.

---

### 1. Bibliotecas Utilizadas & Fontes Oficiais

1. **Motion (anteriormente Framer Motion)**
   - Link oficial: [https://motion.dev/](https://motion.dev/)
   - Propósito: Orquestração de entrada, animações de layout, transições de páginas, interações de gestos e microinterações de feedback.
   - Versão: `12.x`

2. **Tailwind CSS v4**
   - Link oficial: [https://tailwindcss.com/](https://tailwindcss.com/)
   - Propósito: Tokens de design, composições de layout responsivas com CSS Grid, Flexbox e `@layer`.

3. **Lucide React**
   - Link oficial: [https://lucide.dev/](https://lucide.dev/)
   - Propósito: Ícones SVG consistentes, elegantes e semânticos para métricas imobiliárias, especificações técnicas e controles.

4. **Canvas Confetti**
   - Link oficial: [https://www.npmjs.com/package/canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
   - Propósito: Efeito comemorativo de alta conversão ao enviar formulários de agendamento e propostas.

---

### 2. Catálogo de Componentes por Categoria

#### 1. Hero & Banners
- **CinematicLuxuryHero**: Banner de abertura em tela cheia com tipografia editorial (Cinzel + Playfair Display), sobreposição de gradientes em camadas profundas, badges de exclusividade e seletor de busca rápida integrada.
- **HeroSearchModule**: Seletor de finalidade (Comprar, Alugar, Lançamentos), tipo de imóvel, cidade/bairro e faixa de preço com animação instantânea de contagem de resultados.

#### 2. Navegação
- **FloatingGlassNavbar**: Barra de navegação com efeito de vidro fosco (`backdrop-blur-md`), transição suave ao rolar, menu responsivo mobile e botão de ação rápida para WhatsApp.
- **BreadcrumbLuxury**: Navegação contextual nas páginas de detalhes de imóveis e empreendimentos.

#### 3. Botões & Ações
- **MagneticGoldButton**: Botão com gradiente dourado, glow radiante e microinteração ao hover/active.
- **WhatsAppFloatingCTA**: Botão flutuante permanente com pulso sutil e mensagem contextualizada com o imóvel visualizado.
- **CopyShareButton**: Botão com cópia de URL com feedback visual imediato de confirmação.

#### 4. Cards
- **PropertyLuxuryCard**: Card com proporção de imagem cinematográfica, badge de status (Exclusivo, Lançamento, Destaque), carrossel de fotos, especificações em grade e botões de ação rápida.
- **DevelopmentCard**: Card de lançamento imobiliário com barra de status de obra e tipologias disponíveis.
- **MetricStatCard**: Card analítico com contadores de performance para o painel administrativo.

#### 5. Galerias & Visualização
- **PhotoLightboxGallery**: Galeria com navegação em tela cheia, miniaturas dinâmicas e contagem de fotografias.
- **PropertyVirtualTourViewer**: Aba para exibição de vídeo/tour virtual guiado do imóvel.

#### 6. Animações & Transições
- **FadeSlideIn**: Entrada suave coordenada com delay progressivo por item em listagens.
- **ScaleOnHover**: Efeito de ampliação suave de imagens para criar profundidade e sensação tátil.
- **AccordionAnimated**: FAQ e características com abertura elástica via Motion.

#### 7. Fundos & Atmosfera
- **DarkLuxuryMeshGradient**: Fundo escuro com gradientes radiais em tons âmbar e azul noite profundo (`#080c14` a `#0f172a`).
- **GoldGlowAccents**: Efeitos luminosos suaves que guiam o olhar para áreas de conversão primárias.

#### 8. Tipografia & Hierarquia
- **EditorialHeading**: Títulos em `Cinzel` com peso equilibrado para transmitir solidez e luxo contemporâneo.
- **SerifQuote**: Frases institucionais e citações em `Playfair Display` itálico.
- **SansBody**: Corpo de texto legível e refinado em `Plus Jakarta Sans`.

#### 9. Formulários & Captação de Leads
- **HighConversionLeadModal**: Modal de agendamento de visita e solicitação de proposta com validação em tempo real.
- **MortgageSimulator**: Simulador interativo de financiamento bancário (cálculo de entrada, parcelas estimadas e prazos).
- **ClientInterestTabs**: Formulário da Home com abas "Quero Comprar", "Quero Vender", "Quero Avaliar" e "Quero Investir".

#### 10. Elementos Imobiliários
- **SpecPill**: Pílula de especificação técnica (m² de área, suítes, quartos, vagas de garagem) com ícones semânticos.
- **PriceBadge**: Preço formatado em moeda brasileira (BRL) com distinção entre Venda e Locação.
- **LocationPinDisplay**: Exibição elegante do bairro e cidade de atuação com link direto para mapa.

#### 11. Componentes Administrativos
- **AdminDashboardMetrics**: Painel com visualizações de páginas, imóveis publicados, leads capturados e taxa de conversão.
- **PropertyManagerTable**: Tabela completa com busca, filtros, toggle de destaque/publicação e ações de clonagem e exclusão.
- **LeadsKanbanCRM**: Gestão de leads com status progressivo (Novo, Em Atendimento, Visita Agendada, Proposta, Concluído).
- **SettingsEditor**: Formulário de parametrização completa de marca, redes sociais, CRECI e telefones.
- **ImageUploaderModule**: Componente com pré-visualização instantânea, suporte a Vercel Blob e URLs externas.

---

### 3. Recomendações de Uso e Expansões Futuras
- **3D Spatial Viewer**: Implementação futura com Three.js / React Three Fiber para plantas baixas 3D interativas.
- **Google Maps Interativo**: Inclusão de mapa dinâmico com API do Google Maps para visualização de pontos de interesse próximos (escolas, shoppings, praias).
