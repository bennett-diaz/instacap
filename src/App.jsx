import React, { useState, useEffect } from 'react';
import { GluestackUIProvider, Box, Button, ButtonText, Text } from '@gluestack-ui/themed';
import { config } from "./styles/gluestack_config/gluestack-ui.config"
import { useRemote, defaultTabs } from './contexts/remoteConfigContext'
import { useAuth } from './contexts/authContext';
import { ResultsProvider } from './contexts/resultsContext';
import { AppContext, useLayout } from './contexts/layoutContext';
import { perf } from './firebaseConfig'
import { ImageProvider } from "./contexts/imageContext"

import NavBar from './components/NavBar';
import BottomBar from './components/BottomBar';
import HeroSection from './components/HeroSection';
import CTA from './components/CTA';
import WebOverlay from './components/WebOverlay';

import Results1 from './components/Results';
import CaptionSet from './components/CaptionSet';
import ImgRender from './components/ImgRender';
import Login from './components/Login';
import MyAccount from './components/MyAccount';

import Drawer from './components/Drawer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';



function App() {

    // app context
    const { curUser } = useAuth();
    const { remoteConfig } = useRemote();
    const tabs = remoteConfig.tabs || defaultTabs;
    const [activeTab, setActiveTab] = useState(tabs.HomeTab.fixed_id);
    const [tabContent, setTabContent] = useState(tabs.HomeTab.fixed_id);
    const [page, setPage] = useState(tabs.HomeTab.fixed_id);
    const [selectedContent, setSelectedContent] = useState(null);
    const { isWeb, setIsWeb } = useLayout();

    const handleOverlayClose = () => {
        setIsWeb(false);
    };


    const [currentRoute, setCurrentRoute] = useState(window.location.pathname.slice(1) || 'home');

    useEffect(() => {
        const handlePopState = () => {
            setCurrentRoute(window.location.pathname.slice(1) || 'home');
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigateTo = (route) => {
        window.history.pushState(null, '', `/${route}`);
        setCurrentRoute(route);
    };

    const renderContent = () => {
        switch (currentRoute) {
            case 'privacy':
                return <PrivacyPolicy />;
            case 'terms':
                return <TermsOfService />;
            case 'account':
                return curUser ? <MyAccount /> : <Login />;
            default:
                return (
                    <ImageProvider>
                        <ResultsProvider>
                            <Box flex="1" display="flex" flexDirection="column">
                                {isWeb && <WebOverlay onClose={handleOverlayClose} />}

                                {/* More Tab */}
                                {activeTab === (tabs.MoreTab?.fixed_id) && (
                                    <>
                                        <Drawer />
                                        {selectedContent && selectedContent}

                                    </>
                                )}

                                {/* Home tab */}
                                <ImageProvider>
                                    <ResultsProvider>
                                        {tabContent === (tabs.HomeTab?.fixed_id) && (
                                            <>
                                                <HeroSection />
                                                <CTA />
                                                <Results1 ImgRender={ImgRender} CaptionSet={CaptionSet} />
                                            </>
                                        )}
                                    </ResultsProvider>
                                </ImageProvider>

                                {/* Account tab */}
                                {tabContent === (tabs.AccountTab?.fixed_id) && (
                                    curUser ? <MyAccount /> : <Login />
                                )}
                            </Box>
                            <BottomBar />
                        </ResultsProvider>
                    </ImageProvider>
                );
        }
    };

    return (
        <AppContext.Provider value={{ navigateTo, remoteConfig, curUser, activeTab, page, setPage, setActiveTab, tabContent, tabs, setTabContent, selectedContent, setSelectedContent }}>
            <GluestackUIProvider config={config}>
                <Box display="flex" flexDirection="column" minHeight="100vh">
                    <NavBar />
                    {renderContent()}
                </Box>
            </GluestackUIProvider >
        </AppContext.Provider>

    )
}

export default App;