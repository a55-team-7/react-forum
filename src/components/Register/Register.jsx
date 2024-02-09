
import './Register.css'

export default function Register () {

    return (
        <div id='register-form'>
            <h2>Register:</h2>
            <label htmlFor='register-username'>Username:</label>
            <input id='register-username' type='text' name='register-username'/>
            <br />
            <br />
            <label htmlFor='register-email'>Email:</label>
            <input id='register-email' type='text' name='register-email'/>
            <br />
            <br />
            <label htmlFor='register-password'>Password:</label>
            <input id='register-password' type='password' name='register-password'/>
            <br />
            <br />
            <label htmlFor='register-first-name'>First Name:</label>
            <input id='register-first-name' type='text' name='register-first-name'/>
            <br />
            <br />
            <label htmlFor='register-last-name'>Last Name:</label>
            <input id='register-last-name' type='text' name='register-last-name'/>
        </div>
    )
}