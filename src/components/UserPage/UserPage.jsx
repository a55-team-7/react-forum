import { Box, Button, Flex, Heading, Image, Input, Text, Grid, useColorModeValue, VStack } from "@chakra-ui/react";
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
import { Spinner } from "@chakra-ui/react";
import { MdDriveFolderUpload } from "react-icons/md";
import { CiSaveUp1, CiEdit } from "react-icons/ci";

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


    const colors = ['rgb(255, 25, 52)', 'rgb(255, 0, 54)', 'rgb(128, 0, 128)', 'rgb(204, 204, 0)', 'rgb(0, 153, 0)'];

    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <Box borderRadius="md" boxShadow="1g" w="1200px" >
            {user ? (
                <>
                    <Box ml={8} my={8} alignItems="start" >
                        <Flex mt={5} direction="row" alignItems="start" >
                            <ProfilePicture handle={handle} src={imageURL} type='userPage' />
                            {user.isAdmin && <Text color="green" fontWeight="700" >Admin</Text>}
                            <Box ml={4}>
                                {isEditing ? (
                                    <Flex mt={3} direction="column" maxWidth="200px">
                                        <Input value={updatedUser.firstName} onChange={e => setUpdatedUser({ ...updatedUser, firstName: e.target.value })} placeholder="First Name" />
                                        <Input mt={2} value={updatedUser.lastName} onChange={e => setUpdatedUser({ ...updatedUser, lastName: e.target.value })} placeholder="Last Name" />
                                        <Button onClick={saveChanges} colorScheme="blue" mt={2}>Save</Button>
                                    </Flex>
                                ) :
                                    <Flex direction="column" alignItems="start">
                                        <Heading as="h2" ><Text color={getRandomColor()}>@{user.handle}</Text></Heading>
                                        <Flex direction="row" alignItems="center">
                                            <Text mt={2} mb={1} size="md" fontWeight="700" >Email: {user.email}</Text>
                                            {yourOwnProfile && !isEditing && <CiEdit ml={2} onClick={startEditing} colorScheme="orange" />}
                                        </Flex>
                                        <Flex direction="row" alignItems="center">
                                            <Text as="h3" mt={2} mb={1} size="md">Name: {user.firstName} {user.lastName}</Text>
                                            {yourOwnProfile && !isEditing && <CiEdit ml={2} onClick={startEditing} colorScheme="orange" />}

                                        </Flex>
                                    </Flex>
                                }
                            </Box>
                            {yourOwnProfile && (
                                <Flex id='upload-picture' mt={4} direction="row" alignItems="center">
                                    <Box ml={4}>
                                        <VStack spacing={2}>
                                            <Input id="upload-picture-input" type="file" onChange={updateProfilePicture} accept=".jpg, .jpeg, .png" style={{ display: 'none' }} />
                                            <Flex direction="row" alignItems="center">
                                                <MdDriveFolderUpload size="1.5em" onClick={() => document.getElementById('upload-picture-input').click()} colorScheme="orange" />
                                                {loadStatus && <Text>{loadStatus}</Text>}
                                                <CiSaveUp1 size="1.5em" id='upload-profile-picture-button' onClick={uploadProfilePicture} colorScheme="orange" />
                                            </Flex>
                                        </VStack>
                                    </Box>
                                    {newPictureURL && <Image ml={3} my={2} src={newPictureURL} id='profile-picture-preview' alt="Preview" boxSize="100px" />}
                                </Flex>
                            )}
                            {userData && userData.isAdmin && userData.handle !== handle && !user.isAdmin &&
                                <VStack spacing={4} ml='650px' alignItems='flex-end'>
                                    <Button onClick={toggleBlockUser} colorScheme="red">{isBlocked ? 'Unblock user' : 'Block user'}</Button>
                                    <Button onClick={giveAdminRights} colorScheme="green">Make admin</Button>
                                </VStack>
                            }
                        </Flex>
                        <Box width="900px" >
                            <Heading as="h2" size="lg" my={4}>Posts by {user.handle}:</Heading>

                            {userPosts.length ? userPosts.map((post, index) =>
                                <Box key={index} mt={5}  border='1px solid gray 'borderRadius='10px'>
                                    <Box p={4} >
                                    <Post key={index} post={post} postType='profilePagePosts' />
                                    </Box>
                                </Box>)
                                : <Text>{user.handle} has no posts</Text>}

                        </Box>
                    </Box>
                </>
            ) : (
                <Spinner />
            )}
        </Box>
    )
}    