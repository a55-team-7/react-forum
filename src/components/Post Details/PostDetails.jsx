import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"
import './PostDetails.css'
import { commentPost, deletePost, getPostById } from "../../services/posts-service";
import Comment from "../Comment/Comment";
import Button from "../Button/Button";
import AppContext from "../../context/AppContext";
import { dislikePost, likePost } from "../../services/posts-service";
import { getUserByHandle } from "../../services/users-service";

export default function PostDetails() {
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const { id } = useParams();
    const { userData } = useContext(AppContext);
    const [showOptions, setShowOptions] = useState(false);
    const [author, setAuthor] = useState(null);
    

    const navigate = useNavigate();

    useEffect(() => {
        getPostById(id).then(setPost);
    }, [id]);

    useEffect(() => {
        if (post) {
            getUserByHandle(post.author).then(setAuthor);
        }
    }, [post]);

    const togglePostLike = async () => {
        if (post.likedBy.includes(userData.handle)) {
            await dislikePost(userData.handle, post.id);
        } else {
            await likePost(userData.handle, post.id);
        }
        getPostById(id).then(setPost);
    };

    const postComment = async () => {
        if (!commentText) {
            alert('write something down to comment');
        }

        await commentPost(id, userData.handle, commentText);
        getPostById(id).then(setPost);
        setCommentText('');
    }

    const toggleAuthorOptions = () => {
        setShowOptions(!showOptions);
    }

    const postDeletion = async () => {
        await deletePost(post.id);
        setPost(null);
        navigate('/home/my-posts');
    }


    return (
        <div id='post-details'>
            {(post && userData && author) ? (
                <>
                    { (!author.isAdmin && (post.author === userData.handle || userData.isAdmin)) 
                    ||  (post.author === userData.handle) 
                    &&  <Button onClick={toggleAuthorOptions}>options</Button>
                    }

                    {showOptions &&  (
                        <>
                            <Button onClick={() => console.log('edit')}>Edit</Button>
                            <Button onClick={postDeletion}>Delete post</Button>
                        </>
                    )}

                    <h2>{post.title}</h2>
                    <p>by {post.author} on {new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
                    <p>{post.content}</p>
                    <Button onClick={togglePostLike}>{post.likedBy.includes(userData.handle) ? 'Dislike' : 'Like'}</Button>
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