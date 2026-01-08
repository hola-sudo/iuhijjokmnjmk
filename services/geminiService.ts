
import { GoogleGenAI, Type } from "@google/genai";
import { LegalDesignSuite } from "../types";

export const processLegalText = async (text: string): Promise<LegalDesignSuite> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Actúa como un Senior Legal Designer. Tu misión es desglosar un contrato de +10 páginas en una suite de EXPLICACIONES VISUALES mecánicas.
    
    NO RESUMAS. DESCOMPÓN LAS MECÁNICAS.
    
    Para cada 'Visual Sheet', identifica los "Átomos de Decisión":
    1. 'logic-flow': Muestra la cadena lógica. Nodo tipo 'condition' (¿Se pagó?), 'action' (Ejecutar servicio), 'penalty' (Multa 10%).
    2. 'responsibility-matrix': Enfócate en la interacción Humano-Sistema. Quién es el 'Owner' y qué 'Trigger' activa su acción.
    3. 'risk-heatmap': Encuentra las trampas legales. Clasifica el 'impact' (high/medium/low).
    4. 'financial-mechanics': Desglosa fórmulas de cobro, retenciones y flujos.
    
    TEXTO LEGAL COMPLEJO:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          projectName: { type: Type.STRING },
          sheets: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                type: { type: Type.STRING },
                explanation: { type: Type.STRING },
                data: {
                  type: Type.OBJECT,
                  properties: {
                    nodes: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          label: { type: Type.STRING },
                          detail: { type: Type.STRING },
                          type: { type: Type.STRING },
                          role: { type: Type.STRING },
                          impact: { type: Type.STRING },
                          value: { type: Type.STRING },
                          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                      }
                    },
                    connections: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          from: { type: Type.STRING },
                          to: { type: Type.STRING },
                          label: { type: Type.STRING },
                          isPositive: { type: Type.BOOLEAN }
                        }
                      }
                    }
                  }
                }
              },
              required: ["id", "title", "type", "explanation", "data"]
            }
          }
        },
        required: ["projectName", "sheets"]
      },
      systemInstruction: "Tu output es una especificación técnica para un diagrama. Cada nodo debe tener un propósito claro (Disparador, Condición, Consecuencia). Usa un lenguaje legal preciso pero estructurado visualmente."
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as LegalDesignSuite;
  } catch (e) {
    console.error("Gemini Error:", e);
    throw new Error("Error en la arquitectura visual. Intenta con un fragmento más específico.");
  }
};
