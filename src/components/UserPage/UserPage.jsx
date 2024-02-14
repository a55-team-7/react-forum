import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import './UserPage.css'
import { getUserByHandle } from "../../services/users-service";
import Button from "../Button/Button";
import Post from "../Post/Post";
import { getAllPost } from "../../services/posts-service";

//import uplaod profile picture

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const { handle } = useParams();

    useEffect(() => {
        getUserByHandle(handle).then(setUser);
    }, [handle]);

    useEffect(() => {
        getAllPost().then(setAllPosts);
    }, []);

    const userPosts = (user && allPosts) ? allPosts.filter(post => post.author === user.handle) : [];

    return (
        <div id='user-page'>
            {(user) ? (
                <>

                    <h2>User: {user.handle}</h2>
                    <h3>Name: {user.firstName} {user.lastName}</h3>
                    <h3>Email: {user.email}</h3>
                    {user.profilePicture ? user.profilePicture : <Button id='upload-profile-picture-button' onClick>Upload Profile Picture</Button>}
                    <h2>Posts by {user.handle}:</h2>
                    {userPosts.length ? userPosts.map((post, index) => <Post key={index} post={post} />) : <p>{user.handle} has no posts</p>}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}