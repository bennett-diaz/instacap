export const isEmptyCaptionSet = (set) => {
    return set.length === 0 || set.every(subArray => subArray.length === 0);
}

const generateUniqueId = (modelId) => {
    return `${modelId}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createErrorCaptions = (numCompletions, capErrorMsg, modelId) => {
    console.log("Generating mock data");

    const mockCaptions = Array.from({ length: numCompletions }, () => {
        const uniqueId = generateUniqueId(modelId);
        return {
            [uniqueId]: capErrorMsg,
            capError: true
        };
    });
    return mockCaptions;
};

export const roster = (hist, modelId) => {
    const generateUniqueId = (modelId) => {
        return `${modelId}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const lastModelResponse = hist
        .filter(item => item.role === 'model')
        .pop();

    if (!lastModelResponse) {
        return [];
    }

    try {
        let raw = lastModelResponse.parts[0].text.trim();
        if (raw.startsWith("```")) {
            raw = raw.replace(/^```json\s*|^```\s*/, '').replace(/```$/, '');
        }

        const parsedCaptions = JSON.parse(raw);
        return parsedCaptions[0].map(caption => {
            const uniqueId = generateUniqueId(modelId);
            const [originalId] = Object.keys(caption);
            return {
                [uniqueId]: caption[originalId],
                capError: caption.capError
            };
        });
    } catch (error) {
        console.error("Error parsing captions:", error);
        return [];
    }
}

export const handleVote = async (captionId) => {
    try {
        console.log('Placeholder for vote behavior: ', captionId);
    } catch (error) {
        console.error('Error in handleVote:', error);
        throw error;
    }
}