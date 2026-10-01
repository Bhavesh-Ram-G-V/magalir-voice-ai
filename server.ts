import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `
You are "Anganwadi Akka" (அங்கன்வாடி அக்கா), an empathetic, patient local government guide for women in Tamil Nadu. The user is a rural woman with zero prior digital knowledge speaking via voice.

YOUR ROLE:
Identify her intent from her spoken Tamil and guide her to ONE of the following essential schemes:
1. Pregnancy / Maternity Benefits (PMMVY / Dr. Muthulakshmi Reddy scheme): ₹5,000 to ₹18,000 assistance for pregnant mothers. Direct her to nearby Anganwadi center or village health nurse (VHN) with Aadhaar card and bank passbook.
2. Monthly Household Rights Allowance (Kalaignar Magalir Urimai Thogai): ₹1,000/month for female heads of families. Direct her to nearby e-Seva (இ-சேவை) center with family ration card and Aadhaar card.
3. Free Skill Training (RSETI / Tailoring / Handicrafts): Free vocational training for rural women. Direct her to the Village Poverty Reduction Committee (கிராம வறுமை ஒழிப்பு சங்கம்) or RSETI center.
4. Child Healthcare / Vaccines: Free immunization at Primary Health Centres (PHC) or Anganwadi centers. Direct her to nearby Anganwadi center or PHC on immunization day with vaccination card and Aadhaar.

DIALECT & SPOKEN INPUT FLEXIBILITY:
- UNDERSTAND ALL TAMIL DIALECTS: The user may speak in non-standard, rural, or regional dialects (e.g., Kongu Tamil, Coimbatore Tamil, Gramathu Tamil like 'கர்ப்பமா இருக்கேனுங்க.. காசு தருவாங்களா?', or informal Tanglish mix like "pregnancy kaaga govt la edhavadhu help iruka akka?").
- INTERPRET INTENT REGARDLESS OF DIALECT: Extract the user's underlying core intent even if the speech contains slang, regional idioms, or English loan words.
- OUTPUT STANDARDIZED SPOKEN TAMIL: While you must understand any regional dialect or Tanglish input, your spoken audio response must always remain warm, simple, everyday spoken Tamil (ta-IN) that is universally understood across Tamil Nadu. Never use complex literary Tamil (Chentamil).

CRITICAL RULES FOR TEXT-TO-SPEECH:
1. LANGUAGE: Respond strictly in plain, everyday spoken Tamil (ta-IN). Never use English words, complex tech terms, or literary Tamil (Chentamil).
2. BREVITY: Keep every response strictly between 1 and 2 short sentences.
3. FORMATTING: Output strictly PURE TEXT for speechText. Do NOT use bolding (**), italics, bullet points, numbers, or symbols.
4. ACTION ORIENTED: Direct her to a physical, reachable place (Anganwadi center, village nurse, or e-Seva center) with her Aadhaar card.
5. FALLBACK: If her request is unclear, respond warmly in simple Tamil asking her to speak again (e.g., "அம்மா, நீங்க சொன்னது சரியா கேட்கல, மறுபடியும் கொஞ்சம் சொல்லுங்கம்மா.").
`;

// Dialect and Semantic Intent Analyzer (for instant low-latency & resilience)
function resolveTamilDialectIntent(message: string) {
  const norm = message.toLowerCase().trim();

  // 1. Maternity Patterns (Standard, Kongu, Gramathu, Tanglish)
  const isMaternity =
    norm.includes('கர்ப்ப') ||
    norm.includes('கருவுற்') ||
    norm.includes('வயித்து') ||
    norm.includes('மசக்கை') ||
    norm.includes('மழலை') ||
    norm.includes('பிரசவ') ||
    norm.includes('pregnancy') ||
    norm.includes('pregnant') ||
    norm.includes('pmmvy') ||
    norm.includes('muthulakshmi') ||
    norm.includes('முத்துலட்சுமி') ||
    norm.includes('தாய்மை') ||
    (norm.includes('காசு') && norm.includes('மாச')) ||
    (norm.includes('காசு தருவாங்களா') && norm.includes('இருக்கேனுங்க'));

  if (isMaternity) {
    return {
      speechText: 'அம்மா, இந்த உதவித்தொகை பெற உங்க ஆதார் கார்டு மற்றும் வங்கி கணக்கு புத்தகத்தை எடுத்துட்டு பக்கத்துல இருக்கிற அங்கன்வாடி மையத்துக்கு போங்க.',
      detectedScheme: 'maternity',
      schemeTitleTa: 'பிரதான் மந்திரி மாத்ரு வந்தனா திட்டம் (PMMVY)',
      targetLocationTa: 'அருகிலுள்ள அங்கன்வாடி மையம் அல்லது கிராம சுகாதார செவிலியர் (VHN)',
      requiredDocsTa: ['ஆதார் கார்டு', 'வங்கி கணக்கு புத்தகம்', 'தாய்மை அட்டை (RCH ID)'],
      benefitSummaryTa: '₹5,000 முதல் ₹18,000 வரை மகப்பேறு நிதியுதவி',
    };
  }

  // 2. Magalir Urimai Thogai Patterns (₹1,000 allowance)
  const isMagalirUrimai =
    norm.includes('ஆயிரம்') ||
    norm.includes('1000') ||
    norm.includes('உரிமை') ||
    norm.includes('magalir') ||
    norm.includes('urimai') ||
    norm.includes('ரேஷன்') ||
    norm.includes('குடும்ப அட்டை') ||
    (norm.includes('காசு') && (norm.includes('பெண்கள்') || norm.includes('மகளிர்') || norm.includes('அரசு')));

  if (isMagalirUrimai) {
    return {
      speechText: 'மகளிர் உரிமைத் தொகை பெற உங்க குடும்ப அட்டை மற்றும் ஆதார் கார்டுடன் பக்கத்தில் உள்ள இ-சேவை மையத்திற்குச் செல்லுங்கள் அம்மா.',
      detectedScheme: 'magalir_urimai',
      schemeTitleTa: 'கலைஞர் மகளிர் உரிமைத் திட்டம்',
      targetLocationTa: 'அருகிலுள்ள இ-சேவை மையம் (e-Seva Center)',
      requiredDocsTa: ['குடும்ப அட்டை (Ration Card)', 'ஆதார் கார்டு', 'வங்கி கணக்கு புத்தகம்'],
      benefitSummaryTa: 'மாதம் ₹1,000 மாதாந்திர உரிமைத் தொகை',
    };
  }

  // 3. Free Skill Training / Tailoring Patterns
  const isSkill =
    norm.includes('தையல்') ||
    norm.includes('தொழில்') ||
    norm.includes('பயிற்சி') ||
    norm.includes('கத்துக்க') ||
    norm.includes('கற்று') ||
    norm.includes('tailor') ||
    norm.includes('tailoring') ||
    norm.includes('skill') ||
    norm.includes('course') ||
    norm.includes('வேலை வாய்ப்பு') ||
    norm.includes('சுயதொழில்') ||
    norm.includes('கைவினை');

  if (isSkill) {
    return {
      speechText: 'கண்டிப்பாக படிக்கலாம் அம்மா. உங்கள் ஊரில் உள்ள கிராம வறுமை ஒழிப்பு சங்கத்தில் உங்கள் பெயரை பதிவு செய்யுங்கள்.',
      detectedScheme: 'skill_training',
      schemeTitleTa: 'இலவச தொழிற்பயிற்சி & தையல் பயிற்சி (RSETI / VPRC)',
      targetLocationTa: 'கிராம வறுமை ஒழிப்பு சங்கம் (VPRC) / பஞ்சாயத்து அலுவலகம் / RSETI மையம்',
      requiredDocsTa: ['ஆதார் கார்டு', 'குடும்ப அட்டை நகல்', 'பாஸ்போர்ட் அளவு புகைப்படம்'],
      benefitSummaryTa: 'இலவச தையல் மற்றும் கைவினைப் பயிற்சி சான்றிதழ்',
    };
  }

  // 4. Child Healthcare / Vaccines Patterns
  const isVaccine =
    norm.includes('தடுப்பூசி') ||
    norm.includes('ஊசி') ||
    norm.includes('குழந்தை') ||
    norm.includes('குழந்தைக்கு') ||
    norm.includes('vaccine') ||
    norm.includes('injection') ||
    norm.includes('போலியோ') ||
    norm.includes('phc') ||
    norm.includes('ஆரம்ப சுகாதார') ||
    norm.includes('சத்துணவு');

  if (isVaccine) {
    return {
      speechText: 'அம்மா, குழந்தையோட தடுப்பூசி அட்டையை எடுத்துக்கொண்டு பக்கத்தில் உள்ள அங்கன்வாடி அல்லது ஆரம்ப சுகாதார நிலையத்திற்கு புதன்கிழமை போங்க.',
      detectedScheme: 'child_vaccine',
      schemeTitleTa: 'குழந்தைகள் தடுப்பூசி & ஊட்டச்சத்து திட்டம்',
      targetLocationTa: 'அருகிலுள்ள ஆரம்ப சுகாதார நிலையம் (PHC) அல்லது அங்கன்வாடி மையம்',
      requiredDocsTa: ['குழந்தை தடுப்பூசி அட்டை (MCP Card)', 'தாயின் ஆதார் கார்டு'],
      benefitSummaryTa: 'இலவச தடுப்பூசிகள் மற்றும் சத்துணவு பெட்டகம்',
    };
  }

  // Fallback for unclear speech
  return {
    speechText: 'அம்மா, நீங்க சொன்னது சரியா கேட்கல, மறுபடியும் கொஞ்சம் சொல்லுங்கம்மா.',
    detectedScheme: 'unclear',
    schemeTitleTa: 'அங்கன்வாடி அக்கா வழிகாட்டுதல்',
    targetLocationTa: 'அருகிலுள்ள அங்கன்வாடி மையம்',
    requiredDocsTa: ['ஆதார் கார்டு'],
    benefitSummaryTa: 'அரசு நலத்திட்டங்கள்',
  };
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Try Gemini model first if configured (with 2500ms low-latency timeout)
    if (ai) {
      try {
        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                speechText: {
                  type: Type.STRING,
                  description: 'Strictly 1 to 2 short sentences in warm, simple spoken Tamil (ta-IN). No bolding, no symbols, pure text.',
                },
                detectedScheme: {
                  type: Type.STRING,
                  description: 'One of: maternity, magalir_urimai, skill_training, child_vaccine, unclear',
                },
                schemeTitleTa: {
                  type: Type.STRING,
                  description: 'Simple scheme title in Tamil',
                },
                targetLocationTa: {
                  type: Type.STRING,
                  description: 'Physical place where the rural woman needs to go in Tamil',
                },
                requiredDocsTa: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of essential documents to bring in Tamil',
                },
                benefitSummaryTa: {
                  type: Type.STRING,
                  description: 'Brief summary of the benefit in Tamil',
                },
              },
              required: [
                'speechText',
                'detectedScheme',
                'schemeTitleTa',
                'targetLocationTa',
                'requiredDocsTa',
                'benefitSummaryTa',
              ],
            },
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout for voice latency')), 2500)
        );

        const response = await Promise.race([geminiPromise, timeoutPromise]);

        const parsed = JSON.parse(response.text?.trim() || '{}');
        if (parsed.speechText && parsed.detectedScheme) {
          // Clean speechText to ensure 100% pure text for TTS
          parsed.speechText = parsed.speechText
            .replace(/[*#_~`[\]()]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          return res.json(parsed);
        }
      } catch (geminiErr: unknown) {
        // Fallback transparently on upstream demand spikes (e.g. 503) or timeout
        console.warn('Gemini latency fallback triggered:', (geminiErr as Error)?.message);
      }
    }

    // High precision Dialect and Intent Resolution
    const resolved = resolveTamilDialectIntent(message);
    return res.json(resolved);
  } catch (err: unknown) {
    console.error('Fatal error in /api/chat:', err);
    return res.json(resolveTamilDialectIntent(req.body?.message || ''));
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
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

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Anganwadi Akka server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
