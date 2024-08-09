import { GoogleGenerativeAI } from "@google/generative-ai";

export const startChat = async (apiKey) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  return model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500,
    },
  });
};

export const sendMessage = async (chat, message) => {
  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
};