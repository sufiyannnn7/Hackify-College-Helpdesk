
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, Priority } from "../types";

export const analyzeComplaint = async (description: string): Promise<AIAnalysis> => {
  // Access pre-configured environment variable
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("API key not found, using default classification.");
    return {
      category: "General",
      priority: Priority.MEDIUM,
      suggestedDepartment: "Admin Office"
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this college complaint and classify it: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { 
              type: Type.STRING, 
              description: "E.g., Infrastructure, Academics, Finance, Faculty, Hygiene" 
            },
            priority: { 
              type: Type.STRING, 
              enum: ["Low", "Medium", "High", "Urgent"],
              description: "The priority level of the issue."
            },
            suggestedDepartment: { 
              type: Type.STRING, 
              description: "Which college department should handle this? E.g., Maintenance, Registrar, IT Department"
            }
          },
          required: ["category", "priority", "suggestedDepartment"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      category: result.category || "General",
      priority: (result.priority as Priority) || Priority.MEDIUM,
      suggestedDepartment: result.suggestedDepartment || "General Administration"
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      category: "Pending Review",
      priority: Priority.MEDIUM,
      suggestedDepartment: "Head Office"
    };
  }
};
