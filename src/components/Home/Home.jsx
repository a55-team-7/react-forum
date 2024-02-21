import { Box, Heading, Text, VStack, Flex } from "@chakra-ui/react";
import { useContext, useEffect, useState } from 'react'
import Popular from '../Popular/Popular'
import Recents from '../Recents/Recents'
import './Home.css'
import AppContext from '../../context/AppContext'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button, Container, Grid } from '@chakra-ui/react'
import Header from '../Header/Header'
import PropTypes from 'prop-types'
import { CustomNavLink } from '../ChakraUI/CustomNavLink'
import Logo from '../Logo/Logo'
import { getAllPosts } from '../../services/posts-service'
import { getAllUsers } from '../../services/users-service'
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import CountUp from 'react-countup';
import { ButtonGroup } from '@chakra-ui/react'

export default function Home({ search, setSearch }) {

    const { user, userData } = useContext(AppContext);
    const [view, setView] = useState('recents');
    const location = useLocation();
    const [allPosts, setAllPosts] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    let userPageLink = '/home/users/';
    if (userData) {
        userPageLink += userData.handle;
    }

    useEffect(() => {
        getAllPosts().then(setAllPosts);
        getAllUsers().then(setAllUsers);
    }, []);

    //setView('recents');

    return (
        <>
            {user && userData ?
                <div>
                    <Grid gridTemplateColumns='1fr 6fr' gridGap='0px' style={{ height: '100vh' }}   >

                        <Box
                            style={{
                                background: 'linear-gradient(to left bottom, blue, #98ff98)',
                                border: '1px solid',
                                borderRadius: "20px",


                            }}
                            position='fixed'
                            h='720px'
                            ml='10px'
                            w='210px'
                            mt='10px'

                        >  <CustomNavLink to="/home">
                                <Box width="150px" height="40px" ml='20px'>
                                    <Logo />
                                </Box>
                            </CustomNavLink>


                            <Grid gap={4} justifyContent='space-around' justifyItems='start' gridTemplateColumns='auto' mt='50px' w='100px' mr='50px' ml='30px' position='static'>
                                {(location.pathname !== '/home/my-posts' && location.pathname !== '/home') ? <CustomNavLink to="/home/my-posts">My Feed</CustomNavLink> : <Box h='25px' />}
                                <CustomNavLink to="/home/recents">Recents</CustomNavLink>
                                <CustomNavLink to="/home/popular">Popular</CustomNavLink>
                                {userData && !userData.isBlocked && <CustomNavLink to="/home/create-post">Create Post</CustomNavLink>}
                                {userData && userData.isAdmin && <CustomNavLink to="/home/users">Users</CustomNavLink>}

                            </Grid>

                            <Box mt='380px' ml='30px' >
                                <Flex direction="row" align="center">
                                    <Text fontSize="sm" color="red" fontWeight="700" mr={3}>{userData.handle}@</Text>
                                    <Link to={userPageLink}>
                                        <ProfilePicture handle={userData.handle} type={'users'} />
                                    </Link>
                                </Flex>
                            </Box>

                        </Box>

                        <Box ml='240px' > {/* Adjust margin based on hover state */}
                            {(location.pathname === '/home/my-posts') && <Header search={search} setSearch={setSearch} placeholder='find a topic...' />}
                            {(location.pathname === '/home/users') && <Header search={search} setSearch={setSearch} placeholder='find a user...' />}
                            {(location.pathname !== '/home/my-posts') && (location.pathname !== '/home/users') && <Header />}
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
                </div >
                :

                <Flex
                    flexDirection="column"
                    align="center"
                    spacing={10}
                    style={{
                        background: 'linear-gradient(to right, blue, #ffc837)',
                        minHeight: '100vh'
                    }}
                >

                    <Flex justifyContent="space-between" mt={5} width="90%" ml='30px'>
                        <Box width="150px" height="40px">
                            <Logo />
                        </Box>
                        <Flex>
                            <Link to="/register">
                                <Button border="1px" bg='blue' color="red" w="80px" ml='50px'>Register</Button>
                            </Link>
                            <Link to="/login">
                                <Button border="1px" bg='blue' color="yellow" w="80px" ml='50px' >Login</Button>
                            </Link>
                        </Flex>
                    </Flex>

                    <Grid id='currentUsers-and-Post-content' gridTemplateColumns='2fr 2fr' alignItems="center" mb={5} pl='200px' mt='20px' mb='50px'>
                        <Text fontSize="100px" fontWeight="700" color="white" >Welcome to  ReadIT!</Text>

                        <Grid id='currentUsers-and-Post-content' gridTemplateRows='1fr 1fr' align="center" alignItems='center'>
                            <Box mr={15} p={4}>
                                <Flex direction="row" alignItems="center">
                                    <Text fontSize="45px" color='white' mr={10} fontWeight='700'>Current Users:</Text>
                                    <CountUp start={0} end={allUsers.length} duration={2.75}>
                                        {({ countUpRef }) => (
                                            <Text fontSize="60px" color='white' fontWeight='700' ref={countUpRef} />
                                        )}
                                    </CountUp>
                                </Flex>
                            </Box>

                            <Box p={4} mr={15}>
                                < Flex direction="row" alignItems="center">
                                    <Text fontSize="45px" color='white' mr={10} fontWeight='700'>Posts:</Text>
                                    <CountUp start={0} end={allPosts.length} duration={2.75}>
                                        {({ countUpRef }) => (
                                            <Text color='white' fontSize="60px" fontWeight='700' ref={countUpRef} />
                                        )}
                                    </CountUp>
                                </Flex>
                            </Box>
                        </Grid>
                        <Text fontSize="30px" fontWeight="700" color="white" >The best place to share your technical talents and problems with the world!</Text>
                    </Grid>


                    <Box>
                        <ButtonGroup variant="outline" spacing="6">
                            <Button onClick={() => setView('recents')} size="lg" mb={3} isActive={view === 'recents'}>Recents</Button>
                            <Button onClick={() => setView('popular')} size="lg" mb={3} isActive={view === 'popular'}>Popular</Button>
                        </ButtonGroup>

                        {view === 'recents' && <Recents />}
                        {view === 'popular' && <Popular />}
                    </Box>




                </Flex>
            }
        </>
    )
}

Home.propTypes = {
    search: PropTypes.string,
    setSearch: PropTypes.func
}