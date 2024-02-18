import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import Button from '../Button/Button';
import { logoutUser } from '../../services/authentication-service';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

export default function Header({ search, setSearch }) {
    const { user,  setContext } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();

    const logOut = async () => {
        await logoutUser();
        setContext({ user: null, userData: null });
        navigate('../../../home');
    }


    return (
        <>
            <div className='navigation'>
                <NavLink to="/home">ReadIT</NavLink>

                {user
                    ? (
                        <>
                            {(location.pathname === '/home' || location.pathname === '/home/my-posts' || location.pathname === '/home/users') && (
                                <>
                                    <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" />
                                    {search && <Button onClick={() => setSearch('')}>Clear</Button>}
                                </>
                            )}
                            
                            <Button onClick={logOut}>Logout</Button>
                         
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