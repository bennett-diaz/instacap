import React, { useState } from 'react';
import { GluestackUIProvider, Box, Button, ButtonText, Text } from '@gluestack-ui/themed';
import { config } from "./styles/gluestack_config/gluestack-ui.config"
import Results from './components/Results';
import WebOverlay from './components/WebOverlay';
import BottomBar from './components/BottomBar';
import { perf } from './firebaseConfig'
import { ImageProvider } from "./contexts/imageContext"
import { useLayout } from './contexts/layoutContext';




function App() {
    const { isWeb, setIsWeb } = useLayout();

    const handleOverlayClose = () => {
        setIsWeb(false);
    };


    return (
        <GluestackUIProvider config={config}>
            <ImageProvider>
                <Box>
                    {isWeb && <WebOverlay onClose={handleOverlayClose} />}
                    <Text>Hello Instacap!</Text>
                    <Results />
                    <Button>
                        <ButtonText>Hello world</ButtonText>
                    </Button>
                    {/* <BottomBar/> */}

                </Box>
            </ImageProvider>
        </GluestackUIProvider>
    );
}

export default App;