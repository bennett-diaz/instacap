import { useContext, useRef, useEffect, useState } from 'react';
import { Box} from '@gluestack-ui/themed';
import { createErrorCaptions,  isEmptyCaptionSet, roster } from '../utils/apiUtils'
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useImage } from '../contexts/imageContext';
import { useResults } from '../contexts/resultsContext';
import { useRemote } from '../contexts/remoteConfigContext';

const Results = ({ ImgRender, CaptionSet }) => {
    const { workflow, setWorkflow, workflowStages, captionSets, setCaptionSets, setTones, activeTone, setActiveTone, summary, setSummary, capErrorMsg, hist, setHist } = useResults();
    const { imgUrl, imgSrc, imgBox, setImgBox, imageBase64 } = useImage();
    const resultsRef = useRef(null);
    const { remoteConfig } = useRemote();
    const numCompletions = remoteConfig.numCompletions;
    const toneSet = remoteConfig.tones;
    const temperature = remoteConfig.temperature;
    const geminiModel = remoteConfig.geminiModel;
    const maxTokens = remoteConfig.maxTokens;
    const topP = remoteConfig.topP;
    const topK = remoteConfig.topK;
    const prompt = remoteConfig.prompt;
    const systemInstructions = remoteConfig.systemInstructions;

    const resetResults = () => {
        setImgBox('');
        setCaptionSets([]);
        setSummary('');
        setActiveTone('');
    }

    const SpacerMobile = ({ h = "1rem", w = "1rem" }) => imgBox !== '' ? <Box height={h} width={w} sx={{ "@md": { display: 'none' } }} /> : null;
    const SpacerWeb = ({ h = "1rem", w = "1rem" }) => imgBox !== '' ? <Box height={h} width={w} display='none' sx={{ "@md": { display: 'flex' } }} /> : null;

    useEffect(() => {
        if (workflow === workflowStages.SUMMARIZING) {
            resetResults();
            setWorkflow(workflowStages.CAPTIONING);
            return;
        } else if (workflow === workflowStages.CAPTIONING) {
            const generateGeminiCaptions = async () => {
                try {
                    const functions = getFunctions();
                    const fetchGemini = httpsCallable(functions, 'fetchGemini');
                    console.log('system instructions:', systemInstructions);
                    const res = await fetchGemini({ imageBase64, geminiModel, prompt, systemInstructions, temperature, maxTokens, topP, topK });
                    setHist(res.data);
                    console.log('Response data:', res.data);
                    const newCaptionSet = roster(res.data, geminiModel);
                    setCaptionSets(prevSets =>
                        isEmptyCaptionSet(prevSets) ? [newCaptionSet] : [...prevSets, newCaptionSet]
                    );
                    setWorkflow(workflowStages.IMGRENDER);
                } catch (error) {
                    console.error('Error in Gemini caption generation:', error);
                    const mockCaptionSet = createErrorCaptions(numCompletions, capErrorMsg, geminiModel);
                    setCaptionSets(isEmptyCaptionSet(captionSets) ? [mockCaptionSet] : [...captionSets, mockCaptionSet]);
                    setWorkflow(workflowStages.IMGRENDER);
                }
            };
            generateGeminiCaptions();
            return;

        }
        else if (workflow === workflowStages.RECAPTIONING) {
            const regenCaptions = async () => {
                try {
                    const functions = getFunctions();
                    const regenCaptions = httpsCallable(functions, 'regenCaptions');
                    const res = await regenCaptions({ hist, activeTone, temperature, geminiModel, topP, topK });
                    console.log('Response data:', res.data);
                    setHist(res.data);
                    const newCaptionSet = roster(res.data, geminiModel);
                    setCaptionSets(prevSets =>
                        isEmptyCaptionSet(prevSets) ? [newCaptionSet] : [...prevSets, newCaptionSet]
                    );
                    setWorkflow(workflowStages.IDLE);
                } catch (error) {
                    console.log('Error in fetchCaptions endpoint:', error);
                    const mockCaptionSet = createErrorCaptions(numCompletions, capErrorMsg, geminiModel);
                    setCaptionSets(isEmptyCaptionSet(captionSets) ? [mockCaptionSet] : [...captionSets, mockCaptionSet]);
                    setWorkflow(workflowStages.IMGRENDER);
                }
            };
            regenCaptions();
        }
        else if (workflow === workflowStages.IMGRENDER) {
            if (!isEmptyCaptionSet(captionSets)) {
                setImgBox(imgUrl ? imgUrl : imgSrc)
                try {
                    if (toneSet) {
                        setTones(toneSet)
                    }
                } catch (error) {
                    console.error('Error fetching tones:', error);
                }
                setWorkflow(workflowStages.IDLE);
            } else {
            }
        }
    }, [workflow])

    return (
        <Box ref={resultsRef}>
            <SpacerWeb />
            <Box
                mx='1rem'
                alignItems='center'
                sx={{
                    "@md": {
                        flexDirection: 'row',
                        alignItems: "flex-start",
                        justifyContent: 'center'
                    }
                }} >
                <SpacerMobile />
                <Box flex={1} width='100%'
                    sx={{
                        "@md": {
                            width: '50%',
                        }
                    }}>
                    <ImgRender />
                </Box>
                <SpacerMobile />
                <SpacerWeb />
                <Box flex={1} width='100%'
                    sx={{
                        "@md": {
                            width: '50%'
                        }
                    }}>
                    <CaptionSet />
                </Box>
                <SpacerMobile h="3rem" />
            </Box>
            <SpacerWeb />
        </Box>
    );
};

export default Results;