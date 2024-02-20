import { Box, Button, Flex, Heading, Input, Text, VStack, Container } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authentication-service';
import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';

export default function Login() {
    const { user, setContext } = useContext(AppContext);
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
        if (user) {
            navigate(location.state?.from.pathname || '/home');
        }
    }, [user]);

    const login = async () => {
        try {
            const credentials = await loginUser(form.email, form.password);
            setContext({ user: credentials.user, userData: null });
        }
        catch (err) {
            console.log(err.message);
        }
    }

    return (

        <Flex
            flexDirection="column"
            align="center" 
            h='100%'
            spacing={10}
            style={{
                background: 'linear-gradient(to right, blue, #ffc837)',
                minHeight: '100vh'
            }}
           
        >

            <Flex justifyContent="space-between" mt={5} width="90%" ml='30px'>
                <Box width="150px" height="40px">
                    <Logo />
                </Box>
                <Flex>
                    <Link to="/register">
                        <Button border="1px" bg='blue' color="cyan" w="80px" ml='50px'>Register</Button>
                    </Link>
                </Flex>
            </Flex>


            <Container id='login-form' w="400px" p={4} mx="auto" h='500px' justifyContent='center' mt='100px'>
                <VStack spacing={4}>
                    <Heading color='white'>Welcome back! </Heading>
                    <Input bg='pink' value={form.email} onChange={updateForm('email')} id='login-email' type='text' placeholder='Email' />
                    <Input bg='pink' value={form.password} onChange={updateForm('password')} id='login-password' type='password' placeholder='Password' />
                    <Button onClick={login} border="1px" bg='blue' w="80px" color="cyan">Sign In</Button>
                </VStack>
            </Container>
        </Flex>
    )
}
