import { useContext, useRef, useEffect, useState } from 'react';
import { Box, Text, Button, ButtonText } from '@gluestack-ui/themed';
import { fetchSummary, createErrorCaptions, parseCaptions, isEmptyCaptionSet, fetchCaptions } from '../utils/apiUtils'
import { testFile, callHelloWorld1, callGemini, fetchGemini } from '../utils/geminiApi';
import { getFunctions, httpsCallable } from 'firebase/functions';




import { useImage } from '../contexts/imageContext';
import { useResults } from '../contexts/resultsContext';
import { useRemote } from '../contexts/remoteConfigContext';

const Results1 = ({ ImgRender, CaptionSet }) => {
    const mode = 'gemini';
    // const mode = 'openai';

    // const sumLinkUrl = 'https://backend-instacap.onrender.com/api/image/summarizeUrl';
    // const sumFileUrl = 'https://backend-instacap.onrender.com/api/image/summarizeFIle';
    const captionUrl = 'https://backend-instacap.onrender.com/api/image/caption';

    const { workflow, setWorkflow, workflowStages, captionSets, setCaptionSets, setTones, activeTone, setActiveTone, summary, setSummary, capErrorMsg } = useResults();
    console.log('workflow:', workflow)
    const { imgUrl, imgSrc, imgForm, imgBox, setImgBox, imageBase64, setimageBase64 } = useImage();
    const resultsRef = useRef(null);

    const { remoteConfig } = useRemote();
    const numCompletions = remoteConfig.numCompletions;
    const sumModelId = remoteConfig.sumModelId;
    const temperature = remoteConfig.temperature;
    const capModelId = remoteConfig.capModelId;
    const toneSet = remoteConfig.tones;
    const gemModel = remoteConfig.gemModel;
    console.log("gemModel:", gemModel)

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
        } else if (workflow === workflowStages.CAPTIONING) {
            console.log('CAPTIONING WORKFLOW AFTER:', summary)
            if (mode === 'gemini') {
                const generateGeminiCaptions = async () => {
                    try {

                        // console.log('imageBase64 before getVertex:', imageBase64);
                        const functions = getFunctions();
                        const getVertex = httpsCallable(functions, 'getVertex');
                        const res = await getVertex({ imageBase64 });
                        const newCaptionSet = res.data;
                        const newCaptionArr = Array.isArray(newCaptionSet) ? [newCaptionSet] : [[newCaptionSet]];
                        console.log('NEWCAPTIONSET:', newCaptionArr)
                        setCaptionSets(isEmptyCaptionSet(captionSets) ? newCaptionArr : [...captionSets, ...newCaptionArr]);
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
                </Box>
                <SpacerMobile h="3rem" />
            </Box>
            <SpacerWeb />
        </Box>
    );
};

export default Results1;