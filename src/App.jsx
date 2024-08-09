import React from 'react';
import { GluestackUIProvider, Box, Button, ButtonText, Text } from '@gluestack-ui/themed';
import { config } from "./styles/gluestack_config/gluestack-ui.config"
import Results from './components/Results';
import WebOverlay from './components/WebOverlay';


function App() {
    console.log('hello world')
    return (
        <GluestackUIProvider config={config}>
        <Box>
            <WebOverlay />
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