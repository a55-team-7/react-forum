import { Box, Button, Flex, Heading, Image, Input, Text, extendTheme } from "@chakra-ui/react";
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

export default function UserPage() {
    const { colors, fonts } = extendTheme;
    // const buttonColor = colors.brand[300];

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
        <Box id='user-page' p={5} minHeight="100vh">
            {user ? (
                <>
                    <Heading as="h2">User: {user.handle}</Heading>
                    <Flex mt={2} direction="row" alignItems="start">
                        <ProfilePicture handle={handle} src={imageURL} type='userPage' />
                        <Box ml={4}>
                            <Heading as="h3" mt={2} size="md">Name: {user.firstName} {user.lastName}</Heading>
                            <Heading as="h3" mt={2} size="md">Email: {user.email}</Heading>
                            {yourOwnProfile && !isEditing && <Button onClick={startEditing} colorScheme="orange" mt={2}>Edit</Button>}
                        </Box>
                    </Flex>

                    {isEditing ? (
                        <Flex mt={3} direction="column" maxWidth="200px">
                            <Input value={updatedUser.firstName} onChange={e => setUpdatedUser({ ...updatedUser, firstName: e.target.value })} placeholder="First Name" />
                            <Input value={updatedUser.lastName} onChange={e => setUpdatedUser({ ...updatedUser, lastName: e.target.value })} placeholder="Last Name" />
                            <Button onClick={saveChanges} colorScheme='orange' mt={4}>Save</Button>
                        </Flex>
                    ) : null}

                    {userData && userData.isAdmin && userData.handle !== handle && !user.isAdmin &&
                        <Button onClick={toggleBlockUser} colorScheme="red" mt={4}>{isBlocked ? 'Unblock user' : 'Block user'}</Button>
                    }
                    {userData && userData.isAdmin && userData.handle !== handle && !user.isAdmin &&
                        <Button onClick={giveAdminRights} colorScheme="green" mt={4}>Make admin</Button>
                    }

                    {yourOwnProfile && (
                        <Box id='upload-picture' mt={4}>
                            {newPictureURL && <Image my = {3} src={newPictureURL} id='profile-picture-preview' alt="Preview" boxSize="100px" />}
                            <Input id="upload-picture-input" type="file" onChange={updateProfilePicture} accept=".jpg, .jpeg, .png" style={{ border: 'none' }} />
                            {loadStatus && <Text>{loadStatus}</Text>}
                            <Button id='upload-profile-picture-button' onClick={uploadProfilePicture} colorScheme="orange" mt={4}>Change Profile Picture</Button>
                        </Box>
                    )}
                    <Heading as="h2" size="lg" my={4}>Posts by {user.handle}:</Heading>
                    {userPosts.length ? userPosts.map((post, index) => <Post key={index} post={post} postType='profilePagePosts' />) : <Text>{user.handle} has no posts</Text>}
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </Box>
    )
}    