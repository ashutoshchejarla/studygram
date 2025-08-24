import { GoogleGenAI } from "@google/genai";

// Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GeneratedQuestion {
  text: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: string;
}

export async function generateQuestions(content: string, sourceName: string): Promise<GeneratedQuestion[]> {
  try {
    const systemPrompt = `You are an educational AI that generates high-quality multiple choice questions from study materials. 
Generate engaging, challenging questions that test comprehension and critical thinking. Always provide exactly 4 options (A, B, C, D) and indicate the correct answer.
Respond with JSON in this format: 
{'questions': [{'text': 'Question text here?', 'options': {'a': 'Option A text', 'b': 'Option B text', 'c': 'Option C text', 'd': 'Option D text'}, 'correctAnswer': 'a'}]}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  options: {
                    type: "object",
                    properties: {
                      a: { type: "string" },
                      b: { type: "string" },
                      c: { type: "string" },
                      d: { type: "string" }
                    },
                    required: ["a", "b", "c", "d"]
                  },
                  correctAnswer: { type: "string" }
                },
                required: ["text", "options", "correctAnswer"]
              }
            }
          },
          required: ["questions"]
        },
      },
      contents: `Generate 10 multiple choice questions from this content from "${sourceName}":\n\n${content}`,
    });

    const rawJson = response.text;
    console.log(`Raw JSON: ${rawJson}`);

    if (rawJson) {
      const result = JSON.parse(rawJson);
      return result.questions || [];
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions from content");
  }
}

export async function extractYouTubeTranscript(url: string): Promise<string> {
  // Extract video ID from YouTube URL
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (!videoIdMatch) {
    throw new Error("Invalid YouTube URL format");
  }

  const videoId = videoIdMatch[1];
  
  try {
    // For now, return a placeholder. In production, you'd integrate with YouTube Transcript API
    // or use a service like youtube-transcript npm package
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract educational content from YouTube video ID: ${videoId}. Since we cannot access the actual transcript, please provide a placeholder response indicating that YouTube transcript extraction would happen here in production.`,
    });

    return response.text || "YouTube transcript extraction would be implemented here using the YouTube Transcript API or similar service.";
  } catch (error) {
    throw new Error("Failed to extract YouTube content. Please ensure the URL is valid and the video has captions available.");
  }
}
