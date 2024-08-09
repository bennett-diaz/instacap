import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: new URL('../../.env.local', import.meta.url) });

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
    const model = genAI.getGenerativeModel({model: "gemini-pro"});
    const prompt = "Write a sonnet about a programmer's life, but also make it rhyme."
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
    } catch (error) {
        console.error("Error generating content:", error);
    }
}

run();