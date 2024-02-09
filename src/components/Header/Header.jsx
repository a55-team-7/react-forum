
import {NavLink} from 'react-router-dom';
import './Header.css';

export default function Header () {
    return (
        <>
        {/*<h2>How to keep my sanity during Telerik Alpha? Forum</h2>*/}
        <div className='navigation'>
            <NavLink to="/home">ReadIT</NavLink>
            <NavLink to="/login">Sign In</NavLink>
            <NavLink to="/register">Join now!</NavLink>
        </div>
        </>
    )
}