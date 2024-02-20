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
import Logo from '../Logo/Logo'

export default function Home({ search, setSearch }) {

    const { user, userData } = useContext(AppContext);
    const [view, setView] = useState('home');
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false); // New state for hover

    let userPageLink = '/users/';
    if (userData) {
        userPageLink += userData.handle;
    }

    const color = useColorModeValue("brand.100", "brand.300");

    return (
        <>
            {user ?
                <div>
                    <Grid gridTemplateColumns='1fr 6fr' gridGap='0px' style={{ height: '100vh' }}   >
                        
                        <Box
                           
                            //borderColor={color}
                            bg={color}
                            borderRadius="10px"
                            position='fixed'
                            ml='10px'
                            mt='2px'
                            h='737px'
                            w='210px'
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <Grid justifyContent='space-around' justifyItems='start' gridTemplateColumns='auto' w='200px' position='static'>
                                <CustomNavLink to="/home">
                                    <Box width="150px" height="40px" ml='50px'>
                                        <Logo />
                                    </Box>
                                </CustomNavLink>
                                <Grid gap={2} justifyContent='space-around' justifyItems='start' gridTemplateColumns='auto' mt='20px' w='200px' mr='50px' position='static'>
                                    {(location.pathname !== '/home/my-posts' && location.pathname !== '/home') && <CustomNavLink to="/home/my-posts">My Feed</CustomNavLink>}
                                    <CustomNavLink to="/home/recents">Recents</CustomNavLink>
                                    <CustomNavLink to="/home/popular">Popular</CustomNavLink>
                                    {userData && !userData.isBlocked && <CustomNavLink to="/home/create-post">Create Post</CustomNavLink>}
                                    {userData && userData.isAdmin && <CustomNavLink to="/home/users">Users</CustomNavLink>}
                                    <CustomNavLink to={userPageLink}>User Page</CustomNavLink>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box ml='240px' > {/* Adjust margin based on hover state */}
                            {(location.pathname === '/home/my-posts') && <Header search={search} setSearch={setSearch} placeholder='find a topic...' />}
                            {(location.pathname === '/home/users') && <Header search={search} setSearch={setSearch} placeholder='find a user...' />}
                            {(location.pathname !== '/home/my-posts') && (location.pathname !== '/home/users') && <Header/>}
                            <Box
                                className='outlet-container'
                                mb='30px'
                                p='0px'
                                maxW="1200px"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                flexDirection="column"
                                position="static"
                                ml='30px'
                            >
                                <Outlet style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                            </Box>
                        </Box>

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