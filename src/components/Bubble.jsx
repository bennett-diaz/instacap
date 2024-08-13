import { useContext, useState, useEffect, forwardRef } from 'react';
import { Box, HStack, VStack, Text, Button, ButtonIcon, AlertCircleIcon, Icon } from '@gluestack-ui/themed';
import { ThumbsUp, ThumbsDown, Ban, AlertCircle } from 'lucide-react';

const Bubble = forwardRef(({ text, capId, capError, onVote }, ref) => {

    return (
        <HStack
            ref={ref}
            bg={capError ? '$error00' : '$white'}
            borderWidth={capError ? '$1' : '$0'}
            borderColor='$error700'
            softShadow={capError ? '0' : '2'}
            justifyContent="flex-start"
            alignItems="center"
            space='lg'
            borderRadius="4px"
            p="1rem 1rem">
            <HStack flex="1" alignItems='center' >
                {capError && (<Icon as={AlertCircleIcon} color='$error700' p={"0 0.5rem 0 0"} />)}
                <Text fontSize="1rem" >{text}</Text>
            </HStack>
            {!capError && (<HStack >
                <Button onPress={() => onVote(capId)} isDisabled={false} display='none' bgColor='transparent' p={"0 0.25rem 0 0"} sx={{
                    "@md": {
                        display: 'flex'

                    }
                }} >
                    <ButtonIcon as={ThumbsUp} color="$textLight700" size="20px" />
                </Button>
                <Button onPress={() => onVote(capId)} isDisabled={false} display='none' bgColor='transparent' p={"0 0 0 0.25rem"} sx={{
                    "@md": {
                        display: 'flex'

                    }
                }} >
                    <ButtonIcon as={ThumbsDown} color="$textLight700" size="20px" />
                </Button>
            </HStack>)}
        </HStack>

    );

});

export default Bubble;
