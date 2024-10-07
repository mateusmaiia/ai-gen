'use server';

import db from '@/utils/db'
import Query from '@/models/query'
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GEN_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function runAi(text: string) {
const chatSession = model.startChat({
    generationConfig,
// safetySettings: Adjust safety settings
// See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
    ],
});

const result = await chatSession.sendMessage(text);
return result.response.text()
}


export async function saveQuery(template: object, email: string, query: string, content:string) {
  try {
    await db()

    const newQuery = new Query({
      template, 
      email,
      query,
      content
    })

    await newQuery.save()
    
    return{
      ok: true,
    }
  } catch (error) {
    console.log("saveQuery error: ",error)
    return{
      ok: false,
    }
  }
}