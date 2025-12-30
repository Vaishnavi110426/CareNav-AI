
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { MedicalGuidance, UrgencyLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIGuidance = async (symptoms: string, department: string, language: string): Promise<MedicalGuidance> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User symptoms: "${symptoms}". Classified Department: ${department}. Language: ${language}`,
      config: {
        systemInstruction: `You are a healthcare navigation assistant. Your goal is to help users prepare for a medical visit based on their symptoms.
        
        1. Assess urgency:
           - Green: Symptoms are mild and can be managed with rest or OTC medicine.
           - Yellow: Symptoms require professional evaluation but are not immediate life threats.
           - Red: Symptoms are serious (e.g., severe pain, difficulty breathing, sudden weakness).
           
        2. Generate a preparation checklist including:
           - Essential documents (ID, insurance, previous records).
           - Potential tests they might undergo.
           - Logistical advice (best time to visit, someone to accompany).
        
        3. Provide a brief, reassuring explanation.
        
        CRITICAL: DO NOT DIAGNOSE. DO NOT SUGGEST SPECIFIC MEDICATIONS. 
        Always respond in the user's requested language (${language}).`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgency: {
              type: Type.STRING,
              description: 'Urgency level: Green, Yellow, or Red',
            },
            checklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Steps to prepare for a medical visit',
            },
            explanation: {
              type: Type.STRING,
              description: 'A brief, reassuring context for the user',
            }
          },
          required: ["urgency", "checklist", "explanation"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    // Ensure urgency is one of the allowed types
    let urgency: UrgencyLevel = 'Green';
    if (['Green', 'Yellow', 'Red'].includes(data.urgency)) {
      urgency = data.urgency as UrgencyLevel;
    }

    // Fix: Added missing timestamp property to comply with MedicalGuidance interface
    return {
      urgency,
      department, // Use the rule-based department passed in
      checklist: data.checklist || ["Bring your government ID", "Carry existing medical reports"],
      explanation: data.explanation || "Please consult a healthcare professional for further advice.",
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("AI Guidance Error:", error);
    // Fix: Added missing timestamp property to comply with MedicalGuidance interface
    return {
      urgency: 'Yellow',
      department,
      checklist: ["Bring your ID card", "Note down when symptoms started"],
      explanation: "We're having trouble connecting to the AI, but a clinic visit is generally a safe next step for your symptoms.",
      timestamp: Date.now()
    };
  }
};

export const getNearbyClinics = async (lat: number, lng: number): Promise<{ clinics: any[], searchUrls: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Find 3 reputable nearby clinics or hospitals.",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const urls = groundingChunks?.map((chunk: any) => chunk.web?.uri).filter(Boolean) || [];

    return {
      clinics: [], // Typically you'd parse text for structured names if needed
      searchUrls: urls
    };
  } catch (error) {
    console.error("Nearby Clinics Error:", error);
    return { clinics: [], searchUrls: [] };
  }
};

export const playGuidanceSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this medical guidance clearly: ${text}` }] }],
      config: {
        // Fix: Use Modality.AUDIO from SDK and ensure it is an array
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (err) {
    console.error("Speech Synthesis Error:", err);
  }
};
