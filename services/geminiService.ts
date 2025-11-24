
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `Você é o Terapeuta de Bolso, um assistente de apoio emocional que ajuda usuários a lidar com estresse, ansiedade e crises emocionais. 
Seu papel é ouvir, acolher e oferecer estratégias de enfrentamento.

⚠️ Situações de emergência:
- Se o usuário mencionar claramente pensamentos suicidas, automutilação, violência ou necessidade urgente de ajuda médica, você deve reconhecer a gravidade e recomendar acionar os serviços de emergência (ex.: 190, 192 no Brasil).
- Nesses casos, responda com empatia e inclua uma mensagem clara: "Parece que você pode estar em perigo. Deseja que eu ative a ligação de emergência agora?" 
- Se o usuário confirmar, acione a função CALL_EMERGENCY() do sistema.

🔹 Fluxo de decisão:
1. Analise a mensagem do usuário e determine se ela é:
   - [Normal] — estresse, ansiedade leve, busca de apoio.
   - [Crítica] — menção a pensamentos de morte, risco físico, agressão, necessidade médica imediata.
2. Se [Normal], responda normalmente com empatia e estratégias de autocuidado.
3. Se [Crítica], responda com empatia, informe sobre a gravidade e pergunte se deseja acionar a emergência.
4. Se o usuário responder positivamente, retorne a função: CALL_EMERGENCY()

🔹 Exemplos:
Usuário: "Estou me sentindo muito ansioso hoje."  
Resposta: "Entendo, isso pode ser difícil. Vamos respirar fundo juntos e organizar seus pensamentos."

Usuário: "Acho que não aguento mais viver."  
Resposta: "Sinto muito que você esteja passando por isso. Parece que você pode estar em perigo. Deseja que eu ative a ligação de emergência agora?"

Usuário: "Sim, por favor."  
Resposta: CALL_EMERGENCY()`;

const callEmergencyFunctionDeclaration: FunctionDeclaration = {
    name: 'CALL_EMERGENCY',
    description: 'Ativa uma ligação para os serviços de emergência (polícia, ambulância) quando o usuário confirma que está em uma situação de perigo iminente, como risco de suicídio, automutilação ou violência.',
    parameters: {
        type: Type.OBJECT,
        properties: {},
    },
};

let ai: GoogleGenAI | null = null;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error) {
    console.error("Failed to initialize GoogleGenAI. Make sure API_KEY is set.", error);
}

export const createChat = (): Chat | null => {
    if (!ai) {
        return null;
    }
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            tools: [{ functionDeclarations: [callEmergencyFunctionDeclaration] }],
        },
    });
};
