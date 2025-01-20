import React, { useState } from 'react';
import { 
    Container, 
    VStack, 
    Heading, 
    Input, 
    Button, 
    Text,
    Box,
    Stack
} from '@chakra-ui/react';

const ProfilePage = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        age: user?.age || '',
        contactNumber: user?.contactNumber || ''
    });

    const handleUpdate = async () => {
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('user', JSON.stringify({...user, ...formData}));
                setUser({...user, ...formData});
                setIsEditing(false);
                alert('Profile updated successfully');
            }
        } catch (error) {
            alert('Error updating profile');
        }
    };

    return (
        <Container maxW="container.sm" py={10}>
            <VStack spacing={4}>
                <Heading>Profile</Heading>
                {isEditing ? (
                    <>
                        <Stack spacing={4} w="100%">
                            <Box>
                                <Text mb={2}>First Name</Text>
                                <Input 
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </Box>
                            <Box>
                                <Text mb={2}>Last Name</Text>
                                <Input 
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </Box>
                            <Box>
                                <Text mb={2}>Contact Number</Text>
                                <Input 
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                                />
                            </Box>
                        </Stack>
                        <Button colorScheme="teal" onClick={handleUpdate}>Save Changes</Button>
                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    </>
                ) : (
                    <>
                        <Text>First Name: {user?.firstName}</Text>
                        <Text>Last Name: {user?.lastName}</Text>
                        <Text>Email: {user?.email}</Text>
                        <Text>Contact Number: {user?.contactNumber}</Text>
                        <Button colorScheme="teal" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </>
                )}
            </VStack>
        </Container>
    );
};

export default ProfilePage;