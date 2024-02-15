import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import './UserPage.css'
import { getUserByHandle, uploadProfilePictureByHandle } from "../../services/users-service";
import Button from "../Button/Button";
import Post from "../Post/Post";
import { getAllPost } from "../../services/posts-service";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

//import uplaod profile picture

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const { handle } = useParams();

    useEffect(() => {
        getUserByHandle(handle).then(setUser);
    }, [handle]);

    useEffect(() => {
        getAllPost().then(setAllPosts);
    }, []);

    const updateProfilePicture = (event) => {
        setProfilePicture(event.target.files[0]);
    }

    const uploadProfilePicture = () => {
        if (profilePicture) {
            uploadProfilePictureByHandle(handle, profilePicture);
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
                    <h3>Name: {user.firstName} {user.lastName}</h3>
                    <h3>Email: {user.email}</h3>
                    <ProfilePicture handle={handle}/>
                    <input id="upload-picture" type="file" onChange={updateProfilePicture} accept=".jpg, .jpeg, .png"/>
                    <Button id='upload-profile-picture-button' onClick={uploadProfilePicture}>Change Profile Picture</Button>
                    <h2>Posts by {user.handle}:</h2>
                    {userPosts.length ? userPosts.map((post, index) => <Post key={index} post={post} />) : <p>{user.handle} has no posts</p>}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}