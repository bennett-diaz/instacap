/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
/* eslint-disable no-multiple-empty-lines */
const {onRequest, onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {GoogleGenerativeAI} = require("@google/generative-ai");
// const functions = require("firebase-functions");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");
const {FieldValue} = require("firebase-admin/firestore");
const {GoogleAIFileManager} = require("@google/generative-ai/server");



admin.initializeApp();
const geminiApiKeySecret = defineSecret("GEMINI_API_KEY_SECRET");
const db = admin.firestore();



// const mime = require('mime-types');
// Using the Google AI SDK for JavaScript directly from a client-side app is recommended for prototyping only. If you plan to enable billing, we strongly recommend that you call the Google AI Gemini API only server-side to keep your API key safe. You risk potentially exposing your API key to malicious actors if you embed your API key directly in your JavaScript app or fetch it remotely at runtime.


// If using a single image, place the text prompt after the image.
// const fileManager = new GoogleAIFileManager(process.env.API_KEY);
// const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
// const acceptedVideoTypes = ['video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/mpg', 'video/webm', 'video/wmv', 'video/3gpp'];


// export const testFile = async (apiKey) => {
//   console.log("testFile was called");
//   // Upload the file and specify a display name.
//   const uploadResult = await fileManager.uploadFile("image.jpg", {
//       mimeType: "image/jpeg",
//       displayName: "Sample drawing",
//   });

//   // View the response.
//   console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);
// }

exports.uploadFile = onCall(
    {secrets: [geminiApiKeySecret]},
    async (data, context) => {
      const API_KEY = geminiApiKeySecret.value();
      const fileManager = new GoogleAIFileManager(API_KEY);
      const {fileBuffer, mimeType, fileName} = data;

      if (!fileBuffer || !mimeType || !fileName) {
        throw new Error("Missing required file information");
      }

      try {
        // Convert the array back to a Buffer
        const buffer = Buffer.from(fileBuffer);

        const uploadResult = await fileManager.uploadFile(buffer, {
          mimeType: mimeType,
          displayName: fileName,
        });

        console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.name}`);

        return {
          fileUri: uploadResult.file.uri,
          displayName: uploadResult.file.displayName,
          name: uploadResult.file.name,
        };
      } catch (error) {
        console.error("Failed to upload file:", error);
        throw new Error("Failed to upload file: " + error.message);
      }
    });

async function storeCaptionInFirestore(captionData) {
  const {text, modelId, prompt, temperature, captionId} = captionData;
  // console.log("captionData:", captionData);
  const captionRef = db.collection("captions").doc(captionId);
  // console.log("captionRef:", captionRef);

  try {
    await captionRef.set({
      text,
      modelId,
      prompt,
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


async function generateCaption(model, imageDescription) {
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 256,
  };

  const systemPrompt = `You are an expert social media manager. Output three instagram caption ideas for the provided image or video input. The example below contains the desired output. Here is some context:\n1) The user passes in an image or media file\n2) You then provide a list of three captions using the format provided\n2) If the user requests captions a second time, you return a JSON that contains the original list of three, plus the new three. \n3) You can assume capError to be false for now. For the first key-value pair, generate a unique ID for each caption within the 3 caption set. This unique ID should specify the model used among other identifiers. The key is the actual caption text. \n\n=example output=\n[\n    [\n        {\n            \"chatcmpl-9qmN3LsjKNm05yrCh7t2o78EVEgC9\": \"Exploring the deep blue 💦\",\n            \"capError\": false\n        },\n        {\n            \"chatcmpl-9qmN3LsjKNm05yrCh7t2o78EVEgC9\": \"Into the blue and beyond 🌊\",\n            \"capError\": false\n        },\n        {\n            \"chatcmpl-9qmN3LsjKNm05yrCh7t2o78EVEgC9\": \"Exploring blue horizons 🌊💦\",\n            \"capError\": false\n        }\n    ]\n]`;

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{text: systemPrompt}],
      },
      {
        role: "model",
        parts: [{
          text: "Understood. I'm ready to create clever, engaging Instagram " +
            "captions based on image descriptions you provide. What's the " +
            "image you'd like a caption for?",
        }],
      },
    ],
  });

  const result = await chatSession.sendMessage(imageDescription);
  // console.log("chat result:", result);
  return result.response.text();
}


exports.fetchGemini = onCall(
    {secrets: [geminiApiKeySecret]},
    async (data, context) => {
      const API_KEY = geminiApiKeySecret.value();
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
      logger.info("data", data);
      const {imageDescription} = data.data || data;
      logger.info("data.data:", imageDescription);

      try {
        const captionString = await generateCaption(model, imageDescription);
        logger.info("Raw caption string:", captionString);

        let parsedCaptions;
        try {
          parsedCaptions = JSON.parse(captionString);
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
            await storeCaptionInFirestore({
              text: captionText,
              modelId: "gemini-1.5-flash",
              prompt: imageDescription,
              temperature: 1,
              captionId: captionId,
            });
            // console.log(`Caption stored successfully: ${captionId}`);
            return captionId;
          } catch (storeError) {
            console.error(`Error storing caption ${captionId}:`, storeError);
            return null;
          }
        }));

        const successfullyStored = storedCaptions.filter((id) => id !== null);
        // console.log(`Successfully stored ${successfullyStored.length} out of ${parsedCaptions[0].length} captions`);

        if (successfullyStored.length !== parsedCaptions[0].length) {
          console.warn("Not all captions were stored successfully");
        }

        return {rawCaptionString: captionString, storedCaptions: successfullyStored};
      } catch (error) {
        logger.error("Failed to generate captions:", error);
        throw new Error("Failed to generate caption");
      }
    });
