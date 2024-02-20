import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';

import { logoutUser } from '../../services/authentication-service';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Input } from "@chakra-ui/react";
import { Button , Grid, Spacer} from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

export default function Header({ search, setSearch }) {
    const { user, setContext } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();

    const logOut = async () => {
        await logoutUser();
        setContext({ user: null, userData: null });
        navigate('../../../home');
    }

    const color = useColorModeValue("brand.300", "brand.300");

    return (
        <>
            <div className='navigation'>

                {user
                    ? (
                        <>

                          

                            <Grid templateColumns="1fr auto" mt={'20px'} justifyContent="flex-end" justifyItems="end" mr='50px'>
                                {(location.pathname === '/home' || location.pathname === '/home/my-posts' || location.pathname === '/home/users') && (
                                    <>
                                        <Input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" w="600px" id="search" placeholder='Find your topic!'/>
                                        {search && <Button onClick={() => setSearch('')}>Clear</Button>}
                                    </>
                                )}
                                <Button onClick={logOut} border="1px" borderColor={color} w="80px" ml='50px'>Logout</Button>
                            </Grid>
                        </>
                    )
                    : (
                        <>

                            <Button as={NavLink} to="/register">Register</Button>
                            <Button as={NavLink} to="/login">Login</Button>
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