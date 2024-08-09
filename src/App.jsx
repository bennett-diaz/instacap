import React, { useState } from 'react';
import { GluestackUIProvider, Box, Button, ButtonText, Text } from '@gluestack-ui/themed';
import { config } from "./styles/gluestack_config/gluestack-ui.config"
import Results from './components/Results';
import WebOverlay from './components/WebOverlay';


function App() {
    console.log('hello world')
    const [isWeb, setIsWeb] = useState(true);

    const handleOverlayClose = () => {
        setIsWeb(false);
    };


    return (
        <GluestackUIProvider config={config}>
            <Box>
                {isWeb && <WebOverlay onClose={handleOverlayClose} />}
                <Text>Hello, Instacap!</Text>
                <Results />
                <Button>
                    <ButtonText>Hello world</ButtonText>
                </Button>

            </Box>
        </GluestackUIProvider>
    );
}

export default App;