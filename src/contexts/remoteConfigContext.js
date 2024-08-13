import { myReConfigObj } from '../firebaseConfig';
import { fetchAndActivate, fetchConfig, getValue, getString, getNumber, activate, getAll } from 'firebase/remote-config';
import { createContext, useContext, useEffect, useState } from 'react';


export const RemoteConfigContext = createContext();

export const RemoteConfigProvider = ({ children }) => {
    const [remoteConfig, setRemoteConfig] = useState({});

    useEffect(() => {
        const activateLast = async () => {
            try {
                await activate(myReConfigObj);
                console.log("myReconfigObj: ", myReConfigObj)
                const configValues = {
                    numCompletions: getNumber(myReConfigObj, 'numCompletions') || myReConfigObj.defaultConfig.numCompletions,
                    tones: safelyGetJson(myReConfigObj, 'tones') || myReConfigObj.defaultConfig.tones,
                    tabs: safelyGetJson(myReConfigObj, 'bottomTabs') || myReConfigObj.defaultConfig.bottomTabs,
                    greeting: getString(myReConfigObj, 'greeting') || myReConfigObj.defaultConfig.greeting,
                    geminiModel: getString(myReConfigObj, 'geminiModel') || myReConfigObj.defaultConfig.geminiModel,
                    temperature: getNumber(myReConfigObj, 'temperature') || myReConfigObj.defaultConfig.temperature,
                    maxTokens: getNumber(myReConfigObj, 'maxTokens') || myReConfigObj.defaultConfig.maxTokens,
                    topP: getNumber(myReConfigObj, 'topP') || myReConfigObj.defaultConfig.topP,
                    topK: getNumber(myReConfigObj, 'topK') || myReConfigObj.defaultConfig.topK,
                    prompt: safelyGetJson(myReConfigObj, 'prompt') || myReConfigObj.defaultConfig.prompt,
                    systemInstructions: safelyGetJson(myReConfigObj, 'systemInstructions') || myReConfigObj.defaultConfig.systemInstructions,
                };
                setRemoteConfig(configValues);
                confirmRemoteConfigDefaults();
                const bottomTabs = JSON.parse(myReConfigObj._storageCache.activeConfig.bottomTabs);
                console.log('Activated last config: ', bottomTabs)
            } catch (error) {
                console.error('Error activating last remote config:', error);
            }
        };
        const fetchNext = async () => {
            try {
                await fetchConfig(myReConfigObj);
                const bottomTabs = JSON.parse(myReConfigObj._storageCache.activeConfig.bottomTabs);
                console.log('Fetched next config: ', bottomTabs)
                activate(myReConfigObj)
            } catch (error) {
                console.error('Error fetching next remote config:', error);
            }
        };
        activateLast();
        fetchNext();
    }, []);

    return (
        <RemoteConfigContext.Provider value={{ remoteConfig }}>
            {children}
        </RemoteConfigContext.Provider>
    );
};

// TODO: may not need
export const useRemote = () => useContext(RemoteConfigContext);


myReConfigObj.settings = {
    minimumFetchIntervalMillis: 3600000, // 60 minutes
    fetchTimeoutMillis: 60000,// 1 minute
    // minimumFetchIntervalMillis: 12000, // 2 minutes
};

export const defaultTabs =
{
    "HomeTab": {
        "icon": "Sparkles",
        "label": "Home",
        "fixed_id": "Home"
    },
    "AccountTab": {
        "icon": "User",
        "label": "Account",
        "fixed_id": "Account"
    },
    "MoreTab": {
        "icon": "LayoutGrid",
        "label": "More",
        "fixed_id": "More"
    }
}

export const defaultPrompt = {
        "systemInstructions": [
            {
                "text": "You are an expert social media manager who creates clever Instagram captions."
            },
            {
                "text": "The format for this is below: it is important that you stick to this structure. You can assume capError to be false for now. For the first key-value pair, generate a unique ID for each caption within the 3 caption set. This unique ID should specify the model used among other identifiers. The key is the actual caption text. An example of the format is: \n\n=example output=\n[\n    [\n        {\n            \"chatcmpl-9qmN3LsjKNm05yrCh7t2o78EVEgC9\": \"Exploring the deep blue 💦\",\n            \"capError\": false\n        },\n        {\n            \"chatcmpl-9qmN3LsjKNm05yrCh7t2o78EVEgC9\": \"Into the blue and beyond 🌊\",\n            \"capError\": false\n        },\n        {\n            \"chatcmpl-9qmN3LsjKNm05yrCh7t2o78EVEgC9\": \"Exploring blue horizons 🌊💦\",\n            \"capError\": false\n        }\n    ]\n]"
            }
        ],
        "task": "Give me caption ideas for the image or video provided by the user. Each caption should be no longer than 10 words."
}

myReConfigObj.defaultConfig = ({
    'greeting': 'default',
    'tones': { "confident": "bold 💪", "self-deprecating": "cute 🤦", "motivating to join a positive cause": "rally🎗️", "romantic": "luv 💘" },
    'numCompletions': 3,
    'temperature': 1,
    "bottomTabs": defaultTabs,
    "freqPenalty": 0,
    "presPenalty": 0,
    "maxTokens": 300,
    "topP": 0.96,
    "topK": 64,
    "geminiModel": "gemini-1.5-flash",
    "prompt": defaultPrompt,
});


const confirmRemoteConfigDefaults = () => {
    const defaultModel = myReConfigObj.defaultConfig.geminiModel
    const activeModel = getString(myReConfigObj, 'geminiModel')
    if (defaultModel !== activeModel) {
        console.log('warning: default LLMand myReConfigObj LLM are not equivalent')
        console.log(defaultModel, "vs.", activeModel)
    }
}

const safelyGetJson = (config, key) => {
    try {
        const str = getString(config, key);
        // console.log('successfuly got string for key: ', key, "value: ", str)
        const obj = JSON.parse(str);
        // console.log('successfuly parsed string for key: ', key, "value: ", obj)
        return obj
    } catch (error) {
        console.error(`Error retrieving string for key "${key}":`, error);
        return null;
    }
};