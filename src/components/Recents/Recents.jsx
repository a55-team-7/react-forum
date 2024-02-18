import { useEffect, useState } from 'react';
import { getPostsByNewest } from '../../services/posts-service';
import Post from '../Post/Post';
import { MAX_RECENT_POSTS } from '../../common/contants';

const Recents = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPostsByNewest()
      .then(posts => setPosts(posts.slice(0, MAX_RECENT_POSTS)))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Recent Posts</h2>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default Recents;