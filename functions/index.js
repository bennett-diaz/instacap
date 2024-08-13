/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
/* eslint-disable no-multiple-empty-lines */
const {onRequest, onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
// const {GoogleGenerativeAI} = require("@google/generative-ai");
// const functions = require("firebase-functions");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");
const {FieldValue} = require("firebase-admin/firestore");
const {VertexAI} = require("@google-cloud/vertexai");
admin.initializeApp();
const geminiApiKeySecret = defineSecret("GEMINI_API_KEY_SECRET");
const projectIdSecret = defineSecret("PROJECT_ID");
const db = admin.firestore();

// const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
// const acceptedVideoTypes = ['video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/mpg', 'video/webm', 'video/wmv', 'video/3gpp'];


exports.getVertex = onCall(
    {secrets: [geminiApiKeySecret, projectIdSecret]},
    async (data) => {
      const {imageBase64} = data.data;

      try {
        if (!imageBase64) {
          console.log("No image data provided.");
          throw new Error("No image data provided.");
        }

        const apiKey = geminiApiKeySecret.value();
        const projectId = projectIdSecret.value(); // Use the secret here
        const location = "us-central1";
        const model = "gemini-1.5-flash-001";

        const vertexAI = new VertexAI({
          project: projectId,
          location: location,
          credentials: {
            api_key: apiKey,
          },
        });

        const generativeModel = vertexAI.getGenerativeModel({
          model: model,
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
            temperature: 1,
            topP: 0.95,
            topK: 64,
          },
        });
        const result = await chatSession.sendMessage("Give me caption ideas for the image or video provided by the user. Each caption should be no longer than 10 words.");
        console.log("response from Vertex AI:", result);

        const parsed = await parseCaptions(result);
        return parsed;
      } catch (error) {
        console.error("Error generating captions:", error);
        throw new Error("Failed to generate captions.");
      }
    },
);

async function parseCaptions(data) {
  try {
    console.log("Raw caption string:", JSON.stringify(data, null, 2));

    if (!data.response || !data.response.candidates || !data.response.candidates[0]) {
      throw new Error("Unexpected response structure");
    }

    const capSetString = data.response.candidates[0].content.parts[0].text;
    console.log("capSetString:", capSetString);

    let parsedCaptions;
    try {
      // Remove any trailing semicolons and whitespace
      const cleanedCapSetString = capSetString.trim().replace(/;$/, "");
      parsedCaptions = JSON.parse(cleanedCapSetString);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      // If JSON parsing fails, try to extract the captions manually
      parsedCaptions = extractCaptionsManually(capSetString);
    }

    if (!Array.isArray(parsedCaptions) || parsedCaptions.length === 0 || !Array.isArray(parsedCaptions[0])) {
      throw new Error("Unexpected format in Gemini response");
    }

    const captions = parsedCaptions[0];

    const storedCaptions = await Promise.all(captions.map(async (captionObj) => {
      const captionId = Object.keys(captionObj)[0];
      const captionText = captionObj[captionId];
      if (captionObj.capError) {
        console.warn(`Caption ${captionId} has an error flag`);
        return null;
      }
      try {
        await storeinFirestore({
          text: captionText,
          modelId: "gemini-1.5-flash",
          prompt: imageBase64,
          temperature: 1,
          captionId: captionId,
        });
        return captionId;
      } catch (storeError) {
        console.error(`Error storing caption ${captionId}:`, storeError);
        return null;
      }
    }));

    const successfullyStored = storedCaptions.filter((id) => id !== null);

    if (successfullyStored.length !== captions.length) {
      console.warn("Not all captions were stored successfully");
    }

    return captions;
  } catch (error) {
    console.error("Failed to generate captions:", error);
    throw new Error("Failed to generate caption");
  }
}

function extractCaptionsManually(capSetString) {
  const captionRegex = /"chatcmpl-[^"]+"\s*:\s*"([^"]+)"/g;
  const captions = [];
  let match;

  while ((match = captionRegex.exec(capSetString)) !== null) {
    const captionId = `chatcmpl-${Math.random().toString(36).substr(2, 9)}`;
    captions.push({
      [captionId]: match[1],
      capError: false,
    });
  }

  return captions.length > 0 ? [captions] : [];
}

exports.fetchGemini = onCall(
    {secrets: [geminiApiKeySecret, projectIdSecret]},
    async (data, context) => {
      const imageBase64 = data.data || data;
      // console.log("imageBase64 received in fetchGemini:", imageBase64);

      try {
        const {result} = await getVertex(imageBase64);
        logger.info("Raw caption string:", result);
        const capSet = result.candidates[0].content.parts[0].text; // Ensure the response matches the expected format
        console.log("capSet:", capSet);


        let parsedCaptions;
        try {
          parsedCaptions = JSON.parse(capSet);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          throw new Error("Invalid JSON format in Gemini response");
        }

        if (!Array.isArray(parsedCaptions) || parsedCaptions.length === 0 || !Array.isArray(parsedCaptions[0])) {
          throw new Error("Unexpected format in Gemini response");
        }

        const storedCaptions = await Promise.all(parsedCaptions[0].map(async (captionObj) => {
          const captionId = Object.keys(captionObj)[0];
          const captionText = captionObj[captionId];
          try {
            await storeinFirestore({
              text: captionText,
              modelId: "gemini-1.5-flash",
              prompt: imageBase64,
              temperature: 1,
              captionId: captionId,
            });
            return captionId;
          } catch (storeError) {
            console.error(`Error storing caption ${captionId}:`, storeError);
            return null;
          }
        }));

        const successfullyStored = storedCaptions.filter((id) => id !== null);

        if (successfullyStored.length !== parsedCaptions[0].length) {
          console.warn("Not all captions were stored successfully");
        }

        return {result: parseCaptions, storedCaptions: successfullyStored};
      } catch (error) {
        logger.error("Failed to generate captions:", error);
        throw new Error("Failed to generate caption");
      }
    },
);


async function storeinFirestore(captionData) {
  const {text, modelId, temperature, captionId} = captionData;
  // console.log("captionData:", captionData);
  const captionRef = db.collection("captions").doc(captionId);
  // console.log("captionRef:", captionRef);

  try {
    await captionRef.set({
      text,
      modelId,
      temperature,
      voted: false,
      timestamp: FieldValue.serverTimestamp(),
    });
    // console.log(`Successfully stored caption with ID: ${captionId}`);
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

exports.helloWorld1 = onCall((data, context) => {
  logger.info("Hello logs! From, client on call - HOT", {
    structuredData: true,
  });
  return {message: "Hello on call - HOT RELOAD"};
});


exports.fetchCap1 = onCall((data, context) => {
  logger.info("Test data for fetch captions", {structuredData: true});
  return {message: "test data"};
});

