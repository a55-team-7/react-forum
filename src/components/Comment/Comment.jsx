import { Box, Button, FormControl, FormLabel, Flex, Text, Textarea } from "@chakra-ui/react";
import PropTypes from 'prop-types'
import './Comment.css'
import { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
// import Button from '../Button/Button';
import { deleteCommentById, updateCommentById } from '../../services/posts-service';
import { MAX_COMMENT_CONTENT_LENGTH, MIN_COMMENT_CONTENT_LENGTH } from '../../common/contants';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

export default function Comment({ comment, postId, commentId, setCommentsUpdated }) {
    const { userData } = useContext(AppContext);
    const [updatedContent, setUpdatedContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);


    const startEditing = () => {
        setUpdatedContent(comment.comment);
        setIsEditing(true);
    }

    const saveChanges = async () => {
        if (updatedContent.length < MIN_COMMENT_CONTENT_LENGTH || updatedContent.length > MAX_COMMENT_CONTENT_LENGTH) {
            alert(`Comment content should be between ${MIN_COMMENT_CONTENT_LENGTH} and ${MAX_COMMENT_CONTENT_LENGTH} symbols`);
            return;
        }

        await updateCommentById(postId, commentId, updatedContent);
        setIsEditing(false);
        setCommentsUpdated(true);
    }

    const deleteComment = async () => {
        await deleteCommentById(postId, commentId);
        setCommentsUpdated(true);
    }

    return (
        <Box bg="white" maxW="xl" borderWidth="1px" borderRadius="lg" my={4}>
            <Box p={6}>
                <Flex direction="row" alignItems="start">
                    <Box>
                        <ProfilePicture handle={comment.userHandle} type={'comment'} />
                        <Text fontSize="xl" fontWeight="semibold" lineHeight="short">
                            {comment.userHandle}
                        </Text>
                    </Box>
                    <Box ml={4} w="100%" pr={14}>
                        <Text fontSize="md" >{comment.comment}</Text>
                        <Text fontSize="sm" >
                            {new Date(comment.createdOn).toLocaleDateString('bg-BG')}
                        </Text>
                    </Box>
                </Flex>

                {isEditing ? (
                    <Box mt={4}>
                        <FormControl>
                            <FormLabel>Edit comment</FormLabel>
                            <Textarea value={updatedContent} onChange={e => setUpdatedContent(e.target.value)} />
                        </FormControl>
                        <Button mt={4} colorScheme="teal" onClick={saveChanges}>Save</Button>
                    </Box>
                ) : (
                    <Box mt={4}>
                        {(userData.handle === comment.userHandle || userData.isAdmin) &&
                            <Button colorScheme="teal" variant="outline" onClick={startEditing}>Edit</Button>
                        }
                        {(userData.handle === comment.userHandle || userData.isAdmin) &&
                            <Button colorScheme="red" variant="outline" onClick={deleteComment} ml={2}>Delete</Button>
                        }
                    </Box>
                )}
            </Box>
        </Box>
    )
}

Comment.propTypes = {
    comment: PropTypes.shape({
        userHandle: PropTypes.string,
        createdOn: PropTypes.number,
        comment: PropTypes.string
    }),
    postId: PropTypes.string,
    commentId: PropTypes.string
}