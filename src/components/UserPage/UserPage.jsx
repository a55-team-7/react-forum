import { Box, Button, Flex, Heading, Image, Input, Text, Grid, useColorModeValue, VStack} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useParams } from "react-router-dom"
import './UserPage.css'
import { getUserByHandle, uploadProfilePictureByHandle, updateUserByHandle, unblockUser, blockUser, makeUserAdmin } from "../../services/users-service";
// import Button from "../Button/Button";
import Post from "../Post/Post";
import { getAllPosts } from "../../services/posts-service";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import { MAX_USER_NAME_LENGTH, MIN_USER_NAME_LENGTH } from "../../common/contants";
import { CustomNavLink } from "../ChakraUI/CustomNavLink";
import Logo from "../Logo/Logo";

export default function UserPage() {

    const color = useColorModeValue("brand.100", "brand.300");

    //update the local user 
    const [user, setUser] = useState(null);

    //updates of the posts 
    const [allPosts, setAllPosts] = useState([]);

    //profile pics updates
    const [profilePicture, setProfilePicture] = useState(null);
    const [yourOwnProfile, setYourOwnProfile] = useState(false);
    const [newPictureURL, setNewPictureURL] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [loadStatus, setLoadStatus] = useState(null);

    //user the data of our user
    const { userData } = useContext(AppContext);

    //updating the block status
    const [isBlocked, setIsBlocked] = useState(false);

    //taking the handle from the url to know which user we're looking at
    const { handle } = useParams();

    //update the edit view
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ firstName: '', lastName: '', email: '', isBlocked: false });
    //

    useEffect(() => {
        if (userData && userData.handle === handle) {
            setYourOwnProfile(true);
        }
        getUserByHandle(handle).then(user => {
            setUser(user);
            setIsBlocked(user.isBlocked !== undefined ? user.isBlocked : false); // set isBlocked based on the user's block status, or false if it's undefined
        });
    }, [handle, userData]);


    useEffect(() => {
        getAllPosts().then(setAllPosts);
    }, []); //removed allPosts as a dependencybecause it can cause infinite loop

    const updateProfilePicture = (event) => {
        setProfilePicture(event.target.files[0]);
        const url = URL.createObjectURL(event.target.files[0]);
        setNewPictureURL(url);
    }

    const uploadProfilePicture = async () => {
        if (profilePicture) {
            uploadProfilePictureByHandle(handle, profilePicture, setLoadStatus)
                .then(url => setImageURL(url))
                .then(setNewPictureURL(null));
        } else {
            alert('please upload a file');
        }
    }

    const userPosts = (user && allPosts) ? allPosts.filter(post => post.author === user.handle) : [];


    //here we start setting the values , enabling the edit mode
    const startEditing = () => {
        setUpdatedUser({ firstName: user.firstName, lastName: user.lastName, email: user.email, isBlocked: isBlocked });
        setIsEditing(true);
    }

    //here we update the user in the database
    const saveChanges = async () => {
        if (updatedUser.firstName.length < MIN_USER_NAME_LENGTH || updatedUser.firstName.length > MAX_USER_NAME_LENGTH) {
            alert(`Your first name should be between ${MIN_USER_NAME_LENGTH} and ${MAX_USER_NAME_LENGTH} symbols`);
            return;
        }
        if (updatedUser.lastName.length < MIN_USER_NAME_LENGTH || updatedUser.lastName.length > MAX_USER_NAME_LENGTH) {
            alert(`Your last name should be between ${MIN_USER_NAME_LENGTH} and ${MAX_USER_NAME_LENGTH} symbols`);
            return;
        }
        await updateUserByHandle(handle, updatedUser);
        setIsEditing(false);
        getUserByHandle(handle).then(setUser);
    }

    const toggleBlockUser = async () => {
        if (isBlocked) {
            await unblockUser(user.handle);
        } else {
            await blockUser(user.handle);
        }
        setIsBlocked(!isBlocked);
        getUserByHandle(handle).then(user => {
            if (user.isBlocked === undefined) {
                user.isBlocked = false;
            }
            setUser(user);
            setIsBlocked(user.isBlocked);
        });
    };

    const giveAdminRights = async () => {
        await makeUserAdmin(handle);
        getUserByHandle(handle).then(setUser);
    }



    return (
        <Box id='user-page'>
            {user ? (
                <>
                    <Grid gridTemplateColumns='1fr 6fr' gridGap='0px' >

                        <Box bg={color} >

                            <Grid justifyContent='space-around' justifyItems='start' gridTemplateColumns='auto' mt='20px' gridGap='10px' w='200px' ml='0px' mr='50px' position='static'>
                                <CustomNavLink to="/home">
                                    <Box width="150px" height="50px" >
                                        <Logo />
                                    </Box>
                                </CustomNavLink>
                                {(location.pathname !== '/home/my-posts' && location.pathname !== '/home') && <CustomNavLink to="/home/my-posts">My Feed</CustomNavLink>}
                                <CustomNavLink to="/home/recents">Recents</CustomNavLink>
                                <CustomNavLink to="/home/popular">Popular</CustomNavLink>
                                {userData && !userData.isBlocked && <CustomNavLink to="/home/create-post">Create Post</CustomNavLink>}
                                {userData && userData.isAdmin && <CustomNavLink to="/home/users">Users</CustomNavLink>}
                            </Grid>

                        </Box>

                        <Box ml={8} my={8} >
                            <Heading as="h2">User: {user.handle}</Heading>
                            <Heading as="h3" mt={2} size="md">Email: {user.email}</Heading>
                            <Flex mt={5} direction="row" alignItems="start">
                                <ProfilePicture handle={handle} src={imageURL} type='userPage' />
                                {isEditing ? (
                                    <Flex ml={4} mt={3} direction="column" maxWidth="200px">
                                        <Input value={updatedUser.firstName} onChange={e => setUpdatedUser({ ...updatedUser, firstName: e.target.value })} placeholder="First Name" />
                                        <Input mt={2} value={updatedUser.lastName} onChange={e => setUpdatedUser({ ...updatedUser, lastName: e.target.value })} placeholder="Last Name" />
                                        <Button onClick={saveChanges} colorScheme="orange" mt={2}>Save</Button>
                                    </Flex>
                                ) :
                                    <Box ml={4}>
                                        <Heading as="h3" mt={2} size="md">Name:</Heading>
                                        <Heading as="h3" mt={2} mb={1} size="md">{user.firstName} {user.lastName}</Heading>
                                        {yourOwnProfile && !isEditing && <Button mt={10} onClick={startEditing} colorScheme="orange" >Edit</Button>}
                                    </Box>
                                }
                            </Flex>

                            {userData && userData.isAdmin && userData.handle !== handle && !user.isAdmin &&
                                <Button onClick={toggleBlockUser} colorScheme="red" mt={4}>{isBlocked ? 'Unblock user' : 'Block user'}</Button>
                            }
                            {userData && userData.isAdmin && userData.handle !== handle && !user.isAdmin &&
                                <Button onClick={giveAdminRights} colorScheme="green" mt={4}>Make admin</Button>
                            }

                            {yourOwnProfile && (
                                <Flex id='upload-picture' mt={4} direction="row" alignItems="center">
                                    <Box ml={4}>
                                        <VStack spacing={2}>
                                            <Input id="upload-picture-input" type="file" onChange={updateProfilePicture} accept=".jpg, .jpeg, .png" style={{ display: 'none' }} />
                                            <Button onClick={() => document.getElementById('upload-picture-input').click()} colorScheme="orange">Choose File</Button>
                                            {loadStatus && <Text>{loadStatus}</Text>}
                                            <Button id='upload-profile-picture-button' onClick={uploadProfilePicture} colorScheme="orange" >Change Picture</Button>
                                        </VStack>
                                    </Box>
                                    {newPictureURL && <Image ml={3} my={2} src={newPictureURL} id='profile-picture-preview' alt="Preview" boxSize="100px" />}
                                </Flex>
                            )}

                            <Heading as="h2" size="lg" my={4}>Posts by {user.handle}:</Heading>
                            {userPosts.length ? userPosts.map((post, index) => <Post key={index} post={post} postType='profilePagePosts' />) : <Text>{user.handle} has no posts</Text>}
                        </Box>

                    </Grid>
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </Box>
    )
}    