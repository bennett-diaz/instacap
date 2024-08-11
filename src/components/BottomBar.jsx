import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext, useLayout } from '../contexts/layoutContext';
import { Box, HStack, Button, ButtonText, ButtonIcon, VStack, Text, Icon, Pressable } from '@gluestack-ui/themed';
import { defaultTabs } from '../contexts/remoteConfigContext';


const BottomBar = () => {

    const { tabs, activeTab, setActiveTab, tabContent, setTabContent, setSelectedContent } = useContext(AppContext)
    const { TabColorMapping, IconMapping } = useLayout();

    const handleTabChange = (tabId) => {
        if (activeTab !== tabId) {

            setActiveTab(tabId);
            setSelectedContent(null);
        }
        if ((tabId !== tabs.MoreTab?.fixed_id || defaultTabs.MoreTab?.fixed_id) && tabContent !== tabId) {
            setTabContent(tabId);
        }
    };
    const tabLayout = useMemo(() => {
        const currentTabs = tabs || defaultTabs;

        return [
            { icon: currentTabs.HomeTab?.icon, label: currentTabs.HomeTab?.label, fixed_id: currentTabs.HomeTab?.fixed_id },
            { icon: currentTabs.AccountTab?.icon, label: currentTabs.AccountTab?.label, fixed_id: currentTabs.AccountTab?.fixed_id },
            { icon: currentTabs.MoreTab?.icon, label: currentTabs.MoreTab?.label, fixed_id: currentTabs.MoreTab?.fixed_id },
        ];
    }, [tabs]);

    return (
        <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            position="sticky"
            bottom={0}
            w="100%"
            py="$3"
            // px="$12"
            bg="$backgroundLight0"
            borderTopWidth="$1"
            borderColor="$borderLight300"
            softShadow="1"
            zIndex="999"
            // gap={56}
            sx={{
                "@md": {
                    display: 'none',
                }
            }}
        >
            <Box flex={1} display="flex" justifyContent="flex-start">
                {tabLayout[0] && renderTab(tabLayout[0])}
            </Box>

            <Box display="flex" justifyContent="center" px="1rem">
                {tabLayout[1] && renderTab(tabLayout[1])}
            </Box>

            <Box flex={1} display="flex" justifyContent="flex-end">
                {tabLayout[2] && renderTab(tabLayout[2])}
            </Box>
        </Box>
    );

    function renderTab(tab) {
        const IconFile = IconMapping[tab.icon];
        const activeColor = TabColorMapping[tab.fixed_id];
        return (
            <Pressable key={tab.label} onPress={() => handleTabChange(tab.fixed_id)}>
                <VStack alignItems="center">
                    <Icon as={IconFile} strokeWidth={2.25} color={activeTab === tab.fixed_id ? activeColor : "$textLight400"} size={24} />
                    <Text fontSize="0.85rem" fontWeight='$semibold' color={activeTab === tab.fixed_id ? activeColor : "$textLight400"}>
                        {tab.label}
                    </Text>
                </VStack>
            </Pressable>
        );
    }
};

export default BottomBar;