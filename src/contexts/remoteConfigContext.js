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
                    capModelId: getString(myReConfigObj, 'capModelId') || myReConfigObj.defaultConfig.capModelId,
                    sumModelId: getString(myReConfigObj, 'sumModelId') || myReConfigObj.defaultConfig.sumModelId,
                    numCompletions: getNumber(myReConfigObj, 'numCompletions') || myReConfigObj.defaultConfig.numCompletions,
                    temperature: getNumber(myReConfigObj, 'temperature') || myReConfigObj.defaultConfig.temperature,
                    tones: safelyGetJson(myReConfigObj, 'tones') || myReConfigObj.defaultConfig.tones,
                    freqPenalty: getNumber(myReConfigObj, 'freqPenalty') || myReConfigObj.defaultConfig.freqPenalty,
                    presPenalty: getNumber(myReConfigObj, 'presPenalty') || myReConfigObj.defaultConfig.presPenalty,
                    maxTokens: getNumber(myReConfigObj, 'maxTokens') || myReConfigObj.defaultConfig.maxTokens,
                    tabs: safelyGetJson(myReConfigObj, 'bottomTabs') || myReConfigObj.defaultConfig.bottomTabs,
                    greeting: getString(myReConfigObj, 'greeting') || myReConfigObj.defaultConfig.greeting,
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

myReConfigObj.defaultConfig = ({
    'welcome_message': 'Welcome',
    'greeting': 'default',
    'tones': { "confident": "bold 💪", "self-deprecating": "cute 🤦", "motivating to join a positive cause": "rally🎗️", "romantic": "luv 💘" },
    'numCompletions': 3,
    'temperature': 1,
    'capModelId': 'gpt-3.5-turbo',
    'sumModelId': 'Salesforce/blip-image-captioning-base',
    "bottomTabs": defaultTabs,
    "freqPenalty": 0,
    "presPenalty": 0,
    "maxTokens": 100,
});


const confirmRemoteConfigDefaults = () => {
    const defaultModel = myReConfigObj.defaultConfig.sumModelId
    const activeModel = getString(myReConfigObj, 'sumModelId')
    if (defaultModel !== activeModel) {
        console.log('warning: default sumModel and myReConfigObj sumModel not aligned')
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