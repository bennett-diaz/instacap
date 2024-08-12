import React, { useContext, useEffect } from 'react';
import { useLayout } from '../contexts/layoutContext';
import { AppContext } from '../contexts/layoutContext';
import { useAuth } from '../contexts/authContext'
import { Box, HStack, Button, ButtonText, ButtonIcon, Switch, Text, Menu, Icon, MenuItem, MenuItemLabel, MenuIcon, set } from '@gluestack-ui/themed';

const NavBar = () => {
    const { isWeb } = useLayout();
    const homeUrl = window.location.hostname === "localhost" ? `http://localhost:${window.location.port}` : "https://instacap.ai";

    return (
        <Box
            paddingTop="1.2rem"
            paddingBottom="1.2rem"
            paddingHorizontal="1.2rem"
            borderBottomWidth={isWeb ? "0" : "$1"}
            borderColor="$borderLight300"
            position="sticky"
            top="0"
            left="0"
            right="0"
            zIndex="999"
            bg={isWeb ? "none" : "$backgroundLight0"}
            softShadow={isWeb ? "0" : "1"}
        >
            <HStack justifyContent="space-between" alignItems="center" width="100%" sx={{ "@md": { justifyContent: 'flex-start' } }}>
                <Box textAlign="center" flex="1" sx={{ "@md": { textAlign: 'left', width: 'auto' } }}>
                    <a href={homeUrl}>
                        <img id="navbar-logo" height="30rem" width="auto" src={isWeb ? "/logos/text_logo_v3_white.png" : "/logos/text_logo_v3.png"} alt="logo" />

                    </a>
                </Box>
            </HStack>
        </Box>
    );
}

export default NavBar;