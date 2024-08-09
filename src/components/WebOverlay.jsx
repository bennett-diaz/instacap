import React from 'react';
import { VStack, HStack, Box, Text, Button, ButtonText, LinearGradient, View, Image } from '@gluestack-ui/themed';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { QRCodeCanvas } from 'qrcode.react';

const WebOverlay = ({ onClose }) => {
    const overlay600x900 = "/images/overlay-600-900-v1.png";
    const gradientStyles = { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 };
    const gradients = {
        purple: ['#670DAE', '#9B59B6', '#8E44AD'],
    };

    return (
        <Box position="fixed" top="0" left="0" width="100%" height="100%" zIndex="900">
            <LinearGradient colors={gradients.purple} start={[0, 0]} end={[1, 1]} as={ExpoLinearGradient} style={gradientStyles}>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(52, 152, 219, 0.2)' }} />
                <HStack width="100%" height="100%" paddingTop="$16"> 
                    {/* Image container */}
                    <Box width="50%" height="100%" justifyContent="center" alignItems="center" padding="2rem">
                        <Box width="100%" height="100%" maxWidth="600px" maxHeight="900px" position="relative">
                            <Image 
                                source={{ uri: overlay600x900 }}
                                alt="Phone"
                                resizeMode="contain"
                                width="100%"
                                height="100%"
                                position="absolute"
                            />
                        </Box>
                    </Box>

                    {/* Right panel */}
                    <VStack width="50%" justifyContent="center" alignItems="flex-start" padding="4rem">
                        <Box>
                            <Text fontSize="3rem" fontWeight='$extrabold' lineHeight="1.2" textAlign="start" color='$white'>Get AI-powered IG captions</Text>
                            <Text fontSize="1.25rem" fontWeight='$medium' textAlign="start" color='$white' paddingTop="1rem" paddingBottom="1rem">Free and fast tool to make your social media posts more clever  🚀</Text>
                        </Box>

                        <HStack maxWidth="1200px" bgColor="hsla(0, 0%, 100%, .1)" borderRadius='16px' justifyContent="flex-start" alignItems="center" width="100%" p="1rem" gap="1rem" mt="1rem">
                            <VStack alignItems="center" justifyContent="center" width="100px" height="100px">
                                <Box borderRadius='8px' overflow='hidden' >
                                    <QRCodeCanvas
                                        value="https://instacap.ai/?source=qr_overlay"
                                        size={100}
                                        fgColor="black"
                                        bgColor="white"
                                        level='L'
                                        includeMargin={true}
                                        marginSize={4}
                                    />
                                </Box>
                            </VStack>
                            <VStack alignItems="flex-start" justifyContent="center" flex={1} >
                                <Text fontSize="1rem" color='$white' fontWeight='$semibold'>Available on mobile</Text>
                                <Text fontSize="1rem" color='$white' pt='0.5rem'>Scan the code with your smart phone, no download required</Text>
                            </VStack>
                        </HStack>
                        <VStack alignItems="start" justifyContent="center" width="100%" py="1rem">
                            <Button onPress={onClose} variant="link" action="secondary">
                                <ButtonText fontSize="1rem" underline="true" fontWeight="$normal" color="rgba(255, 255, 255, 0.7)">
                                    Continue to the web version
                                </ButtonText>
                            </Button>
                        </VStack>
                    </VStack>
                </HStack>
            </LinearGradient>
        </Box>
    );
};

export default WebOverlay;