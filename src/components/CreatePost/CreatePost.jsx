import { addPost } from '../../services/posts-service';
import Button from '../Button/Button';
import { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';
import './CreatePost.css'
import { MAX_CONTENT_SYMBOLS, MAX_POST_TITLE_LENGTH, MIN_CONTENT_SYMBOLS, MIN_POST_TITLE_LENGTH } from '../../common/contants';

export default function CreatePost() {
    const { userData } = useContext(AppContext);
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
    };

    return (
        <div>
            <h1>Create post</h1>
            <label htmlFor="input-title">Title:</label>
            <input value={post.title} onChange={e => updatePost(e.target.value, 'title')} type="text" name="input-title" id="input-title" /><br />
            <label htmlFor="input-content">Content:</label><br />
            <textarea value={post.content} onChange={e => updatePost(e.target.value, 'content')} name="input-content" id="input-content" cols="30" rows="10"></textarea><br />
            <label htmlFor='input-tags'>Tags (separate by comma!):</label>
            <input type="text" name="input-tags" id="input-tags" value={post.tags} onChange={e => updatePost(e.target.value, 'tags')} /><br /><br />
            <Button onClick={createPost}>Create</Button>
        </div>
    );
}