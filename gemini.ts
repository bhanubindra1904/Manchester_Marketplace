import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiKey = process.env.GEMINI_API_KEY;

if (!geminiKey) {
    throw new Error('Missing Gemini environment variables');
}

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

type ImageInput = {
  mimeType: string;
  data: Uint8Array;
};

export async function queryGeminiWithImage<T>(
  prompt: string,
  image: ImageInput,
  schema: Record<string, unknown>
) {
  try {
    // Get the Gemini-Pro-Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Prepare the prompt with structured output requirements
    const structuredPrompt = `${prompt}\n\nProvide the response in the following JSON schema:\n${JSON.stringify(schema, null, 2)}`;

    // Create the content parts array with text and image
    const imagePart = {
      inlineData: {
        mimeType: image.mimeType,
        data: Buffer.from(image.data).toString('base64')
      }
    };

    // Generate content
    const result = await model.generateContent([structuredPrompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the response as JSON
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Error querying Gemini:', error);
    throw error;
  }
}
