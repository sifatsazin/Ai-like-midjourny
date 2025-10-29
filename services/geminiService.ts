
import { GoogleGenAI, Modality } from "@google/genai";
import type { ReferenceImage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string, referenceImage: ReferenceImage | null): Promise<string> => {
  const model = ai.models;

  const parts = [];
  if (referenceImage) {
    parts.push({
      inlineData: {
        data: referenceImage.base64,
        mimeType: referenceImage.file.type,
      },
    });
  }
  
  if (prompt) {
      parts.push({ text: prompt });
  } else if (!referenceImage) {
      throw new Error("Either a prompt or a reference image must be provided.");
  }


  const response = await model.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: parts,
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

  if (imagePart && imagePart.inlineData) {
    const base64ImageBytes: string = imagePart.inlineData.data;
    return `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
  }

  throw new Error('Image generation failed or no image was returned.');
};
