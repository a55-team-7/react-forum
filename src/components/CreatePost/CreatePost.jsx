import { Box, Button, FormControl, FormLabel, Heading, Input, Textarea, Text } from "@chakra-ui/react";
import { addPost } from '../../services/posts-service';
import { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';
import './CreatePost.css'
import { useNavigate } from 'react-router-dom';
import { MAX_CONTENT_SYMBOLS, MAX_POST_TITLE_LENGTH, MIN_CONTENT_SYMBOLS, MIN_POST_TITLE_LENGTH } from '../../common/contants';

export default function CreatePost() {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: '',
        content: '',
        tags: '',
    });

    const updatePost = (value, key) => {
        setPost({
            ...post,
            [key]: value,
        });
    };

    const createPost = async () => {
        const { title, content, tags } = post;

        if (title.length < MIN_POST_TITLE_LENGTH) {
            return alert(`Title must be at least ${MIN_POST_TITLE_LENGTH} characters long`);
        }

        if (title.length > MAX_POST_TITLE_LENGTH) {
            return alert(`Title cannot be more than ${MAX_POST_TITLE_LENGTH} characters long`);
        }

        if (content.length < MIN_CONTENT_SYMBOLS) {
            return alert(`Content must be at least ${MIN_CONTENT_SYMBOLS} characters long`);
        }

        if (content.length > MAX_CONTENT_SYMBOLS) {
            return alert(`Content cannot be more than ${MAX_CONTENT_SYMBOLS} characters long`);
        }

        const tagsArray = tags.trim().split(', ').join(',').split(',');

        await addPost(userData.handle, title, content, tagsArray);

        setPost({
            title: '',
            content: '',
            tags: ''
        });

        navigate(-1);
    };

    const colors = ['rgb(255, 25, 52)', 'rgb(255, 0, 54)', 'rgb(128, 0, 128)', 'rgb(204, 204, 0)', 'rgb(0, 153, 0)'];

    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };


    return (
        <Box borderRadius="md" boxShadow="1g" w="1200px" ml='400px'>
          <Box
    textAlign="left"
    w="700px"
    p={2}
    my={5}
    h="100vh"
    d="flex"
    mt="30px"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    position="relative"
>
    <Box
        position="absolute"
        left={0}
        top="10%"
        bottom="40%"
        borderLeft="2px solid #000"
        borderColor="blue"
    />
                <Heading as="h1" size="xl" mb={3}>Create Post</Heading>
                <Text mb='10px' as="h4"  fontSize="25px" fontWeight="100"  color={getRandomColor()}>Tell the users about a programming issue or share something interesting! </Text>
                <FormControl id="input-title" isRequired>
                    <FormLabel>Title:</FormLabel>
                    <Input value={post.title} onChange={e => updatePost(e.target.value, 'title')} />
                </FormControl>

                <FormControl id="input-content" isRequired mt={3}>
                    <FormLabel>Content:</FormLabel>
                    <Textarea value={post.content} onChange={e => updatePost(e.target.value, 'content')} />
                </FormControl>

                <FormControl id="input-tags" mt={3}>
                    <FormLabel>Tags:</FormLabel>
                    <Input type="text" placeholder='separated by a comma' value={post.tags} onChange={e => updatePost(e.target.value, 'tags')} />
                </FormControl>

                <Button color="blue" width="full" mt={6} onClick={createPost}>
                    Create
                </Button>
            </Box>

        </Box>
    );
}