import { useEffect, useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useParams } from "react-router-dom"
import './UserPage.css'
import { getUserByHandle, uploadProfilePictureByHandle, updateUserByHandle, unblockUser, blockUser, makeUserAdmin } from "../../services/users-service";
import Button from "../Button/Button";
import Post from "../Post/Post";
import { getAllPost } from "../../services/posts-service";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

export default function UserPage() {

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
        getUserByHandle(handle).then(setUser);
    }, [handle, userData]);

    useEffect(() => {
        getAllPost().then(setAllPosts);
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
        setUpdatedUser({ firstName: user.firstName, lastName: user.lastName, email: user.email });
        setIsEditing(true);
    }

    //here we update the user in the database
    const saveChanges = async () => {
        await updateUserByHandle(handle, updatedUser);
        setIsEditing(false);
        getUserByHandle(handle).then(setUser);
    }
    
    const toggleBlockUser = async () => {
        if (isBlocked) {
            await unblockUser(user.uid);
        } else {
            await blockUser(user.uid);
        }
        setIsBlocked(!isBlocked);
        getUserByHandle(handle).then(setUser);
    };

    const giveAdminRights = async () => {
        await makeUserAdmin(handle);
        getUserByHandle(handle).then(setUser);
    }

    return (
        <div id='user-page'>
            {(user) ? (
                <>
                    <h2>User: {user.handle}</h2>
                    <ProfilePicture handle={handle} src={imageURL} />
                    <h3>Name: {user.firstName} {user.lastName}</h3>
                    <h3>Email: {user.email}</h3>

                    {/*if profile is his own*/}
                    {isEditing ? (
                        <>
                            <input value={updatedUser.firstName} onChange={e => setUpdatedUser({ ...updatedUser, firstName: e.target.value })} />
                            <input value={updatedUser.lastName} onChange={e => setUpdatedUser({ ...updatedUser, lastName: e.target.value })} />
                            <input value={updatedUser.email} onChange={e => setUpdatedUser({ ...updatedUser, email: e.target.value })} />
                            <Button onClick={saveChanges}>Save</Button>
                        </>
                    ) : (
                        <>
                            <h3>Name: {user.firstName} {user.lastName}</h3>
                            <h3>Email: {user.email}</h3>

                            {/*if profile is  his own*/}
                            {yourOwnProfile && <Button onClick={startEditing}>Edit</Button>}
                        </>
                    )}

                    {/*if the user is an admin and the profile is not his own*/}
                    {userData && userData.isAdmin &&  userData.handle !== handle && !user.isAdmin && <Button onClick={toggleBlockUser}>{isBlocked ? 'Unblock user' : 'Block user'}</Button>}
                    {userData && userData.isAdmin &&  userData.handle !== handle && !user.isAdmin && <Button onClick={giveAdminRights}>Make admin</Button>}

                    {yourOwnProfile && (
                        <div id='upload-picture'>
                            {newPictureURL && <img src={newPictureURL} id='profile-picture-preview' alt="Preview" width='100' height='100' />}
                            <input id="upload-picture-input" type="file" onChange={updateProfilePicture} accept=".jpg, .jpeg, .png" />
                            {loadStatus && <p>{loadStatus}</p>}
                            <Button id='upload-profile-picture-button' onClick={uploadProfilePicture}>Change Profile Picture</Button>
                        </div>
                    )}
                    <h2>Posts by {user.handle}:</h2>
                    {userPosts.length ? userPosts.map((post, index) => <Post key={index} post={post} postType='profilePagePosts' />) : <p>{user.handle} has no posts</p>}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}