import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    VStack,
    Input,
    Button,
    Text,
    Flex,
    IconButton,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
} from '@chakra-ui/react';
import { BsChatDots, BsX } from 'react-icons/bs';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const messagesEndRef = useRef(null);
    const btnRef = useRef();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

        const handleSend = async () => {
        if (!input.trim()) return;
    
        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput('');
    
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    message: input,
                    conversation: messages
                })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            if (data.success) {
                setMessages([...newMessages, { text: data.response, sender: 'bot' }]);
            } else {
                throw new Error(data.message || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages([
                ...newMessages, 
                { 
                    text: "Sorry, I'm having trouble responding right now. Please try again later.", 
                    sender: 'bot' 
                }
            ]);
        }
    };
    return (
        <>
            <IconButton
                ref={btnRef}
                icon={<BsChatDots />}
                colorScheme="teal"
                onClick={onOpen}
                position="fixed"
                bottom="4"
                right="4"
                borderRadius="full"
                size="lg"
                aria-label="Open chat"
            />

            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
                size="md"
            >
                <DrawerOverlay />
                <DrawerContent bg="gray.700" color="white">
                    <IconButton
                        icon={<BsX />}  // Changed icon
                        variant="ghost"
                        position="absolute"
                        right="8px"
                        top="8px"
                        onClick={onClose}
                        aria-label="Close chat"
                    />
                    <DrawerHeader borderBottomWidth="1px">IIIT Buy-Sell Support</DrawerHeader>

                    <DrawerBody>
                        <VStack h="full" spacing={4}>
                            <Box flex="1" w="full" overflowY="auto" pb={4}>
                                {messages.map((msg, index) => (
                                    <Flex
                                        key={index}
                                        justify={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                                        mb={2}
                                    >
                                        <Box
                                            bg={msg.sender === 'user' ? 'teal.500' : 'gray.200'}
                                            color={msg.sender === 'user' ? 'white' : 'black'}
                                            py={2}
                                            px={4}
                                            borderRadius="lg"
                                            maxW="80%"
                                        >
                                            <Text>{msg.text}</Text>
                                        </Box>
                                    </Flex>
                                ))}
                                <div ref={messagesEndRef} />
                            </Box>
                            
                            <Flex w="full">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    mr={2}
                                />
                                <Button colorScheme="teal" onClick={handleSend}>
                                    Send
                                </Button>
                            </Flex>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default ChatBot;