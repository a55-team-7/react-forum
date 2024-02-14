import Post from '../Post/Post';
import { useEffect, useState } from 'react';
import { getAllPost } from '../../services/posts-service';
import Container from '../Container/Container';
import './AllPosts.css';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getAllPost();
      setPosts(posts);
    }
    fetchPosts()
  }, [posts]); //when a post is deleted or edited for example we need to refetch

  return (
    <div>
      <h1>My feed</h1>
      <div id="posts-container">

          <div>{posts.map(post => (
            <Post key={post.id} post={post} />
          ))}
          </div>
      
      </div>
    </div>
  );

};

export default AllPosts;