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


// export const testFile = async (apiKey) => {
//     // Upload the file and specify a display name.
//     const uploadResult = await fileManager.uploadFile("image.jpg", {
//         mimeType: "image/jpeg",
//         displayName: "Sample drawing",
//     });

//     // View the response.
//     console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);
// }


export const callHelloWorld = async () => {
    try {
        const helloWorld = httpsCallable(functions, 'helloWorld');
        const result = await helloWorld();
        console.log(result.data);
        return result.data;
    } catch (error) {
        console.error("Error calling helloWorld:", error);
        throw error;
    }
};