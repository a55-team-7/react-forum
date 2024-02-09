
import './Login.css'

export default function Login () {

    return (
        <div id='login-form'>
            <h2>Login:</h2>
            <label htmlFor='login-username'>Username:</label>
            <input id='login-username' type='text' name='login-username'/>
            <br />
            <br />
            <label htmlFor='login-email'>Email:</label>
            <input id='login-email' type='text' name='login-email'/>
            <br />
            <br />
            <label htmlFor='login-password'>Password:</label>
            <input id='login-password' type='password' name='login-password'/>
        </div>
    )
}