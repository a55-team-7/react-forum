import { addPost } from '../../services/posts-service';
import Button from '../Button/Button';
import { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';
import './CreatePost.css'

export default function CreatePost() {
    const { userData } = useContext(AppContext);
    const [post, setPost] = useState({
        title: '',
        content: '',
    });

    const updatePost = (value, key) => {
        setPost({
            ...post,
            [key]: value,
        });
    };

    //TODO: createPost should navigate to all posts once the all posts component is ready
    const createPost = async () => {
        if (post.title.length < 16) {
            return alert('Title must be at least 16 characters long');
        }
        if (post.title.length > 64) {
            return alert('Title cannot be more than 64 characters long');
        }
        if (post.content.length < 32) {
            return alert('Content must be at least 32 characters long');
        }
        if (post.content.length > 8192) {
            return alert('Content cannot be more than 8192 characters long');
        }

        await addPost(userData.handle, post.title, post.content);

        setPost({
            title: '',
            content: '',
        });
    };

    return (
        <div>
            <h1>Create post</h1>
            <label htmlFor="input-title">Title:</label>
            <input value={post.title} onChange={e => updatePost(e.target.value, 'title')} type="text" name="input-title" id="input-title" /><br />
            <label htmlFor="input-content">Content:</label><br />
            <textarea value={post.content} onChange={e => updatePost(e.target.value, 'content')} name="input-content" id="input-content" cols="30" rows="10"></textarea><br /><br />
            <Button onClick={createPost}>Create</Button>
        </div>
    );
}