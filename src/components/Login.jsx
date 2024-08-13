import { useEffect } from 'react';
import { VStack, HStack, Text, Heading, ButtonText } from '@gluestack-ui/themed';
import { useLayout } from '../contexts/layoutContext';
import { useAuth } from '../contexts/authContext'
import { EngageCard, SupportCard } from './AccountCards';


const NoProfileCard = ({ activeColor }) => {
    return (
        <VStack pt='$4' >
            <Heading>Your account</Heading>
            <Text>Log in or sign up for a better experience 🥳</Text>
            <div id="loader">Loading...</div>
            <div id="firebaseui-auth-container" style={{ width: '100%' }}></div>
        </VStack>
    )
}


const Login = () => {
    const { firebaseUI, firebaseUIConfig } = useAuth();
    const { TabColorMapping } = useLayout();
    const activeColor = TabColorMapping["Account"];

    useEffect(() => {
        firebaseUI.start('#firebaseui-auth-container', firebaseUIConfig);
        return () => {
            firebaseUI.reset();
        };
    }, []);

    return (
        <VStack px="$5" flex={1} space="lg" width="100%">
            <NoProfileCard activeColor={activeColor} />
            <EngageCard activeColor={activeColor} />
            <SupportCard activeColor={activeColor} />
        </VStack>
    );
}

export default Login;