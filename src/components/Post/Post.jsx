import PropTypes from 'prop-types';
// import Container from '../Container/Container';
// import './Post.css';
import { Box, Text, Button, Flex, Grid, Tag, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

const Post = ({ post, postType = 'post' }) => {
    //const [post, setPost] = useState(null);
    const navigate = useNavigate();

    return (
        <Box bg="gray.100" p={4} borderRadius="md" boxShadow="lg">
            <Flex direction="column">
                <Grid templateColumns="auto 1fr auto" gap={4} alignItems="center">
                    {postType === 'post' ? <ProfilePicture handle={post.author} type={postType} /> : null}
                    <Box>
                        <Link onClick={() => navigate(`/home/my-posts/${post.id}`)} color="cyan.500">
                            <Text as="h4" fontSize="xl" fontWeight="bold">{post.title}</Text>
                        </Link>
                        <Text color="gray.500">{post.author}</Text>
                    </Box>
                    <Button onClick={() => navigate(`/home/my-posts/${post.id}`)} >see more</Button>
                </Grid>
                <Box bg="white" p={4} my={2} borderRadius="md">
                    <Text>Content: {post.content}</Text>
                </Box>
                <Grid templateColumns="1fr 1fr" justifyContent="space-between" alignItems="start">
                    <Text> Likes: {post.likedBy ? post.likedBy.length : 0}  Comments: {post.comments ? Object.values(post.comments).length : 0}</Text>
                    <Flex id="post-tags">{post && post.tags ? post.tags.map((tag, index) => (
                        <Tag key={`${index}-${tag}`} colorScheme="cyan" mr={2}>{tag}</Tag>
                    )) : null}</Flex>
                </Grid>
            </Flex>
        </Box>
    )
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
    postType: PropTypes.string
};

export default Post;

//        return (
//         <div id="post-container">
//             <Container>
//                 {/*author will be displayed with his profile pic and next to him - his name/username*/}
//                 <div id="post-header-container">
//                     {postType==='post' && <ProfilePicture handle={post.author} type={postType}/>}
//                     <button onClick={() => navigate(`/home/my-posts/${post.id}`)} >see more</button>
//                     {postType==='post' && <p>{post.author}</p>}
//                 </div>
//                 <h4>{post.title}</h4>
//                 {/* content needt to be in a container*/}
//                 <div id="content-container">
//                     <p >Content: {post.content}</p>
//                 </div>
//                 {/*Created on only for the detailed Post view */}
//                 {/*<p>Created on: {post.createdOn}</p>*/}
//                 {/*likes and comments need to be in a seperaye grid */}
//                 <div id="likes-comments-tags-container">
//                     <p> Likes: {post.likedBy ? post.likedBy.length : 0}  Comments: {post.comments ? Object.values(post.comments).length : 0}</p>
//                     <div id="post-tags">{post && post.tags ? post.tags.map((tag, index) => (
//                             <span key={`${index}-${tag}`}>{tag}</span>
//                         )) : []}</div>
//                 </div>
//             </Container>
//         </div>
//     )
// };

