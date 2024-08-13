import React from 'react';
import { VStack, Button, ButtonText, ButtonIcon, HStack, Heading, Divider, Icon } from '@gluestack-ui/themed';
import { Share2, LayoutGrid, ShieldCheck, Scale, Send, ExternalLink } from 'lucide-react';


const handleShare = async () => {
    console.log('share clicked');
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Instacap',
                text: 'Check out Instacap - an amazing Instagram caption tool!',
                url: document.location.href,
            });
            console.log('Thanks for sharing!');
        } catch (error) {
            console.error('Did not share:', error);
        }
    } else {
        console.log('Web Share is not supported in this browser. Copying link to clipboard');
        handleCopyLink();
    }
};

const handleCopyLink = () => {
    navigator.clipboard.writeText(document.location.href)
        .then(() => {
            console.log('Link copied to your clipboard :)');
            alert('Link copied to your clipboard :)');
        })
        .catch(err => {
            console.error('Failed to copy to clipboard:', err);
            alert(`Copy this link and send to your friends: ${document.location.href}`);
        });
};

const handleContactUs = () => {
    const email = 'team@instacap.ai';
    const subject = encodeURIComponent('User request: [enter here]');
    const body = encodeURIComponent('REQUEST TYPE: [Bug Report, Feature Request, Account Support, Partnership, Other]\n\nPLEASE ENTER YOUR REQUEST BELOW');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};

export const EngageCard = ({ activeColor }) => {
    return (
        <VStack>
            <Divider my='$4' />
            <Heading>Help us grow</Heading>
            <Button variant="link" action="secondary" justifyContent='start' onPress={handleShare} borderRadius="$0">
                <ButtonIcon as={Share2} color={activeColor} mr="$3" />
                <ButtonText fontWeight='$normal'>Share Instacap with friends</ButtonText>
            </Button>
            <Button variant="link" action="secondary" justifyContent='start' onPress={() => console.log('homescreen')} borderRadius="$0">
                <ButtonIcon as={LayoutGrid} color={activeColor} mr="$3" />
                <ButtonText fontWeight='$normal'>Save app to home screen</ButtonText>
            </Button>
        </VStack>
    )
}

export const SupportCard = ({ activeColor }) => {
    //'_blank' (new tab/window), '_self' (same tab), '_parent' (parent frame), '_top' (top-most frame), or custom
    const handleOpenLink = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <VStack >
            <Divider my='$4' />
            <Heading>Support</Heading>
            <Button variant="link" action="secondary" justifyContent='start' borderRadius="$0" onPress={() => handleOpenLink('/privacy')}>
                <HStack justifyContent="space-between" alignItems="center" width="100%">
                    <HStack>
                        <ButtonIcon as={ShieldCheck} color={activeColor} mr="$3" />
                        <ButtonText fontWeight='$normal'>Privacy policy</ButtonText>
                    </HStack>
                    <ButtonIcon as={ExternalLink} color={activeColor} />
                </HStack>
            </Button>
            <Button variant="link" action="secondary" justifyContent='start' borderRadius="$0" onPress={() => handleOpenLink('/terms')}>
                <HStack justifyContent="space-between" alignItems="center" width="100%">
                    <HStack>
                        <ButtonIcon as={Scale} color={activeColor} mr="$3" />
                        <ButtonText fontWeight='$normal'>Terms of service</ButtonText>
                    </HStack>
                    <ButtonIcon as={ExternalLink} color={activeColor} />
                </HStack>
            </Button>
            <Button variant="link" action="secondary" justifyContent='start' borderRadius="$0" onPress={handleContactUs}>
                <HStack justifyContent="space-between" alignItems="center" width="100%">
                    <HStack>
                        <ButtonIcon as={Send} color={activeColor} mr="$3" />
                        <ButtonText fontWeight='$normal'>Contact us</ButtonText>
                    </HStack>
                </HStack>
            </Button>
        </VStack>
    );
};

