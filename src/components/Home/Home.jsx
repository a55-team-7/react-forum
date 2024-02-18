
import { useContext, useState } from 'react'
import Popular from '../Popular/Popular'
import Recents from '../Recents/Recents'
import './Home.css'
import AppContext from '../../context/AppContext'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Button, Container, Grid, Box } from '@chakra-ui/react'
import Header from '../Header/Header'
import PropTypes from 'prop-types'
import { CustomNavLink } from '../ChakraUI/CustomNavLink'
import { useColorModeValue } from '@chakra-ui/react'


export default function Home({ search, setSearch }) {

    const { user, userData } = useContext(AppContext);
    const [view, setView] = useState('home');
    const location = useLocation();

    let userPageLink = '/users/';
    if (userData) {
        userPageLink += userData.handle;
    }

    const color = useColorModeValue("brand.100", "brand.300");

    return (
        <>
            {user ?
                <div>
                    <Grid gridTemplateColumns='1fr 4fr'  gridGap='80px'>

                        <Box bg={color} >

                            <Grid justifyItems='start' gridTemplateColumns='auto' mt='30px' gridGap='20px' w='150px' >
                                <CustomNavLink to="/home">ReadIT</CustomNavLink>
                                {(location.pathname !== '/home/my-posts' && location.pathname !== '/home') && <CustomNavLink to="my-posts" >My Feed</CustomNavLink>}
                                <CustomNavLink as={NavLink} to="recents" >Recents</CustomNavLink>
                                <CustomNavLink as={NavLink} to="popular" >Popular</CustomNavLink>
                                {userData && !userData.isBlocked && <CustomNavLink as={NavLink} to="create-post" >Create Post</CustomNavLink>}
                                {userData && userData.isAdmin && <CustomNavLink as={NavLink} to="users" >Users</CustomNavLink>}
                                <CustomNavLink as={NavLink} to={userPageLink} >User Page</CustomNavLink>
                            </Grid>

                        </Box>


                     
                            <Container m='0px'p='0px' mt='35px'>
                                <Header search={search} setSearch={setSearch} />
                                <Outlet />

                            </Container>
                    

                    </Grid>
                </div>
                :
                <div>
                    <div id='currentUsers-and-Post-content'>
                        <Container>

                            <h2 id='number-of-users'>Current users: <br /> 20,109</h2>
                            <h2 id='number-of-posts'>Posts:<br /> 40,290</h2>

                        </Container>
                    </div>
                    <div id='recents-and-popular-content'>

                        <Container>
                            <button onClick={() => setView('recents')}>Recents</button>
                            <button onClick={() => setView('popular')}>Popular</button>
                            {view === 'recents' && <Recents />}
                            {view === 'popular' && <Popular />}


                        </Container>
                    </div>
                </div>
            }

        </>
    )
}

Home.propTypes = {
    search: PropTypes.string,
    setSearch: PropTypes.func
}