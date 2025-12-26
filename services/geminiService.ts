import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert blob/file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeSleepPattern = async (hours: number, quality: number, prevLogs: any[]): Promise<string> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      I slept ${hours} hours last night with a subjective quality of ${quality}/10.
      Based on this, give me a short, 2-sentence actionable piece of advice to improve my energy today or sleep better tonight.
      Adopt a supportive but disciplined coach persona.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Keep tracking your sleep to get better insights.";
  } catch (error) {
    console.error("Gemini Sleep Analysis Error:", error);
    return "Could not analyze sleep data at this time. Try again later.";
  }
};

interface AIWorkoutVerification {
  verified: boolean;
  exerciseType: string;
  estimatedRepsOrIntensity: string;
  screentimeMinutesAwarded: number;
  motivationalComment: string;
}

export const verifyWorkoutWithAI = async (imageBase64: string): Promise<AIWorkoutVerification> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64
            }
          },
          {
            text: `Analyze this image. It is a user attempting to prove they are working out to unlock screentime.
            1. Identify if a person is exercising or if it's workout equipment/gym setting.
            2. Estimate the exercise type (e.g. Pushups, Squats, Gym Selfie).
            3. Award "Screentime Minutes" between 5 and 30 based on intensity implied. If invalid, 0.
            4. Provide a short, hype-man style comment.
            
            Return JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verified: { type: Type.BOOLEAN },
            exerciseType: { type: Type.STRING },
            estimatedRepsOrIntensity: { type: Type.STRING },
            screentimeMinutesAwarded: { type: Type.NUMBER },
            motivationalComment: { type: Type.STRING }
          },
          required: ["verified", "exerciseType", "screentimeMinutesAwarded", "motivationalComment"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIWorkoutVerification;

  } catch (error) {
    console.error("Gemini Workout Verification Error:", error);
    return {
      verified: false,
      exerciseType: "Unknown",
      estimatedRepsOrIntensity: "N/A",
      screentimeMinutesAwarded: 0,
      motivationalComment: "AI connection failed. Ensure your API key is valid."
    };
  }
};