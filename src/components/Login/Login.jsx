import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authentication-service';
import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { useLocation } from 'react-router-dom';

export default function Login() {
    const{ user, setContext} = useContext(AppContext);
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const location = useLocation();

    const updateForm = prop => e => {
        setForm({ ...form, [prop]: e.target.value });
    };

    useEffect(() => {
        if(user){
            navigate(location.state?.from.pathname || '/home');
        }
    }, [user]);

    const login = async () => {
        try{
            const credentials = await loginUser(form.email, form.password);
            setContext({ user: credentials.user, userData: null });
        }
        catch(err){
            console.log(err.message);
        }
    }

    return (
        <Box id='login-form' w="300px" p={4} mx="auto" minHeight="100vh">
            <VStack spacing={4}>
                <Heading>Login:</Heading>
                <Input value={form.email} onChange={updateForm('email')} id='login-email' type='text' placeholder='Email' />
                <Input value={form.password} onChange={updateForm('password')} id='login-password' type='password' placeholder='Password' />
                <Button onClick={login} colorScheme="orange">Sign In</Button>
            </VStack>
        </Box>
    )
}
