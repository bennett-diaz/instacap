
import { useState, useEffect } from 'react';
import { HStack, Button, ButtonText, ButtonIcon, VStack, Divider, Spinner, Text, set } from '@gluestack-ui/themed';
import { RotateCcw, ChevronDown } from 'lucide-react'
import { useResults } from '../contexts/resultsContext';


const ToneButtons = ({ generationIndex }) => {

    const { workflow, setWorkflow, workflowStages, tones, setActiveTone } = useResults();

    const [buttonLoading, setButtonLoading] = useState({});
    const [buttonDisabled, setButtonDisabled] = useState({});
    const [buttonPressed, setButtonPressed] = useState({});
    let lastPressed = null;

    useEffect(() => {
        if (workflow === workflowStages.IDLE && lastPressed) {
            setButtonLoading({ [lastPressed]: false })

        }
    }, [workflow])


    const handleToneClick = (toneKey, uniqueKey) => {
        setActiveTone(toneKey);
        setWorkflow(workflowStages.RECAPTIONING);
        lastPressed = uniqueKey;
        setButtonLoading({ ...buttonLoading, [uniqueKey]: true });
        setButtonPressed({ ...buttonPressed, [uniqueKey]: true });
        const newButtonDisabledState = Object.fromEntries(
            Object.keys(tones).map(key => [`${key}-${generationIndex}`, true])
        );
        setButtonDisabled(newButtonDisabledState);
    };



    return (
        <VStack alignItems="center" space="lg">
            <HStack width="100%" paddingVertical="0.5rem" alignItems="center" justifyContent='center'>
                <Divider flex={1} h="0.13rem" bg="$textLight300" />
                <ButtonIcon as={ChevronDown} color="$textLight500" paddingHorizontal="0.5rem" size="18px" />
                <Text fontSize="1rem" color="$textLight700">Regenerate captions with a twist</Text>
                <ButtonIcon as={ChevronDown} color="$textLight500" paddingHorizontal="0.5rem" size="18px" />
                <Divider flex={1} h="0.13rem" bg="$textLight300" />
            </HStack>
            <HStack display="flex" widith="100%" justifyContent='center' flexWrap="wrap" gap="0.5rem">
                {Object.entries(tones).map(([key, value]) => {
                    const uniqueKey = `${key}-${generationIndex}`;
                    return (
                        <Button
                            key={key}
                            paddingVertical='1rem'
                            paddingLeft='0.8rem'
                            paddingRight='0.68rem'
                            onPress={() => handleToneClick(key, uniqueKey)}
                            variant={buttonPressed[uniqueKey] ? 'outline' : 'primary'}
                            isDisabled={buttonDisabled[uniqueKey]}
                            borderWidth='$1'
                            borderColor='$primary500'
                        >
                            <ButtonText>{value}</ButtonText>
                        </Button>
                    );
                })}
            </HStack>
        </VStack>
    );
}


export default ToneButtons;