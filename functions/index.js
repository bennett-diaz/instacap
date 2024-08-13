/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
/* eslint-disable no-multiple-empty-lines */
const {onRequest, onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");
const {FieldValue} = require("firebase-admin/firestore");
const {VertexAI} = require("@google-cloud/vertexai");
admin.initializeApp();
const geminiApiKeySecret = defineSecret("GEMINI_API_KEY_SECRET");
const projectIdSecret = defineSecret("PROJECT_ID");
const db = admin.firestore();


const initializeVertexAI = (apiKey, projectId, location) => {
  return new VertexAI({
    project: projectId,
    location: location,
    credentials: {
      api_key: apiKey,
    },
  });
};

exports.fetchGemini = onCall(
    {secrets: [geminiApiKeySecret, projectIdSecret]},
    async (data) => {
      const {imageBase64, systemInstructions, geminiModel, temperature, topP, topK} = data.data;
      try {
        if (!imageBase64) {
          console.log("No image data provided.");
          throw new Error("No image data provided.");
        }
        console.log(systemInstructions);
        const apiKey = geminiApiKeySecret.value();
        const projectId = projectIdSecret.value();
        const location = "us-central1";

        const vertexAI = initializeVertexAI(apiKey, projectId, location);

        const generativeModel = vertexAI.getGenerativeModel({
          model: geminiModel,
          systemInstruction: {
            parts: [
              {text: "You are an expert social media manager who creates clever Instagram captions."},
              {text: "The format for this is below: it is important that you stick to this structure.You can assume capError to be false for now. For the first key-value pair, generate a unique ID for each caption within the 3 caption set. This unique ID should specify the model used among other identifiers. The key is the actual caption text. An example of the format is: \n\n=example output=\n[\n    [\n        {\n            \"chatcmpl-9qmN3LsjKNm05yrCh7t2o78EVEgC9\": \"Exploring the deep blue 💦\",\n            \"capError\": false\n        },\n        {\n            \"chatcmpl-9qmN3LsjKNm05yrCh7t2o78EVEgC9\": \"Into the blue and beyond 🌊\",\n            \"capError\": false\n        },\n        {\n            \"chatcmpl-9qmN3LsjKNm05yrCh7t2o78EVEgC9\": \"Exploring blue horizons 🌊💦\",\n            \"capError\": false\n        }\n    ]\n]"},
            ],
          },
        });

        const chatSession = generativeModel.startChat({
          history: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    data: imageBase64,
                    mimeType: "image/jpeg",
                  },
                },
              ],
            },
            {
              role: "model",
              parts: [
                {text: "Thanks for the context. Once the user begins requesting captions, I will only respond in json for the conversation, using the structured format you provided"},
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 256,
            temperature: temperature,
            topP: topP,
            topK: topK,
          },
        });
        const result = await chatSession.sendMessage("Give me caption ideas for the image or video provided by the user. Each caption should be no longer than 10 words.");
        const hist = chatSession.historyInternal;
        // await storeinFirestore(result);
        return hist;
      } catch (error) {
        console.error("Error generating captions:", error);
        throw new Error("Failed to generate captions.");
      }
    },
);

exports.regenCaptions = onCall(
    {secrets: [geminiApiKeySecret, projectIdSecret]},
    async (data) => {
      const {hist, activeTone, temperature, geminiModel, topP, topK} = data.data;
      const apiKey = geminiApiKeySecret.value();
      const projectId = projectIdSecret.value();
      const location = "us-central1";

      const vertexAI = initializeVertexAI(apiKey, projectId, location);
      const generativeModel = vertexAI.getGenerativeModel({
        model: geminiModel,
      });
      try {
        const chatSession = generativeModel.startChat({
          history: hist,
          generationConfig: {
            maxOutputTokens: 256,
            temperature: temperature,
            topP: topP,
            topK: topK,
          },
        });
        let prompt = "Generate 3 caption ideas. Make them ";
        prompt = prompt + " " + activeTone;
        const result = await chatSession.sendMessage(prompt);
        console.log("result:", result);
        // await storeinFirestore(result);
        const newHist = chatSession.historyInternal;
        return newHist;
      } catch (error) {
        console.error("Error regenerating captions:", error);
        throw new Error("Failed to regenerate captions.");
      }
    },
);

async function storeinFirestore(captionData) {
  const {text, geminiModel, temperature, captionId} = captionData;

  // Ensure captionId is valid and non-empty
  if (!captionId || typeof captionId !== "string" || captionId.trim() === "") {
    throw new Error("Invalid captionId");
  }

  const captionRef = db.collection("captions").doc(captionId);
  console.log("Storing in DB!");

  try {
    await captionRef.set({
      text,
      modelId: geminiModel,
      temperature,
      voted: false,
      timestamp: FieldValue.serverTimestamp(),
    });
    console.log(`Successfully stored caption with ID: ${captionId}`);
    return captionId;
  } catch (error) {
    console.error(`Error storing caption with ID ${captionId}:`, error);
    throw error;
  }
}

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs! From, client", {structuredData: true});
  response.send("Hello from Firebase! From, server");
});

