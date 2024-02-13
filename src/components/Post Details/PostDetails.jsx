import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom"
import './PostDetails.css'
import { commentPost, getPostById } from "../../services/posts-service";
import Comment from "../Comment/Comment";
import Button from "../Button/Button";
import AppContext from "../../context/AppContext";

export default function PostDetails() {
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const { id } = useParams();
    const { user, userData } = useContext(AppContext);

    useEffect(() => {
        getPostById(id).then(setPost);
    }, [id]);

    // const toggleLike = async () => {
    //     if (post.likedBy.includes(userData.handle)) {
    //       dislikePost(userData.handle, post.id);
    //     } else {
    //       likePost(userData.handle, post.id);
    //     }
    //     togglePostLike(userData.handle, post.id);
    //   };

    const postComment = async () => {
        if (!commentText) {
            alert('write something down to comment');
        }

        await commentPost(id, userData.handle, commentText);
        getPostById(id).then(setPost);
        setCommentText('');
    }

    return (
        <div id='post-details'>
            {(post && userData)  ? (
                <>
                    <h2>{post.title}</h2>
                    <p>by {post.author} on {new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
                    <p>{post.content}</p>
                    <Button onClick>{post.likedBy.includes(userData.handle) ? 'Dislike' : 'Like'}</Button>
                    <h3>Comments:</h3>
                    {post.comments ? Object.values(post.comments).map((comment, index) => (
                        <Comment key={index} comment={comment} />
                    )) : <h3>post has no comments</h3>}
                    <label htmlFor="comment-text">Comment:</label>
                    <br />
                    <textarea value={commentText} onChange={e => setCommentText(e.target.value)} name="comment-text" id="comment-text" cols="40" rows="10"></textarea>
                    <Button onClick={postComment} id='post-comment-button'>Post</Button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )    
}