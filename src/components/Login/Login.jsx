import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button'
import Container from '../Container/Container'
import './Login.css'
import { loginUser } from '../../services/authentication-service';
import { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';


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
        <div id='login-form'>
            <Container>

                <h2>Login:</h2>
                <br />
                <label htmlFor='login-email'>Email:</label>
                <input value={form.email} onChange={updateForm('email')} id='login-email' type='text' name='login-email' />
                <br />
                <br />
                <label htmlFor='login-password'>Password:</label>
                <input value={form.password} onChange={updateForm('password')} id='login-password' type='password' name='login-password' />

            </Container>
            <Button onClick={login}>Sign In</Button>
        </div>
    )
}