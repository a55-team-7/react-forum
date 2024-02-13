import Post from '../Post/Post';
import { useEffect, useState } from 'react';
import { getAllPost } from '../../services/posts-service';



const AllPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getAllPost();
      setPosts(posts);
    }
    fetchPosts()
  }, []);

  return (
    <div>
      <h1>All Posts</h1>
      <div>{posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
      </div>
    </div>
  );

};

export default AllPosts;