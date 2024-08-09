import React from 'react';
import Results from './components/Results';
import { GluestackUIProvider, Box, Button, ButtonText } from '@gluestack-ui/themed';
import { config } from "./styles/gluestack_config/gluestack-ui.config"


function App() {
    console.log('hello world')

    return (
        <GluestackUIProvider config={config}>
        <div>
            <h1>Hello, Instacap!</h1>
            <Results />
            <Button>
                <ButtonText>Hello world</ButtonText>
            </Button>
        </div>
        </GluestackUIProvider>
    );
}

export default App;