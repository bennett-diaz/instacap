import { createContext, useContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const ResultsProvider = ({ children }) => {

    const workflowStages = {
        IDLE: 'idle',
        SUMMARIZING: 'summarizing',
        CAPTIONING: 'captioning',
        RECAPTIONING: 'recaptioning',
        IMGRENDER: 'imgrender',
    };
    const capErrorMsg = 'Something went wrong. Please try again'

    const [hist, setHist] = useState([]);
    const [tones, setTones] = useState([]);
    const [activeTone, setActiveTone] = useState('')
    const [captionSets, setCaptionSets] = useState([]);
    const [summary, setSummary] = useState('')
    const [workflow, setWorkflow] = useState(workflowStages.IDLE || 'idle');

    return (
        <AppContext.Provider value={{ hist, setHist,captionSets, setCaptionSets, summary, setSummary, tones, setTones, activeTone, setActiveTone, capErrorMsg, workflow, setWorkflow, workflowStages }}>
            {children}
        </AppContext.Provider>
    );
};

export const useResults = () => useContext(AppContext);