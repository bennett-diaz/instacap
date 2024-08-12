import { isUrlValid, formDataHasImage } from './imageUtils';

export const fetchSummary = async (imgUrl, imgForm, sumLinkUrl, sumFileUrl, sumModelId) => {
    try {
        let fetchConfig;
        let endpoint;

        if (isUrlValid(imgUrl)) {
            console.log('Image URL was submitted');
            fetchConfig = {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "imageUrl": imgUrl, "sumModelId": sumModelId })
            };
            endpoint = sumLinkUrl;
        } else if (formDataHasImage(imgForm)) {
            imgForm.set('sumModelId', sumModelId);
            fetchConfig = {
                method: 'post',
                body: imgForm
            };
            endpoint = sumFileUrl;
        } else {
            throw new Error('Invalid image URL or form data');
        }

        const response = await fetch(endpoint, fetchConfig);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;  // Or return a specific part of data, like data[0]["generated_text"]
    } catch (error) {
        throw new Error('Error in fetchSummary endpoint: ' + error.message);
    }
};

export const fetchCaptions = async (captionUrl, capModelId, summary, sumModelId, numCompletions, temperature, activeTone) => {
    try {
        const response = await fetch(captionUrl, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "capModelId": capModelId,
                "summaryText": summary,
                "sumModelId": sumModelId,
                "numCompletions": numCompletions,
                "temp": temperature,
                "styleId": activeTone
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data

    } catch (error) {
        throw new Error('Error in fetchCaptions endpoint: ' + error.message);
    }
};

export const handleVote = async (voteUrl, captionId) => {
    try {
        const response = await fetch(voteUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ captionId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error in handleVote! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in handleVote:', error);
        throw error;
    }
}


export const isEmptyCaptionSet = (set) => {
    return set.length === 0 || set.every(subArray => subArray.length === 0);
}


export const parseCaptions = (apiResponse, isError) => {
    try {
        if (!apiResponse || !apiResponse.choices || !Array.isArray(apiResponse.choices)) {
            throw new Error("Invalid API response");
        }

        const { id, choices } = apiResponse;
        const newCaptionSets = choices.map((choice, index) => {
            const content = choice.message.content;

            if (typeof content !== 'string' || content.trim() === '') {
                throw new Error("Invalid or empty caption content");
            }

            return { [id]: content, capError: isError };
        });
        return newCaptionSets;
    } catch (error) {
        console.log("Error while parsing captions:", error);
        throw error; // Re-throw the error to be caught by fetchCaptions
    }
};

export const createErrorCaptions = (numCompletions, capErrorMsg) => {
    console.log("generating mock data");
    const mockChoices = Array.from({ length: numCompletions }, (_, index) => ({
        message: { content: capErrorMsg }
    }));
    return {
        id: 'error',
        choices: mockChoices
    };
};


// export const wakeBackend = (sumModelId, awakenUrl, awakenAbortController) => {
//     awakenAbortController.current = new AbortController();

//     fetch(awakenUrl, {
//         method: 'post',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             "sumModelId": sumModelId
//         }),
//         signal: awakenAbortController.current.signal // Pass signal to fetch

//     })
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//         })
//         .then(data => {
//             console.log(`Backend awake\nHF model status: ${data.status}; ${data.message}`);
//             awakenAbortController.current = null;
//         })
//         .catch(error => {
//             if (error.name === 'AbortError') {
//                 console.log('awaken fetch was aborted');
//             } else {
//                 console.log('Error from wakeBackend:', error);
//             }
//         })
// }