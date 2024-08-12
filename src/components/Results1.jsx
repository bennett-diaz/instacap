import { useContext, useRef, useEffect, useState } from 'react';
import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed';
import { fetchSummary, createErrorCaptions, parseCaptions, isEmptyCaptionSet, fetchCaptions } from '../utils/apiUtils'
// import { fetchGemini } from '../utils/gemini-captions.mjs';
import { testFile, callHelloWorld1, callGemini, fetchGemini } from '../utils/geminiApi';
// import { testFile, callHelloWorld1, callGemini } from '../utils/geminiApi';



import { useImage } from '../contexts/imageContext';
import { useResults } from '../contexts/resultsContext';
import { useRemote } from '../contexts/remoteConfigContext';

const Results1 = ({ ImgRender, CaptionSet }) => {
    const mode = 'gemini';
    // const mode = 'openai';

    const sumLinkUrl = 'https://backend-instacap.onrender.com/api/image/summarizeUrl';
    const sumFileUrl = 'https://backend-instacap.onrender.com/api/image/summarizeFIle';
    const captionUrl = 'https://backend-instacap.onrender.com/api/image/caption';

    const { workflow, setWorkflow, workflowStages, captionSets, setCaptionSets, setTones, activeTone, setActiveTone, summary, setSummary, capErrorMsg } = useResults();
    console.log('workflow:', workflow)
    const { imgUrl, imgSrc, imgForm, imgBox, setImgBox } = useImage();
    const resultsRef = useRef(null);

    const { remoteConfig } = useRemote();
    const numCompletions = remoteConfig.numCompletions;
    const sumModelId = remoteConfig.sumModelId;
    const temperature = remoteConfig.temperature;
    const capModelId = remoteConfig.capModelId;
    const toneSet = remoteConfig.tones;

    useEffect(() => {
        // console.log('remoteConfig:', remoteConfig)
        // console.log('tones:', toneSet)
    }, [remoteConfig])

    const SpacerMobile = ({ h = "1rem", w = "1rem" }) => imgBox !== '' ? <Box height={h} width={w} sx={{ "@md": { display: 'none' } }} /> : null;
    const SpacerWeb = ({ h = "1rem", w = "1rem" }) => imgBox !== '' ? <Box height={h} width={w} display='none' sx={{ "@md": { display: 'flex' } }} /> : null;

    const resetResults = () => {
        setImgBox('');
        setCaptionSets([]);
        setSummary('');
        setActiveTone('');
    }

    useEffect(() => {
        if (workflow === workflowStages.SUMMARIZING) {
            console.log('SUMMARIZING WORKFLOW AFTER:', imgSrc)
            resetResults();

            if (mode === 'gemini') {
                setSummary('gemini_placeholder');
                setWorkflow(workflowStages.CAPTIONING);
                return;
            }
            const generateSummary = async () => {
                console.log('**test genSum**')
                try {
                    const data = await fetchSummary(imgUrl, imgForm, sumLinkUrl, sumFileUrl, sumModelId);
                    setSummary(data[0]["generated_text"]);
                    setWorkflow(workflowStages.CAPTIONING);
                } catch (error) {
                    console.log('Error in summarize endpoint:', error);
                    const mockData = createErrorCaptions(numCompletions, capErrorMsg);
                    const mockCaptionSet = await parseCaptions(mockData, true);
                    setCaptionSets(isEmptyCaptionSet(captionSets) ? [mockCaptionSet] : [...captionSets, mockCaptionSet]);
                    setWorkflow(workflowStages.IMGRENDER);
                }
            };
            generateSummary();
        } else if (workflow === workflowStages.CAPTIONING) {
            console.log('CAPTIONING WORKFLOW AFTER:', summary)
            if (mode === 'gemini') {
                const generateGeminiCaptions = async () => {
                    try {
                        // const newCaptionSet = await fetchGemini();
                        const imageDescription = "a blueberry pie";
                        const newCaptionSet = await fetchGemini(imageDescription);
                        console.log('newCaptionSet:', newCaptionSet)
                        setCaptionSets(isEmptyCaptionSet(captionSets) ? newCaptionSet : [...captionSets, ...newCaptionSet]);
                        setWorkflow(workflowStages.IMGRENDER);
                    } catch (error) {
                        console.error('Error in Gemini caption generation:', error);
                        const mockData = createErrorCaptions(numCompletions, capErrorMsg);
                        const mockCaptionSet = await parseCaptions(mockData, true);
                        setCaptionSets(isEmptyCaptionSet(captionSets) ? [mockCaptionSet] : [...captionSets, mockCaptionSet]);
                        setWorkflow(workflowStages.IMGRENDER);
                    }
                };
                generateGeminiCaptions();
                return;
            }

            if (summary !== '') {
                console.log('**test genCap**')
                const generateCaptions = async () => {
                    try {
                        const response = await fetchCaptions(captionUrl, capModelId, summary, sumModelId, numCompletions, temperature, activeTone);
                        const newCaptionSet = await parseCaptions(response, false);
                        setCaptionSets(isEmptyCaptionSet(captionSets) ? [newCaptionSet] : [...captionSets, newCaptionSet]);
                        setWorkflow(workflowStages.IMGRENDER);
                    } catch (error) {
                        console.log('Error in caption endpoint:', error);
                        const mockData = createErrorCaptions(numCompletions, capErrorMsg);
                        const mockCaptionSet = await parseCaptions(mockData, true);
                        setCaptionSets(isEmptyCaptionSet(captionSets) ? [mockCaptionSet] : [...captionSets, mockCaptionSet]);
                        setWorkflow(workflowStages.IMGRENDER);
                    }
                };
                generateCaptions();
            }
        }
        else if (workflow === workflowStages.RECAPTIONING) {
            console.log('RECAPTIONING WORKFLOW AFTER:', activeTone)
            const regenCaptions = async () => {
                try {
                    const response = await fetchCaptions(captionUrl, capModelId, summary, sumModelId, numCompletions, temperature, activeTone);
                    const newCaptionSet = await parseCaptions(response, false);
                    setCaptionSets(isEmptyCaptionSet(captionSets) ? [newCaptionSet] : [...captionSets, newCaptionSet]);
                    setWorkflow(workflowStages.IDLE);
                } catch (error) {
                    console.log('Error in fetchCaptions endpoint:', error);
                    const mockData = createErrorCaptions(numCompletions, capErrorMsg);
                    const mockCaptionSet = await parseCaptions(mockData, true);
                    setCaptionSets(isEmptyCaptionSet(captionSets) ? [mockCaptionSet] : [...captionSets, mockCaptionSet]);
                    setWorkflow(workflowStages.IMGRENDER);
                }
            };
            regenCaptions();
        }
        else if (workflow === workflowStages.IMGRENDER) {
            if (!isEmptyCaptionSet(captionSets)) {
                console.log('RENDERING WORKFLOW AFTER:', Object.values(captionSets[0][0])[0])
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
                console.log('RENDERING WORKFLOW: NO CAPTIONS')
            }
        }
        else if (workflow === workflowStages.IDLE) {
            // console.log('IDLE STATE')
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
                    <Button onPress={callHelloWorld1}>
                        <ButtonText>Call Hello World</ButtonText>
                    </Button>
                    <Button onPress={callGemini}>
                        <ButtonText>Call Gemini</ButtonText>
                    </Button>
                </Box>
                <SpacerMobile h="3rem" />
            </Box>
            <SpacerWeb />
        </Box>
    );
};

export default Results1;