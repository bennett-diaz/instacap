import React, { useEffect, useContext, useRef } from 'react';
import { useResults } from '../contexts/resultsContext';
import { Box } from '@gluestack-ui/themed';
import ToneButtons from './ToneButtons';
import Bubble from './Bubble';
import { handleVote } from '../utils/apiUtils'


const CaptionSet = () => {
    const { workflow, setWorkflow, workflowStages, captionSets } = useResults()

    const latestCaptionRef = useRef(null);
    const voteUrl = 'sample_url';


    // scroll to the last Bubble of the latest caption set; trigger once image has rendered
    useEffect(() => {
        if (workflow === workflowStages.IDLE) {
            if (captionSets.length > 0 && latestCaptionRef.current) {
                latestCaptionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // console.log('Scrolling to:', latestCaptionRef.current);
            }
        }
    }, [workflow]);




    const onVote = async (capId) => {
        console.log('Vote pressed for caption ID: ', capId);
        try {
            const result = await handleVote(voteUrl, capId);
            console.log('Vote result:', result);
        } catch (error) {
            console.error('Error in onVote:', error);
        }
    };

    const hasCaptionError = (captionSet) => {
        return captionSet.some(captionObject => {
            const capError = Object.values(captionObject)[1];
            return capError;
        });
    };

    const renderCaptionsUser = () => {
        return captionSets.map((captionGeneration, genIndex) => (
            <React.Fragment key={genIndex}>
                {captionGeneration.map((captionObject, captionIndex) => {
                    const capId = Object.keys(captionObject)[0];
                    const captionText = Object.values(captionObject)[0];
                    const capError = Object.values(captionObject)[1];
                    const isLastBubble = genIndex === captionSets.length - 1 && captionIndex === captionGeneration.length - 1;
                    return <Bubble
                        key={captionIndex}
                        text={captionText}
                        capId={capId}
                        capError={capError}
                        onVote={onVote}
                        // attach ref to the last bubble of the latest caption set
                        ref={isLastBubble ? latestCaptionRef : null}
                    />
                })}
                {!hasCaptionError(captionGeneration) && <ToneButtons generationIndex={genIndex} />}
            </React.Fragment>
        ));
    };


    return (
        <Box gap="1rem">
            {renderCaptionsUser()}
        </Box>
    );
};


export default CaptionSet;