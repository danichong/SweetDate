import express from 'express';
import http from 'http';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// In-memory pair room store for real-time couple sync
interface PairSyncData {
  profile: any;
  dates: any[];
  capsules: any[];
  challenges: any[];
  updatedAt: string;
}

const syncRooms = new Map<string, PairSyncData>();

// Server-side Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Endpoint: AI Date Generator ("Inspírenme con IA")
app.post('/api/ai/inspire-dates', async (req, res) => {
  const { category, budget, currency = 'S/', partner1 = 'Amor 1', partner2 = 'Amor 2', notes = '', occasion = 'cita especial' } = req.body;

  try {
    const ai = getAiClient();
    if (ai) {
      const prompt = `Actúa como un consejero romántico experto en citas para parejas.
Genera 3 ideas creativas, íntimas y detalladas de citas para la pareja formada por ${partner1} y ${partner2}.
Parámetros:
- Categoría preferida: ${category || 'cualquiera'}
- Presupuesto aproximado por plan: ${budget ? `${currency} ${budget}` : 'económico/accesible'}
- Ocasión o vibra: ${occasion}
- Notas o preferencias: ${notes || 'sorpréndelos con algo tierno y original'}

Responde ÚNICAMENTE con un JSON válido con el siguiente formato:
[
  {
    "title": "Nombre creativo de la cita",
    "description": "Descripción paso a paso de la experiencia romántica (2-3 oraciones cálidas).",
    "category": "${category || 'comida'}",
    "estimatedBudget": ${budget || 35},
    "dressCode": "Vestimenta sugerida (ej. Casual elegante, Pijama cómoda, Ropa deportiva)",
    "location": "Lugar sugerido (ej. Terraza de casa, Parque botánico, Cafetería vintage)",
    "romanticTip": "Un detalle especial para enamorar aún más (ej. Llevar una nota sorpresa, Playlist secreta)"
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, ideas: parsed });
      }
    }
  } catch (error) {
    console.error('Gemini inspiration error, using intelligent fallback:', error);
  }

  // Fallback high-quality curated ideas if API is not configured or fails
  const fallbackIdeas = [
    {
      title: `Picnic de Atardecer y Preguntas del Corazón`,
      description: `Lleven una manta, snacks favoritos y una lista de preguntas para conocerse aún más mientras ven caer el sol juntos.`,
      category: category || 'aire_libre',
      estimatedBudget: budget ? Math.min(budget, 30) : 25,
      dressCode: 'Ropa cómoda y abrigada',
      location: 'Un parque tranquilo o mirador con vista al atardecer',
      romanticTip: `Prepara una playlist con las canciones que marcaron momentos de su historia.`
    },
    {
      title: `Noche de Mini Chef: Competencia de Tapas en Casa`,
      description: `Cada uno prepara una tapa o postre sorpresa para el otro usando los mismos 4 ingredientes misteriosos.`,
      category: category || 'casa',
      estimatedBudget: budget ? Math.min(budget, 35) : 30,
      dressCode: 'Delantales y ropa fresca',
      location: 'Nuestra cocina',
      romanticTip: `Brinden con su bebida favorita al terminar y califiquen cada plato con besos.`
    },
    {
      title: `Cata de Helados a Ciegas & Caminata Nocturna`,
      description: `Compren 3 sabores de helado exóticos y tápense los ojos para adivinar cuál es cuál antes de pasear bajo las luces de la ciudad.`,
      category: category || 'comida',
      estimatedBudget: budget ? Math.min(budget, 25) : 20,
      dressCode: 'Casual nocturno con zapatillas',
      location: 'Heladería artesanal favorita',
      romanticTip: `El que pierda le da un masaje de 15 minutos al ganador al llegar a casa.`
    }
  ];

  return res.json({ success: true, ideas: fallbackIdeas });
});

// 2. Endpoint: Pair Sync (GET & POST)
app.get('/api/sync/:code', (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  const room = syncRooms.get(code);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Código de pareja no encontrado en la nube aún.' });
  }
  return res.json({ success: true, data: room });
});

app.post('/api/sync/:code', (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  const { profile, dates, capsules, challenges } = req.body;

  const roomData: PairSyncData = {
    profile,
    dates: Array.isArray(dates) ? dates : [],
    capsules: Array.isArray(capsules) ? capsules : [],
    challenges: Array.isArray(challenges) ? challenges : [],
    updatedAt: new Date().toISOString(),
  };

  syncRooms.set(code, roomData);
  return res.json({ success: true, message: 'Datos sincronizados con éxito', updatedAt: roomData.updatedAt });
});

// 3. Endpoint: Weather Forecast lookup (Open-Meteo public API)
app.get('/api/weather', async (req, res) => {
  const location = (req.query.location as string || '').trim();
  if (!location) {
    return res.status(400).json({ error: 'Ubicación requerida' });
  }

  try {
    // Geocode location using Open-Meteo Geocoding
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=es&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.json({
        found: false,
        temp: 22,
        condition: 'Agradable',
        icon: '🌤️',
        advisory: 'Clima ideal para disfrutar juntos.'
      });
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Fetch forecast
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&timezone=auto`);
    const weatherData = await weatherRes.json();

    const temp = Math.round(weatherData.current?.temperature_2m ?? 21);
    const code = weatherData.current?.weather_code ?? 0;
    const precip = weatherData.current?.precipitation ?? 0;

    let condition = 'Despejado';
    let icon = '☀️';
    let advisory = 'Excelente momento para salir al aire libre.';

    if (code >= 1 && code <= 3) {
      condition = 'Parcialmente nublado';
      icon = '⛅';
      advisory = 'Temperatura fresca, un paseo vendrá de maravilla.';
    } else if (code >= 51 && code <= 67) {
      condition = 'Llovizna';
      icon = '🌧️';
      advisory = 'Probabilidad de lluvia: lleven un paraguas compartido.';
    } else if (code >= 71 && code <= 86) {
      condition = 'Lluvia / chubasco';
      icon = '☔';
      advisory = 'Lluvia ligera. ¡Momento perfecto para compartir un paraguas o tomar café caliente!';
    } else if (code >= 95) {
      condition = 'Tormenta';
      icon = '⛈️';
      advisory = 'Clima tormentoso: mejor un plan abrigados en casa.';
    } else if (temp < 16) {
      advisory = 'Hace frío: lleven chaqueta o abrigo cómodo.';
    }

    return res.json({
      found: true,
      name,
      country,
      temp,
      condition,
      icon,
      precip,
      advisory
    });
  } catch (err) {
    console.error('Weather error:', err);
    return res.json({
      found: false,
      temp: 22,
      condition: 'Templado',
      icon: '✨',
      advisory: 'Disfruten su momento especial.'
    });
  }
});

// Vite middleware or static serving
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(Number(port), '0.0.0.0', () => {
    console.log(`Sweet Date server running on http://0.0.0.0:${port}`);
  });
}

startServer();
