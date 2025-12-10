import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, AnalysisResult, SizeRow, Language } from "../types";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeSize = async (input: UserInput, sizeChart: SizeRow[], language: Language): Promise<AnalysisResult> => {
  if (!input.image) throw new Error("Image is required");

  const ai = getGeminiClient();
  const imagePart = await fileToGenerativePart(input.image);

  // Prepare context from dynamic chart
  const chartContext = JSON.stringify(sizeChart);

  const langNames = {
    uk: 'Ukrainian',
    en: 'English',
    ru: 'Russian'
  };

  const selectedLangName = langNames[language];
  const weightText = input.weight ? `${input.weight} kg` : 'Unknown';

  const prompt = `
    You are an expert professional tailor and stylist. 
    Analyze the provided image of the person alongside their self-reported height (${input.height} cm) and weight (${weightText}).
    
    Your task is to:
    1. Estimate their Chest, Waist, and Hips measurements (in cm) based on their visual body type (ectomorph, mesomorph, endomorph) and known parameters.
    2. Compare these estimated measurements against the provided Size Chart below.
    3. Recommend the best fitting size from the chart.
    
    Size Chart Data (JSON):
    ${chartContext}
    
    Provide the output in strict JSON format.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      estimatedChest: { type: Type.NUMBER, description: "Estimated chest circumference in cm" },
      estimatedWaist: { type: Type.NUMBER, description: "Estimated waist circumference in cm" },
      estimatedHips: { type: Type.NUMBER, description: "Estimated hips circumference in cm" },
      recommendedSize: { type: Type.STRING, description: "The recommended size label from the chart (e.g. XS, 44, or combined)" },
      reasoning: { type: Type.STRING, description: `A brief explanation in ${selectedLangName} language of why this size was chosen.` },
      confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 100" }
    },
    required: ["estimatedChest", "estimatedWaist", "estimatedHips", "recommendedSize", "reasoning", "confidence"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            imagePart,
            { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, 
      }
    });

    if (!response.text) {
        throw new Error("No response from AI");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};