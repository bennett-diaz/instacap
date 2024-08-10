import React, { useState, useEffect } from 'react';
import { Button, ButtonText } from '@gluestack-ui/themed';
import { startChat, sendMessage } from '../utils/geminiTemp';
import { testFile } from '../utils/geminiApi';


const Results = () => {
    const [chat, setChat] = useState(null);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // const fileInfo = testFile(process.env.REACT_APP_API_KEY);
    // console.log(fileInfo);

    useEffect(() => {
        const initChat = async () => {
            const apiKey = process.env.REACT_APP_API_KEY;
            if (apiKey) {
                const newChat = await startChat(apiKey);
                setChat(newChat);
            } else {
                console.error('API key not found');
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
        <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.sender}: </strong>
                        {msg.text}
                    </p>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    style={{ padding: '8px', marginBottom: '8px' }}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !chat}
                    style={{ padding: '8px', cursor: 'pointer' }}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default Results;