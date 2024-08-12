/* eslint-disable max-len */
const {onRequest, onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {GoogleGenerativeAI} = require("@google/generative-ai");

/**
 * Hello World function that responds to HTTP requests.
 * @param {Object} request - The HTTP request object.
 * @param {Object} response - The HTTP response object.
 */
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs! From, client", {structuredData: true});
  response.send("Hello from Firebase! From, server");
});

/**
 * Hello World function that can be called from the client.
 * @param {Object} data - The data passed from the client.
 * @param {Object} context - The context of the function call.
 * @return {Object} A message object.
 */
exports.helloWorld1 = onCall((data, context) => {
  logger.info("Hello logs! From, client on call - HOT", {
    structuredData: true,
  });
  return {message: "Hello on call - HOT RELOAD"};
});

/**
 * Test function for fetching captions.
 * @param {Object} data - The data passed from the client.
 * @param {Object} context - The context of the function call.
 * @return {Object} A test data object.
 */
exports.fetchCap1 = onCall((data, context) => {
  logger.info("Test data for fetch captions", {structuredData: true});
  return {message: "test data"};
});

/**
 * Generates captions using the Gemini API.
 * @param {Object} model - The Gemini model instance.
 * @param {string} imageDescription - The description of the image.
 * @return {Promise<string>} The generated caption.
 */
async function generateCaption(model, imageDescription) {
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 256,
  };

  console.log("entering generateCaption function");

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
  console.log("result:", result);
  return result.response.text();
}


exports.fetchGemini = onCall(async (data, context) => {
  const API_KEY = "AIzaSyD1GE8VWwM3KOUdoUijfQaj1RiPd40maJQ";
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
  console.log("entering fetchGemini cloud function");

  const imageDescription = "a man riding a surfboard on a wave";
  console.log("imageDescription:", imageDescription);

  try {
    const captionString = await generateCaption(model, imageDescription);
    logger.info("Raw caption string:", captionString);

    // Return the raw string
    return {rawCaptionString: captionString};
  } catch (error) {
    logger.error("Failed to generate captions:", error);
    throw new Error("Failed to generate caption");
  }
});


// exports.fetchGemini = onCall(async (data, context) => {
//   // const API_KEY = process.env.GEMINI_API_KEY;
//   const API_KEY = "AIzaSyD1GE8VWwM3KOUdoUijfQaj1RiPd40maJQ";
//   const genAI = new GoogleGenerativeAI(API_KEY);
//   const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
//   console.log("entering fetchGemini cloud function");

//   // const {imageDescription} = data;
//   const imageDescription = "a man riding a surfboard on a wave";
//   console.log("imageDescription:", imageDescription);

//   try {
//     const captionString = await generateCaption(model, imageDescription);
//     logger.info("Raw caption string:", captionString);

//     let parsedCaptions;
//     try {
//       parsedCaptions = JSON.parse(captionString);
//     } catch (parseError) {
//       logger.error("Error parsing JSON:", parseError);
//       throw new Error("Invalid JSON format in Gemini response");
//     }

//     if (
//       !Array.isArray(parsedCaptions) ||
//       parsedCaptions.length === 0 ||
//       !Array.isArray(parsedCaptions[0])
//     ) {
//       throw new Error("Unexpected format in Gemini response");
//     }

//     return {captions: parsedCaptions};
//   } catch (error) {
//     logger.error("Failed to generate or parse captions:", error);
//     throw new Error("Failed to generate caption");
//   }
// });
