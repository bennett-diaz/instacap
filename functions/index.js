/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest, onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs! From, client", {structuredData: true});
  response.send("Hello from Firebase! From, server");
});

exports.helloWorld1 = onCall((data, context) => {
  logger.info("Hello logs! From, client on call - HOT", {structuredData: true});
  return {message: "Hello on call - HOT RELOAD"};
});

exports.fetchCap1 = onCall((data, context) => {
  logger.info("Test data for fetch captions", {structuredData: true});
  return {message: "test data"};
});

