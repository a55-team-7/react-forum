
import {NavLink} from 'react-router-dom';
import './Header.css';

export default function Header () {
    return (
        <>
        <h2>How to keep my sanity during Telerik Alpha? Forum</h2>

        <div className='navigation'>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
        </div>
        </>
    )
}