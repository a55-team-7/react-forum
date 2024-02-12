
import { NavLink } from 'react-router-dom';
import './Header.css';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import Button from '../Button/Button';
import { logoutUser } from '../../services/authentication-service';

export default function Header() {
    const {user, userData, setContext} = useContext(AppContext);

    const logOut = async () => {
        await logoutUser();
        setContext({user: null, userData: null});
    }
    return (
        <>
            {/*<h2>How to keep my sanity during Telerik Alpha? Forum</h2>*/}
            <div className='navigation'>
                <NavLink to="/home">ReadIT</NavLink>

                {/*if the user is not logged in or logged in*/}
                {user
                    ? (
                        <>
                            {/* Search Bar */}
                            {`Welcome, ${userData?.name}`}
                            {/*profile pic with ptofile component */}
                            <Button onClick={logOut}>Logout</Button>
                        </>
                    )
                    : (<>
                        <NavLink to="/register">Register</NavLink>
                        <NavLink to="/login">Login</NavLink>
                    </>)}
            </div>
        </>
    )
}