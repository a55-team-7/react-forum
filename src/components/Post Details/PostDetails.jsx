import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"
import './PostDetails.css'
import { commentPost, deletePost, getPostById, updatePostById } from "../../services/posts-service";
import Comment from "../Comment/Comment";
import Button from "../Button/Button";
import AppContext from "../../context/AppContext";
import { dislikePost, likePost } from "../../services/posts-service";
import { getUserByHandle } from "../../services/users-service";
import { MAX_POST_CONTENT_LENGTH, MAX_POST_TITLE_LENGTH, MIN_POST_CONTENT_LENGTH, MIN_POST_TITLE_LENGTH } from "../../common/contants";

export default function PostDetails() {
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const { id } = useParams();
    const { userData } = useContext(AppContext);
    const [showOptions, setShowOptions] = useState(false);
    const [author, setAuthor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedPost, setUpdatedPost] = useState({ title: '', content: '' });
    const [commentsUpdated, setCommentsUpdated] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            const post = await getPostById(id)
            if (post) {
                setPost(post);
                setCommentsUpdated(false);
            }
        }
        fetchPost();
    }, [id, commentsUpdated]);

    useEffect(() => {
        if (post) {
            getUserByHandle(post.author).then(setAuthor);
        }
    }, [post]);

    const togglePostLike = async () => {
        const post = await getPostById(id)
        if (post) {
            setPost(post);
        }
        if (post.likedBy.includes(userData.handle)) {
            await dislikePost(userData.handle, post.id);
            setPost((prevPost) => {
                return {
                    ...prevPost,
                    likedBy: prevPost.likedBy.filter((handle) => handle !== userData.handle)
                }

            })
        } else {
            await likePost(userData.handle, post.id);
            setPost((prevPost) => {
                return {
                    ...prevPost,
                    likedBy: [...prevPost.likedBy, userData.handle]
                }

            })
        }
    };

    const postComment = async () => {
        if (!commentText) {
            alert('write something down to comment');
            return;
        }

        await commentPost(id, userData.handle, commentText);
        const post = await getPostById(id)
        if (post) {
            setPost(post);
        }
        setCommentText('');
    }

    const toggleAuthorOptions = () => {
        setShowOptions(!showOptions);
    }

    const postDeletion = async () => {
        await deletePost(post.id);
        setPost(null);
        navigate(-1);
    }

    const startEditing = () => {
        setUpdatedPost({ title: post.title, content: post.content });
        setIsEditing(true);
    }

    const saveChanges = async () => {
        if (updatedPost.title.length < MIN_POST_TITLE_LENGTH || updatedPost.title.length > MAX_POST_TITLE_LENGTH) {
            alert(`Post title should be between ${MIN_POST_TITLE_LENGTH} and ${MAX_POST_TITLE_LENGTH} symbols`);
            return;
        }
        if (updatedPost.content.length < MIN_POST_CONTENT_LENGTH || updatedPost.content.length > MAX_POST_CONTENT_LENGTH) {
            alert(`Post content should be between ${MIN_POST_TITLE_LENGTH} and ${MAX_POST_TITLE_LENGTH} symbols`);
            return;
        }

        await updatePostById(post.id, updatedPost);
        setIsEditing(false);
        getPostById(id).then(setPost);
    }

    const handleAddComment = (event) => {
        setCommentText(event.target.value);
    }


    return (
        <div id='post-details'>
            {(post && userData && author) ? (
                <>
                    <Button onClick={() => navigate(-1)}>Back</Button>
                    {(userData.handle === post.author || (userData.isAdmin && !author.isAdmin)) && <Button onClick={toggleAuthorOptions}>options</Button>}

                    {showOptions && (
                        <>
                            {<Button onClick={postDeletion}>Delete Post</Button>}

                            {isEditing ? (
                                <>
                                    <label htmlFor="edit-title">Title:</label>
                                    <input value={updatedPost.title} onChange={e => setUpdatedPost({ ...updatedPost, title: e.target.value })} type="text" name="edit-title" id="edit-title" /><br />
                                    <label htmlFor="edit-content">Content:</label><br />
                                    <textarea value={updatedPost.content} onChange={e => setUpdatedPost({ ...updatedPost, content: e.target.value })} name="edit-content" id="edit-content" cols="30" rows="10"></textarea><br />

                                    <Button onClick={saveChanges}>Save</Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={startEditing}>Edit Post</Button>
                                </>
                            )}
                        </>

                    )}

                    <h2>Title:</h2>
                    <h2>{post.title}</h2>
                    <p>by {post.author} on {new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
                    <p>{post.content}</p>
                    <Button onClick={togglePostLike}>{post.likedBy.includes(userData.handle) ? 'Dislike' : 'Like'}</Button>

                    {(userData && userData.isBlocked) ?
                        (<h4>Comment section currently not available! Talk to an admin for more information.</h4>)
                        :
                        <>
                            <h3>Comments:</h3>
                            {post.comments ? Object.entries(post.comments).map(([commentId, comment]) => (
                                <div key={commentId} className="post-comment">
                                    <Comment comment={comment} postId={post.id} commentId={commentId} setCommentsUpdated={setCommentsUpdated} />
                                </div>
                            )) : <h3>post has no comments</h3>}
                            <label htmlFor="comment-text">Comment:</label>
                            <br />
                            <textarea value={commentText} onChange={handleAddComment} name="comment-text" id="comment-text" cols="40" rows="10"></textarea>
                            <Button onClick={postComment} id='post-comment-button'>Post</Button>
                            <div id="post-tags-wrapper">
                                <h3>Tags:</h3>
                                <div id="post-tags">{post && post.tags ? post.tags.map((tag, index) => (
                                    <span key={`${index}-${tag}`}>{tag}</span>
                                )) : []}</div>
                            </div>
                        </>
                    }

                </>
            ) : (
                <p>Loading...</p>
            )}

        </div>
    )
}