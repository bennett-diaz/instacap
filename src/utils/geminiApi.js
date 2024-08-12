import { GoogleGenerativeAI } from "@google/generative-ai";
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';

// import { GoogleAIFileManager } from "@google/generative-ai/server";
// const mime = require('mime-types');
// Using the Google AI SDK for JavaScript directly from a client-side app is recommended for prototyping only. If you plan to enable billing, we strongly recommend that you call the Google AI Gemini API only server-side to keep your API key safe. You risk potentially exposing your API key to malicious actors if you embed your API key directly in your JavaScript app or fetch it remotely at runtime.


// If using a single image, place the text prompt after the image.
// const fileManager = new GoogleAIFileManager(process.env.API_KEY);
// const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
// const acceptedVideoTypes = ['video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/mpg', 'video/webm', 'video/wmv', 'video/3gpp'];


export const testFile = async (apiKey) => {
    // export const testFile = async (apiKey) => {
    console.log('testFile was called')
    // // Upload the file and specify a display name.
    // const uploadResult = await fileManager.uploadFile("image.jpg", {
    //     mimeType: "image/jpeg",
    //     displayName: "Sample drawing",
    // });

    // // View the response.
    // console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);
}


export const callHelloWorld = async () => {
    try {
        const url = process.env.NODE_ENV === 'development'
            ? 'http://localhost:5001/instacap-gemini-firebase/us-central1/helloWorld'
            : 'https://us-central1-instacap-gemini-firebase.cloudfunctions.net/helloWorld';

        const response = await fetch(url);
        const result = await response.text();
        console.log('Hello world result:', result);
    } catch (error) {
        console.error('Error calling helloWorld:', error);
    }
};

export const callHelloWorld1 = async () => {
    try {
        const helloWorld1 = httpsCallable(functions, 'helloWorld1');
        const result = await helloWorld1();
        console.log('Hello world result:', result.data);
    } catch (error) {
        console.error('Error calling helloWorld1:', error);
    }
};

export const callGemini = async () => {
    try {
        const helloWorld1 = httpsCallable(functions, 'helloWorld1');
        const result = await helloWorld1();
        console.log('callGemini:', result.data);
    } catch (error) {
        console.error('Error calling callGemini:', error);
    }
};

export const fetchGemini = async () => {
    try {
        const fetchGemini = httpsCallable(functions, 'fetchGemini');
        const captionResponse = await fetchGemini(); 
        console.log('fetchGemini:', captionResponse.data);

        const rawCaptionString = captionResponse.data.rawCaptionString; 
        console.log("Raw caption string:", rawCaptionString);

        let parsedCaptions;
        try {
            parsedCaptions = JSON.parse(rawCaptionString); 
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            throw new Error("Invalid JSON format in Gemini response");
        }

        if (!Array.isArray(parsedCaptions) || parsedCaptions.length === 0 || !Array.isArray(parsedCaptions[0])) {
            throw new Error("Unexpected format in Gemini response");
        }

        return parsedCaptions; 
    } catch (error) {
        console.error("Failed to generate or parse captions:", error.message);
        throw error;
    }
}