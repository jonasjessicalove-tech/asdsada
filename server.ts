import express from 'express';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { put } from '@vercel/blob';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Setup multer in-memory storage for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB limit
  },
});

// Initialize Gemini client with aistudio-build header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Vercel Blob Upload Endpoint (Single File)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const cleanOriginalName = (req.file.originalname || 'upload.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `imoveis-savio/${Date.now()}-${cleanOriginalName}`;

    if (token) {
      const blob = await put(filename, req.file.buffer, {
        access: 'public',
        contentType: req.file.mimetype || 'image/jpeg',
        token,
      });

      return res.json({
        success: true,
        url: blob.url,
        pathname: blob.pathname,
        provider: 'vercel-blob',
      });
    }

    // In local dev without BLOB_READ_WRITE_TOKEN, return data URL so upload never fails
    const base64 = `data:${req.file.mimetype || 'image/jpeg'};base64,${req.file.buffer.toString('base64')}`;
    return res.json({
      success: true,
      url: base64,
      provider: 'local-fallback',
      message: 'Arquivo processado localmente. Configure BLOB_READ_WRITE_TOKEN para CDN em nuvem.',
    });
  } catch (error: any) {
    console.error('Vercel Blob upload failure:', error);
    return res.status(500).json({
      error: error?.message || 'Falha no upload do arquivo para o Vercel Blob',
    });
  }
});

// 2. Vercel Blob Multiple Upload Endpoint
app.post('/api/upload/multiple', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const uploadedUrls: string[] = [];

    for (const f of files) {
      const cleanOriginalName = (f.originalname || 'upload.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `imoveis-savio/${Date.now()}-${cleanOriginalName}`;

      if (token) {
        const blob = await put(filename, f.buffer, {
          access: 'public',
          contentType: f.mimetype || 'image/jpeg',
          token,
        });
        uploadedUrls.push(blob.url);
      } else {
        const base64 = `data:${f.mimetype || 'image/jpeg'};base64,${f.buffer.toString('base64')}`;
        uploadedUrls.push(base64);
      }
    }

    return res.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error('Multiple upload failure:', error);
    return res.status(500).json({
      error: error?.message || 'Falha no upload múltiplo',
    });
  }
});

// 3. CORS Proxy for Watermarking external assets without canvas taint
app.get('/api/proxy-image', async (req, res) => {
  try {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      return res.status(400).send('URL de imagem ausente');
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(response.status).send('Erro ao buscar imagem externa');
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(Buffer.from(buffer));
  } catch (error: any) {
    return res.status(500).send(error?.message || 'Erro no proxy');
  }
});

// 4. Endpoint for Sofia - Virtual Assistant
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: 'Olá! Sou Sofia, assistente virtual do corretor Sávio (@imoveiscomsavio). Estou à sua disposição para apresentar nossas propriedades exclusivas, simular condições de financiamento ou agendar uma conversa direta com o Sávio no WhatsApp oficial ou Instagram!',
      });
    }

    const systemInstruction = `Você é Sofia, a assistente virtual e consultora imobiliária do corretor Sávio (@imoveiscomsavio).
Seu tom é refinado, caloroso, extremamente profissional e acolhedor.
O portal é especializado em residências e coberturas de alto padrão em regiões nobres e condomínios fechados.
Suas funções:
1. Ajudar os clientes a entender opções de imóveis, perfis de casas em condomínio, coberturas e lançamentos.
2. Esclarecer dúvidas sobre simulação de financiamento bancário (amortização SAC vs PRICE), compra, venda ou locação de luxo.
3. Estimular e direcionar com cortesia o cliente a agendar uma visita com o Sávio ou falar diretamente no WhatsApp oficial ou seguir o Instagram @imoveiscomsavio.
4. Mantenha respostas concisas (2 a 4 frases), elegantes e orientadas à ação.
Mantenha linguagem focada exclusivamente em assessoria imobiliária de alto padrão, seleção de imóveis nobres e atendimento exclusivo.`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.warn('Gemini Assistant fallback:', error?.message || error);
    return res.json({
      reply: 'Perfeito! Para agilizar seu atendimento com o corretor Sávio (@imoveiscomsavio), convido você a nos chamar diretamente no WhatsApp oficial ou acompanhar as novidades e tours no nosso Instagram!',
    });
  }
});

// 5. Intelligent Client-Centric Real Estate Matching Endpoint
app.post('/api/smart-match', async (req, res) => {
  try {
    const { query, profile, properties } = req.body;

    if (!Array.isArray(properties) || properties.length === 0) {
      return res.status(400).json({ error: 'Lista de imóveis ausente' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        personalizedSummary: 'Filtramos os imóveis mais compatíveis com o seu perfil de moradia.',
        scoredPropertyIds: [],
      });
    }

    const condensedCatalog = properties.map((p: any) => ({
      id: p.id,
      title: p.title,
      type: p.propertyType,
      neighborhood: p.neighborhood,
      bedrooms: p.bedrooms,
      price: p.price,
      negotiationType: p.negotiationType,
      features: p.features?.slice(0, 5),
    }));

    const prompt = `Você é um consultor imobiliário especializado em matching humano e inteligente de imóveis.
O cliente procura um imóvel com base nas seguintes características:
- Busca em Linguagem Natural: "${query || 'Não informada'}"
- Número de pessoas: "${profile?.peopleCount || 'Não informado'}"
- Momento de vida: "${profile?.lifeStage || (profile?.isStudent ? 'estudante' : 'Não informado')}"
- Próximo a faculdade/universidade: ${profile?.nearUniversity || profile?.isStudent ? 'Sim' : 'Não'}
- Preferência de moradia: "${profile?.housingPreference || 'Não informado'}"
- Estilo de vida: "${profile?.lifestyle || 'Não informado'}"
- Prioridade de localização: "${profile?.locationPriority || 'Não informado'}"

Catálogo de Imóveis:
${JSON.stringify(condensedCatalog, null, 2)}

Sua tarefa:
1. Gere um resumo empático e personalizado em 1 frase elegante explicando o perfil detectado (ex: "Encontramos opções ideais para 2 pessoas próximas a faculdades e com excelente mobilidade urbana.").
2. Para cada imóvel, atribua uma nota de compatibilidade (score entre 60 e 99) e uma frase curta em português explicando por que ele faz sentido para esse perfil específico (campo customReason).
Retorne ESTRITAMENTE um objeto JSON válido no formato:
{
  "personalizedSummary": "string",
  "scoredPropertyIds": [
    {
      "id": "string",
      "score": number,
      "customReason": "string"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.warn('AI matching fallback error:', err?.message || err);
    return res.json({
      personalizedSummary: 'Encontramos imóveis selecionados com base no que você busca.',
      scoredPropertyIds: [],
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
