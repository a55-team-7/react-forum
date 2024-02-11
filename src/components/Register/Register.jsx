
import { useContext } from 'react'
import Button from '../Button/Button'
import './Register.css'
import AppContext from '../../context/AppContext';
import { registerUser } from '../../services/authentication-service';
import { createUserHandle, getUserByHandle } from '../../services/users-service';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../Container/Container';

const Register = () => {
    const { setContext } = useContext(AppContext);
    const [form, setForm] = useState({
        name: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const updateForm = prop => e => {
        if (prop === 'name') {
            const [name, lastName = ''] = e.target.value.split(' ');
            setForm({
                ...form,
                name,
                lastName
            });
        }
        else {
            setForm({
                ...form,
                [prop]: e.target.value
            });
        }
    }

    const register = async () => {
        try {

            //check if the user is already registered
            const user = await getUserByHandle(form.username);
            if (user.exists()) {
                return console.log('User already exists');
            }

            //register the user in Firebase Authentication and in our database
            const credentials = await registerUser(form.email, form.password);
            await createUserHandle(form.username, credentials.user.uid, form.email, form.name, form.lastName);

            //update the context
            setContext({ user, userData: null }); 
            navigate('/home'); //redirect to the home page when the operations are finished

        } catch (err) {
            console.log(err.message);
        }
    }


    return (
        <div id='register-form'>
            <h3>Join ReadIT and become part of the biggest
                IT lifestyle forum in the world!</h3>
            <Container>

                <label htmlFor='register-first-name'>Full Name:</label>
                <input value={`${form.name} ${form.lastName}`} onClick={updateForm('name')} id='register-first-name' type='text' name='register-first-name' />
                <br />
                <br />
                <label htmlFor='register-username'>Username:</label>
                <input value={form.username} onClick={updateForm('username')} id='register-username' type='text' name='register-username' />
                <br />
                <br />
                <label htmlFor='register-email'>Email:</label>
                <input value={form.email} onClick={updateForm('email')} id='register-email' type='text' name='register-email' />
                <br />
                <br />
                <label htmlFor='register-password'>Password:</label>
                <input value={form.password} onClick={updateForm('username')} id='register-password' type='password' name='register-password' />
                <br />
                <br />

            </Container>
            <Button onClick={register}>Join</Button>
        </div>
    )
}

export default Register;