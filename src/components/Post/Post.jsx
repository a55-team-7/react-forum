
import PropTypes from 'prop-types';
import { Box, Text, Button, Flex, Grid, Tag, Link, Image, Spacer } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { useColorModeValue } from '@chakra-ui/react';
import { MdOpenInNew } from 'react-icons/md';

const Post = ({ post, postType = 'post' }) => {
    const navigate = useNavigate();
    const color = useColorModeValue('brand.100', 'brand.300');

    const colors = ['rgb(255, 25, 52)', 'rgb(255, 0, 54)', 'rgb(128, 0, 128)', 'rgb(204, 204, 0)', 'rgb(0, 153, 0)'];

    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
      };
   
    return (
        <Box borderRadius="md" bg="white">

            <Flex direction="column">

                <Flex direction="row" justifyContent="space-between" alignItems="center" pb={3}>
                    <Link onClick={() => navigate(`/home/my-posts/${post.id}`)} color={color}>
                        <Text as="h4" fontSize="17px" fontWeight="700" isTruncated maxWidth="200px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" color={getRandomColor()}>
                            {post.content}
                        </Text>
                    </Link>

                    <MdOpenInNew color='gray' style={{ marginRight: '15px' }} onClick={() => navigate(`/home/my-posts/${post.id}`)} />

                </Flex>

                <Text fontSize="20px" h="90px" overflowY="auto"
                    whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis"
                    border="1px solid" borderColor="gray.200" borderRadius="10px" p={2} justifyContent='center'>
                    {post.title}
                </Text>

                <Spacer />

                <Box p={2}>
                    <Text fontSize="sm" color="gray.500">
                        Likes: {post.likedBy ? post.likedBy.length : 0} • Comments: {post.comments ? Object.values(post.comments).length : 0}
                    </Text>
                </Box>



                <Grid templateColumns="auto 1fr auto" gap={3} alignItems="center" mt={2}>
                    {postType === 'post' ? <ProfilePicture handle={post.author} type={postType} /> : null}
                    <Box >
                        <Text color="gray.500" fontWeight="700">@{post.author}</Text>
                    </Box>
                    <Flex id="post-tags" overflowX="auto" whiteSpace="nowrap" >
                        {post && post.tags ? (
                            post.tags.map((tag, index) => (
                                <Tag key={index} fontSize="sm" borderRadius="md" isTruncated maxWidth="100px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                    {tag}
                                </Tag>
                            ))
                        ) : null}
                    </Flex>


                </Grid>


            </Flex>
        </Box>
    );
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
    postType: PropTypes.string,
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

