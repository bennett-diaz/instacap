import React from 'react';
import { Modal, ModalContent, ModalBackdrop, ModalHeader, ModalBody, Text, Heading, Spinner, Icon } from '@gluestack-ui/themed';
import { CheckCircle } from 'lucide-react';
import { useLayout } from '../contexts/layoutContext';


const LOGOUT_MSG = 'Logging out...';
const DELETE_MSG = 'Deleting your account...';
const DONE_MSG = 'Done';


const LoadingModal = ({ isOpen, onClose, modalStatus }) => {

    const { TabColorMapping } = useLayout();
    const activeColor = TabColorMapping["Account"];

    return (
        <Modal isOpen={isOpen} onClose={onClose} activeColor={activeColor}>
            <ModalBackdrop />
            <ModalContent
                size="md"
                sx={{
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    width: 'calc(20rem - 20px)',
                    height: 'calc(20rem + -20px)',
                }}
            >
                <ModalHeader
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '40px',
                        padding: '0.5rem',
                    }}
                >
                    <Heading size="lg" fontWeight="$semibold">
                        {modalStatus === 'loggingOut' ? LOGOUT_MSG : modalStatus === 'deleting' ? DELETE_MSG : DONE_MSG}
                    </Heading>
                </ModalHeader>

                <ModalBody
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 'calc(100% - 40px)',
                        padding: '0.5rem',
                    }}
                >
                    {modalStatus === 'loggingOut' || modalStatus === 'deleting' ? (
                        <Spinner size={60} color={activeColor} />
                    ) : (
                        <Icon as={CheckCircle} color={activeColor} size={60} />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default LoadingModal;