import { Box, Icon, Button, ButtonText, ButtonIcon, FlatList, HStack, VStack, Text, Actionsheet, ActionsheetContent, ActionsheetItem, ActionsheetIcon, ActionsheetItemText, ActionsheetBackdrop, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper } from '@gluestack-ui/themed';
import { useState, useContext, useRef, useMemo, useEffect } from 'react';
import { FileQuestion, HelpCircle, Send, Library, Code, Scale, Mailbox, Share2, Hammer, ShieldCheck, Gavel } from 'lucide-react';
import { AppContext } from '../contexts/layoutContext';
import Privacy from './PrivacyPolicy';
import Terms from './TermsOfService';




const Drawer = () => {

    // Flatlist imlementation here: https://reactnative.dev/docs/flatlist
    const [showActionsheet, setShowActionsheet] = useState(true)
    const { devMode, setDevMode, selectedContent, setSelectedContent, setTabContent } = useContext(AppContext)



    const handleClose = () => {
        setShowActionsheet(!showActionsheet)
        setSelectedContent(null);
    }

    const handleItemClick = (content) => {
        handleClose();
        setSelectedContent(content);
        setTabContent(null);

    };

    useEffect(() => {
        // console.log('selectedContent:', selectedContent)
    }
        , [selectedContent])


    const CustomActionsheetItem = ({ icon, text, onPress }) => {
        return (
            <ActionsheetItem onPress={onPress}>
                <HStack alignItems="center" gap="0.25rem">
                    <ButtonIcon style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon as={icon} />
                    </ButtonIcon>
                    <ActionsheetItemText>{text}</ActionsheetItemText>
                </HStack>
            </ActionsheetItem>
        );
    };


    return (

        <Box >
            <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={"$900"}>
                <ActionsheetBackdrop />
                <ActionsheetContent  >
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <CustomActionsheetItem icon={Send} text="Contact us" onPress={() => handleItemClick(Privacy)} />
                    <CustomActionsheetItem icon={Share2} text="Share with friends" onPress={() => handleItemClick(Privacy)} />
                    {/* <CustomActionsheetItem icon={Hammer} text="Feature request" onPress={() => handleItemClick(Privacy)} /> */}
                    <CustomActionsheetItem icon={ShieldCheck} text="Privacy policy" onPress={() => handleItemClick(Privacy)} />
                    <CustomActionsheetItem icon={Scale} text="Terms of use" onPress={() => handleItemClick(Terms)} />
                    {/* <Text fontSize="0.85rem" color='$textLight500' textAlign='left' thin paddingHorizontal="1.5rem" paddingVertical="0.5rem">
                        2024 Step Function LLC
                    </Text> */}
                </ActionsheetContent>

            </Actionsheet>
        </Box>

    );
}

export default Drawer;
