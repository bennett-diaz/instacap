const startChat = async (apiKey) => {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
    return model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });
  };
  
  const sendMessage = async (chat, message) => {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  };
  
  export { startChat, sendMessage };