import { NavLink } from 'react-router-dom';
import './Header.css';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import Button from '../Button/Button';
import { logoutUser } from '../../services/authentication-service';
import PropTypes from 'prop-types';

export default function Header({ search, setSearch }) {
    const { user, userData, setContext } = useContext(AppContext);

    const logOut = async () => {
        await logoutUser();
        setContext({ user: null, userData: null });
    }

    let userPageLink = '/users/';
    if (userData) {
        userPageLink += userData.handle;
    }

    return (
        <>
            <div className='navigation'>
                <NavLink to="/home">ReadIT</NavLink>

                {user
                    ? (
                        <>
                            <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" />
                            {search && <Button onClick={() => setSearch('')}>Clear</Button>}
                            <Button onClick={logOut}>Logout</Button>
                            <NavLink to={userPageLink}>User Page</NavLink>
                        </>
                    )
                    : (
                        <>
                            <NavLink to="/register">Register</NavLink>
                            <NavLink to="/login">Login</NavLink>
                        </>
                    )
                }
            </div>
        </>
    )
}


Header.propTypes = {
    search: PropTypes.string,
    setSearch: PropTypes.func
}