import { useEffect, useState } from 'react';
import { Box, Text, Button, ButtonText, ButtonIcon, VStack, HStack, Heading, Divider, Avatar, Icon } from '@gluestack-ui/themed';
import { useLayout } from '../contexts/layoutContext';
import { useAuth } from '../contexts/authContext';
import LoadingModal from './LoadingModal';
import Login from './Login';
import { ScanFace, LogOut, UserX } from 'lucide-react';
import { EngageCard, SupportCard } from './AccountCards';

const MyAccount = () => {
    const { curUser, handleSignOut, handleDeleteAccount } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState('loggingOut');
    const { TabColorMapping } = useLayout();
    const activeColor = TabColorMapping["Account"];

    const showLoadingModal = async () => {
        setShowModal(true);
        await new Promise((resolve) => {
            setTimeout(() => {
                setTimeout(() => {
                    setModalStatus('done');
                    setTimeout(() => {
                        setShowModal(false);
                        resolve();
                    }, 2000);
                }, 1000);
            }, 1000);
        });
    };

    const handleLogout = async () => {
        setModalStatus('loggingOut');
        await showLoadingModal();
        handleSignOut();
    };

    const handleDelete = async () => {
        setModalStatus('deleting')
        await showLoadingModal();
        handleDeleteAccount();
    };

    const ProfileCard = ({ curUser, activeColor }) => {
        const phoneNumber = curUser?.phoneNumber || 'Phone number hidden';

        const formatDate = (timestamp) => {
            if (!timestamp) return 'N/A';
            const date = new Date(parseInt(timestamp));
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const month = months[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();
            return `${month} ${day}, ${year}`;
        };

        const userSince = formatDate(curUser?.metadata.createdAt);

        return (
            <VStack space="lg" pt='$4'>
                <Heading>My account</Heading>
                <HStack justifyContent="space-between" alignItems="center">
                    <HStack space="md" alignItems="center">
                        <Avatar bg={activeColor}>
                            <Icon as={ScanFace} color="white" size="lg" />
                        </Avatar>
                        <VStack>

                            <Text fontSize="1rem" fontWeight='$normal'>Linked to phone: <Text fontWeight="$semibold" color={activeColor}>{phoneNumber}</Text></Text>
                            <Text fontSize="1rem" fontWeight='$normal'>Instacap user since: <Text fontWeight="$semibold" color={activeColor}>{userSince}</Text></Text>

                        </VStack>
                    </HStack>
                </HStack>
            </VStack>
        )
    }

    const SettingsCard = ({ handleLogout, handleDelete, activeColor }) => {
        return (
            <VStack >
                <Divider my='$4' />
                <Button variant="link" action="secondary" justifyContent='start' onPress={handleLogout} borderRadius="$0" >
                    <ButtonIcon as={LogOut} color={activeColor} mr="$3" />
                    <ButtonText fontWeight='$normal'>Logout</ButtonText>
                </Button>
                <Button variant="link" action="secondary" justifyContent='start' onPress={handleDelete} borderRadius="$0">
                    <ButtonIcon as={UserX} color={activeColor} mr="$3" />
                    <ButtonText fontWeight='$normal'>Delete account</ButtonText>
                </Button>
            </VStack>
        )
    }

    return (
        <VStack px="$5" flex={1}>
            {curUser ? (
                <>
                    <ProfileCard curUser={curUser} activeColor={activeColor} />
                    <EngageCard activeColor={activeColor} />
                    <SupportCard activeColor={activeColor} />
                    <SettingsCard handleLogout={handleLogout} handleDelete={handleDelete} activeColor={activeColor} />
                    <LoadingModal isOpen={showModal} onClose={() => setShowModal(false)} modalStatus={modalStatus} activeColor={activeColor} />
                </>
            ) : (
                <>
                    <Login activeColor={activeColor} />
                    <LoadingModal isOpen={showModal} onClose={() => setShowModal(false)} modalStatus={modalStatus} activeColor={activeColor} />
                </>
            )}
        </VStack>
    );
}

export default MyAccount;