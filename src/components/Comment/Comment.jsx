import PropTypes from 'prop-types'
import './Comment.css'
import { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import Button from '../Button/Button';
import { deleteCommentById, updateCommentById } from '../../services/posts-service';
import { MAX_COMMENT_CONTENT_LENGTH, MIN_COMMENT_CONTENT_LENGTH } from '../../common/contants';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

export default function Comment ({comment, postId, commentId, setCommentsUpdated}) {
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

    const deleteComment = async() => {
        await deleteCommentById(postId, commentId);
        setCommentsUpdated(true);
    }

    return (
        <div className='comment'>
            <p>{comment.comment}</p>
            <p>by {comment.userHandle} on {new Date(comment.createdOn).toLocaleDateString('bg-BG')}</p>
            <ProfilePicture handle={comment.userHandle} type={'comment'}/>
            {isEditing ? (
                        <>
                            <textarea value={updatedContent} onChange={e => setUpdatedContent(e.target.value)} name="edit-content" id="edit-content" cols="30" rows="10"></textarea><br />
                            
                            <Button onClick={saveChanges}>Save</Button>
                        </>
                    ) : (
                        <>
                            {((userData.handle === comment.userHandle) || userData.isAdmin) && <Button onClick={startEditing}>Edit</Button>}
                        </>
                    )}
            {((userData.handle === comment.userHandle) || userData.isAdmin) && <Button onClick={deleteComment}>Delete</Button>}
        </div>
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