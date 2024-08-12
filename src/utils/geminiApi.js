import { GoogleGenerativeAI } from "@google/generative-ai";
import { functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';


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

export const fetchGemini = async (imageDescription) => {
    try {
        const fetchGemini = httpsCallable(functions, 'fetchGemini');
        console.log('img description sent:', imageDescription);
        const captionResponse = await fetchGemini({ imageDescription }); 
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