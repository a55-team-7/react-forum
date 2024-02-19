import { Box, Button, FormControl, FormLabel, Heading, Input, Textarea} from "@chakra-ui/react";
import { addPost } from '../../services/posts-service';
// import Button from '../Button/Button';
import { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';
import './CreatePost.css'
import { useNavigate } from 'react-router-dom';
import { MAX_CONTENT_SYMBOLS, MAX_POST_TITLE_LENGTH, MIN_CONTENT_SYMBOLS, MIN_POST_TITLE_LENGTH } from '../../common/contants';

export default function CreatePost() {
    const { userData } = useContext(AppContext);
    const [post, setPost] = useState({
        title: '',
        content: '',
        tags: '',
    });

    const navigate = useNavigate();

    const updatePost = (value, key) => {
        setPost({
            ...post,
            [key]: value,
        });
    };

    //TODO: createPost should navigate to all posts once the all posts component is ready
    const createPost = async () => {
        if (post.title.length < MIN_POST_TITLE_LENGTH) {
            return alert(`Title must be at least ${MIN_POST_TITLE_LENGTH} characters long`);
        }
        if (post.title.length > MAX_POST_TITLE_LENGTH) {
            return alert(`Title cannot be more than ${MAX_POST_TITLE_LENGTH} characters long`);
        }
        if (post.content.length < MIN_CONTENT_SYMBOLS) {
            return alert(`Content must be at least ${MIN_CONTENT_SYMBOLS} characters long`);
        }
        if (post.content.length > MAX_CONTENT_SYMBOLS) {
            return alert(`Content cannot be more than ${MAX_CONTENT_SYMBOLS} characters long`);
        }
        const tagsArray = post.tags.trim().split(', ').join(',').split(',');

        await addPost(userData.handle, post.title, post.content, tagsArray);

        setPost({
            title: '',
            content: '',
            tags: ''
        });

        navigate(-1);
    };

    return (
        <Box textAlign="left"  w="500px" p={2} my={5}  h="100vh" d="flex" flexDirection="column" alignItems="center" justifyContent="center">

            <Heading as="h1" size="xl" mb={3}>Create Post</Heading>

            <FormControl id="input-title" isRequired>
                <FormLabel>Title:</FormLabel>
                <Input value={post.title} onChange={e => updatePost(e.target.value, 'title')} />
            </FormControl>

            <FormControl id="input-content" isRequired mt={3}>
                <FormLabel>Content:</FormLabel>
                <Textarea value={post.content} onChange={e => updatePost(e.target.value, 'content')} />
            </FormControl>

            <FormControl id="input-tags" mt={3}>
                <FormLabel>Tags (separate by comma!):</FormLabel>
                <Input type="text" value={post.tags} onChange={e => updatePost(e.target.value, 'tags')} />
            </FormControl>

            <Button colorScheme="orange" width="full" mt={6} onClick={createPost}>
                Create
            </Button>
        </Box>
    );
}