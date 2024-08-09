// src/components/Results.jsx
import React, { useState, useEffect } from 'react';
import { Box, Text, Input, Button, VStack } from '@gluestack-ui/themed';
import { startChat, sendMessage } from '../utils/geminiTest';

const Results = () => {
    const [chat, setChat] = useState(null);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const initChat = async () => {
            const apiKey = process.env.REACT_APP_API_KEY;
            if (apiKey) {
                const newChat = await startChat(apiKey);
                setChat(newChat);
            }
        };
        initChat();
    }, []);

    const handleSend = async () => {
        if (input.trim() && chat) {
            setIsLoading(true);
            setMessages(prev => [...prev, { text: input, sender: 'You' }]);
            setInput('');
            try {
                const response = await sendMessage(chat, input);
                setMessages(prev => [...prev, { text: response, sender: 'Gemini' }]);
            } catch (error) {
                console.error('Error sending message:', error);
            }
            setIsLoading(false);
        }
    };

    return (
        <Box p={4}>
            <VStack space={4}>
                {messages.map((msg, index) => (
                    <Text key={index}>
                        <Text fontWeight="bold">{msg.sender}: </Text>
                        {msg.text}
                    </Text>
                ))}
                <Input
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type your message..."
                />
                <Button onPress={handleSend} disabled={isLoading || !chat}>
                    {isLoading ? 'Sending...' : 'Send'}
                </Button>
            </VStack>
        </Box>
    );
};

export default Results;