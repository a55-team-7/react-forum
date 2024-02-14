
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
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const updateForm = prop => e => {
        setForm({
            ...form,
            [prop]: e.target.value
        });
    }

    const register = async () => {
        try {
            //input constraints validation
            if (form.firstName.length < 4 || form.firstName.length > 32) {
                alert('Your first name should be between 4 and 32 symbols');
            }
            if (form.lastName.length < 4 || form.lastName.length > 32) {
                alert('Your last name should be between 4 and 32 symbols');
            }
            if (!emailRegex.test(form.email)) {
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
        <div id='register-form'>
            <h3>Join ReadIT and become part of the biggest
                IT lifestyle forum in the world!</h3>
            <Container>

                <label htmlFor='register-first-name'>First Name:</label>
                <input value={form.firstName} onChange={updateForm('firstName')} id='register-first-name' type='text' name='register-first-name' />
                <br />
                <br />
                <label htmlFor='register-last-name'>Last Name:</label>
                <input value={form.lastName} onChange={updateForm('lastName')} id='register-last-name' type='text' name='register-last-name' />
                <br />
                <br />
                <label htmlFor='register-username'>Username:</label>
                <input value={form.username} onChange={updateForm('username')} id='register-username' type='text' name='register-username' />
                <br />
                <br />
                <label htmlFor='register-email'>Email:</label>
                <input value={form.email} onChange={updateForm('email')} id='register-email' type='text' name='register-email' />
                <br />
                <br />
                <label htmlFor='register-password'>Password:</label>
                <input value={form.password} onChange={updateForm('password')} id='register-password' type='password' name='register-password' />
                <br />
                <br />

            </Container>
            <Button onClick={register}>Join</Button>
        </div>
    )
}

export default Register;