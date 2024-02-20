import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import { logoutUser } from '../../services/authentication-service';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Input } from "@chakra-ui/react";
import { Button, Grid } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'
import { MdNotificationsActive } from 'react-icons/md';
import { MdOutlineDiversity2 } from "react-icons/md";

export default function Header({ search, setSearch, placeholder }) {
    const { user, setContext } = useContext(AppContext);
    const [isFocused, setIsFocused] = useState(false);
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


                            <Grid templateColumns="1fr auto auto auto" mt={'20px'} justifyContent="flex-end" justifyItems="end" alignItems="center" mr='50px' mb='20px'>
                                {(location.pathname === '/home' || location.pathname === '/home/my-posts' || location.pathname === '/home/users') && (
                                    <>
                                        <Input
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            type="text"
                                            name="search"
                                            w={isFocused ? "800px" : "600px"}
                                            id="search"
                                            placeholder={placeholder}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                        />
                                        {/* {search && <Button onClick={() => setSearch('')}>Clear</Button>} */}
                                    </>
                                )}
                                <MdOutlineDiversity2 color='gray' size='23px' style={{ marginLeft: '25px', marginRight: '15px' }} />
                                <MdNotificationsActive color='gray' size='23px' style={{ marginLeft: '15px' }} />
                                <Button onClick={logOut} border="1px" color="blue" w="80px" ml='50px'>Logout</Button>
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
    setSearch: PropTypes.func,
    placeholder: PropTypes.string
}