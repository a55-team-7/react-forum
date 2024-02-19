import { Box, Button, FormControl, FormLabel, Input, Text, VStack } from "@chakra-ui/react";
import { useContext } from 'react'
// import Button from '../Button/Button'
import './Register.css'
import AppContext from '../../context/AppContext';
import { registerUser } from '../../services/authentication-service';
import { createUserHandle, getUserByHandle } from '../../services/users-service';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_USER_NAME_LENGTH, MIN_USER_NAME_LENGTH, EMAIL_REGEX } from '../../common/contants';

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
        <Box id='register-form' w="300px" p={4} mx="auto" minHeight="100vh">
            <Text mb={4}>Join ReadIT and become part of the biggest IT lifestyle forum in the world!</Text>
            <VStack spacing={4}>
                <FormControl id="firstName">
                    <FormLabel>First Name:</FormLabel>
                    <Input value={form.firstName} onChange={updateForm('firstName')} type='text' />
                </FormControl>
                <FormControl id="lastName">
                    <FormLabel>Last Name:</FormLabel>
                    <Input value={form.lastName} onChange={updateForm('lastName')} type='text' />
                </FormControl>
                <FormControl id="username">
                    <FormLabel>Username:</FormLabel>
                    <Input value={form.username} onChange={updateForm('username')} type='text' />
                </FormControl>
                <FormControl id="email">
                    <FormLabel>Email:</FormLabel>
                    <Input value={form.email} onChange={updateForm('email')} type='email' />
                </FormControl>
                <FormControl id="password">
                    <FormLabel>Password:</FormLabel>
                    <Input value={form.password} onChange={updateForm('password')} type='password' />
                </FormControl>
                <Button onClick={register} colorScheme="orange">Join</Button>
            </VStack>
        </Box>
    )
}

export default Register;