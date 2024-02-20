import { Box, Button, FormControl, FormLabel, Input, Text, VStack,Flex , Container } from "@chakra-ui/react";
import { useContext } from 'react'
// import Button from '../Button/Button'
import './Register.css'
import AppContext from '../../context/AppContext';
import { registerUser } from '../../services/authentication-service';
import { createUserHandle, getUserByHandle } from '../../services/users-service';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_USER_NAME_LENGTH, MIN_USER_NAME_LENGTH, EMAIL_REGEX } from '../../common/contants';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import { Heading } from "@chakra-ui/react";

const Register = () => {
    const { setContext } = useContext(AppContext);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const emailValid = EMAIL_REGEX.test(form.email);

    const updateForm = prop => e => {
        setForm({
            ...form,
            [prop]: e.target.value
        });
    }

    const register = async () => {
        try {
            //input constraints validation
            if (form.firstName.length < MIN_USER_NAME_LENGTH || form.firstName.length > MAX_USER_NAME_LENGTH) {
                alert(`Your first name should be between ${MIN_USER_NAME_LENGTH} and ${MAX_USER_NAME_LENGTH} symbols`);
            }
            if (form.lastName.length < MIN_USER_NAME_LENGTH || form.lastName.length > MAX_USER_NAME_LENGTH) {
                alert(`Your last name should be between ${MIN_USER_NAME_LENGTH} and ${MAX_USER_NAME_LENGTH} symbols`);
            }
            if (!emailValid) {
                alert('Please enter a valid email');
            }

            //check if the user is already registered
            const user = await getUserByHandle(form.username);
            if (user) {
                alert('User already exists');
            } else {
                try {
                    //register the user in Firebase Authentication and in our database
                    const credentials = await registerUser(form.email, form.password);
                    await createUserHandle(form.username, credentials.user.uid, form.email, form.firstName, form.lastName);

                } catch (err) {
                    if (err.message === 'Firebase: Error (auth/email-already-in-use).') {
                        alert('email already in use');
                        return;
                    }
                }

                //update the context
                setContext({ user, userData: null });
                navigate('/home'); //redirect to the home page when the operations are finished
            }
        } catch (err) {
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
                    <Link to="/login">
                        <Button border="1px" bg='blue' color="cyan" w="80px" ml='50px'>Login</Button>
                    </Link>
                </Flex>
            </Flex>

            <Container id='register-form' maxW="400px" p={4} mx="auto" >
                <Heading  as='h3' color='white' mb={4}>Join ReadIT and become part of the biggest IT lifestyle forum in the world!</Heading>
                <VStack spacing={4}>
                    <FormControl id="firstName">
                        <Input bg='white' value={form.firstName} onChange={updateForm('firstName')} type='text' placeholder='First Name' />
                    </FormControl>
                    <FormControl id="lastName">
                        <Input bg='white' value={form.lastName} onChange={updateForm('lastName')} type='text' placeholder='Last Name' />
                    </FormControl>
                    <FormControl id="username">
                        <Input bg='white' value={form.username} onChange={updateForm('username')} type='text' placeholder='Username' />
                    </FormControl>
                    <FormControl id="email">
                        <Input bg='white' value={form.email} onChange={updateForm('email')} type='email' placeholder='Email' />
                    </FormControl>
                    <FormControl id="password">
                        <Input bg='white' value={form.password} onChange={updateForm('password')} type='password' placeholder='Password' />
                    </FormControl>
                    <Button onClick={register} border="1px" bg='blue' w="80px" color="cyan">Join</Button>
                </VStack>
            </Container>
        </Flex>
    )
    
}

export default Register;