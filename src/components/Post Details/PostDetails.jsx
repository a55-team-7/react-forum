import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Grid, Text, Textarea, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"
import './PostDetails.css'
import { commentPost, deletePost, getPostById, updatePostById } from "../../services/posts-service";
import Comment from "../Comment/Comment";
// import Button from "../Button/Button";
import AppContext from "../../context/AppContext";
import { dislikePost, likePost } from "../../services/posts-service";
import { getUserByHandle } from "../../services/users-service";
import { MAX_POST_CONTENT_LENGTH, MAX_POST_TITLE_LENGTH, MIN_POST_CONTENT_LENGTH, MIN_POST_TITLE_LENGTH } from "../../common/contants";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import { CustomNavLink } from "../ChakraUI/CustomNavLink";
import Logo from "../Logo/Logo";

export default function PostDetails() {
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const { id } = useParams();
    const { userData } = useContext(AppContext);
    const [showOptions, setShowOptions] = useState(false);
    const [author, setAuthor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedPost, setUpdatedPost] = useState({ title: '', content: '', tags: '' });
    const [commentsUpdated, setCommentsUpdated] = useState(false);
    const color = useColorModeValue("brand.100", "brand.300");


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
        setUpdatedPost({ title: post.title, content: post.content, tags: post.tags.join(', ') });
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

        const tagsArray = updatedPost.tags.trim().split(', ').join(',').split(',');

        await updatePostById(post.id, { ...updatePostById, tags: tagsArray});
        setIsEditing(false);
        getPostById(id).then(setPost);
    }

    const handleAddComment = (event) => {
        setCommentText(event.target.value);
    }

    let userPageLink = '/users/';
    if (userData) {
        userPageLink += userData.handle;
    }

    return (
        <div id='post-details'>
            {(post && userData && author) ? (
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
                                <CustomNavLink to={userPageLink}>User Page</CustomNavLink>
                            </Grid>

                        </Box>

                        <Box w="500px" p={4} my={3} ml={5} >
                            <Flex >
                                <Button onClick={() => navigate(-1)}>Back</Button>
                                {(userData.handle === post.author || (userData.isAdmin && !author.isAdmin)) &&
                                    <Button ml={3} onClick={toggleAuthorOptions}>Options</Button>
                                }
                            </Flex>

                            {showOptions && (
                                <Box mt={3}>
                                    <Button mr={3} onClick={postDeletion}>Delete Post</Button>
                                    {isEditing ? (
                                        <Box mt={4}>
                                            <FormControl>
                                                <FormLabel>Title:</FormLabel>
                                                <Input value={updatedPost.title} onChange={e => setUpdatedPost({ ...updatedPost, title: e.target.value })} />
                                            </FormControl>
                                            <FormControl mt={4}>
                                                <FormLabel>Content:</FormLabel>
                                                <Textarea value={updatedPost.content} onChange={e => setUpdatedPost({ ...updatedPost, content: e.target.value })} />
                                            </FormControl>
                                            <FormControl mt={4}> 
                                                <FormLabel>Tags:</FormLabel>
                                                <Input type="text" value={updatedPost.tags} onChange={e => setUpdatedPost({ ...updatedPost, tags: e.target.value })} />
                                            </FormControl>
                                            <Button mt={4} colorScheme="teal" onClick={saveChanges}>Save</Button>
                                        </Box>
                                    ) : (
                                        <Button onClick={startEditing}>Edit Post</Button>
                                        )}
                                </Box>
                            )}

                            <Box mt={6}>
                                <Flex alignItems="center">
                                    <ProfilePicture handle={post.author} type='postDetails' />
                                    <Box ml={4} maxWidth="500px">
                                        <Heading as="h3" size="lg">{post.title}</Heading>
                                        <Text mt={2}>by {post.author} on {new Date(post.createdOn).toLocaleDateString('bg-BG')}</Text>
                                    </Box>
                                </Flex>
                                <Text mt={4}>{post.content}</Text>
                                <Button onClick={togglePostLike} mt={4}>{post.likedBy.includes(userData.handle) ? 'Dislike' : 'Like'}</Button>
                            </Box>

                            {(userData && userData.isBlocked) ?
                                (<Text mt={4}>Comment section currently not available! Talk to an admin for more information.</Text>)
                                :
                                <Box mt={4}>
                                    <Heading as="h3" size="md">Comments:</Heading>
                                    {post.comments ? Object.entries(post.comments).map(([commentId, comment]) => (
                                        <Box key={commentId} className="post-comment" mt={4}>
                                            <Comment comment={comment} postId={post.id} commentId={commentId} setCommentsUpdated={setCommentsUpdated} />
                                        </Box>
                                    )) : <Text mt={4}>This post has no comments</Text>}
                                    <FormControl mt={4}>
                                        <FormLabel>Comment:</FormLabel>
                                        <Textarea value={commentText} onChange={handleAddComment} />
                                    </FormControl>
                                    <Button onClick={postComment} id='post-comment-button' mt={4}>Post</Button>
                                </Box>
                            }
                        </Box>
                    </Grid>
                    </>
                    ) : (
                    <p>Loading...</p>
            )}

                </div>
            )
}


