import { GoogleGenerativeAI } from "@google/generative-ai";

export const startChat = async (apiKey) => {

  const model_name="gemini-1.5-flash"
  // const model_name="gemini-1.5-pro"

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: model_name });

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