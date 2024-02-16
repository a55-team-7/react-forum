import { useEffect, useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useParams } from "react-router-dom"
import './UserPage.css'
import { getUserByHandle, uploadProfilePictureByHandle } from "../../services/users-service";
import Button from "../Button/Button";
import Post from "../Post/Post";
import { getAllPost } from "../../services/posts-service";
import ProfilePicture from "../ProfilePicture/ProfilePicture";


export default function UserPage() {
    const [user, setUser] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const [yourOwnProfile, setYourOwnProfile] = useState(false);
    const [newPictureURL, setNewPictureURL] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [loadStatus, setLoadStatus] = useState(null);
    const { userData } = useContext(AppContext);
    const { handle } = useParams();


    useEffect(() => {
        if (userData && userData.handle === handle) {
            setYourOwnProfile(true);
        }
        getUserByHandle(handle).then(setUser);
    }, [handle, userData]);

    useEffect(() => {
        getAllPost().then(setAllPosts);
    }, [allPosts]);

    const updateProfilePicture = (event) => {
        setProfilePicture(event.target.files[0]);
        const url = URL.createObjectURL(event.target.files[0]);
        setNewPictureURL(url);
    }

    const uploadProfilePicture = () => {
        if (profilePicture) {
            uploadProfilePictureByHandle(handle, profilePicture, setLoadStatus)
                .then(url => setImageURL(url))
                .then(setNewPictureURL(null));
        } else {
            alert('please upload a file');
        }
    }

    const userPosts = (user && allPosts) ? allPosts.filter(post => post.author === user.handle) : [];

    return (
        <div id='user-page'>
            {(user) ? (
                <>

                    <h2>User: {user.handle}</h2>
                    <ProfilePicture handle={handle} src={imageURL} />
                    <h3>Name: {user.firstName} {user.lastName}</h3>
                    <h3>Email: {user.email}</h3>
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