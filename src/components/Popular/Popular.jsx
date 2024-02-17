import { useEffect, useState } from 'react';
import { getPostsByMostLikes } from '../../services/posts-service';
import Post from '../Post/Post';
import { MAX_POPULAR_POSTS } from '../../common/contants';

const Popular = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPostsByMostLikes()
      .then(posts => setPosts(posts.slice(0, MAX_POPULAR_POSTS)))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Popular Posts</h2>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default Popular;