import Post from '../Post/Post';
import { useEffect, useState } from 'react';
import { getAllPost } from '../../services/posts-service';
//import Container from '../Container/Container';
//import './AllPosts.css';
import PropTypes from 'prop-types';

const AllPosts = ({ search }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getAllPost();
      setPosts(posts);
    }
    fetchPosts()
  }, [search]); // refetch when search changes

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>My feed</h1>
      <div id="posts-container">
          <div>{filteredPosts.map(post => (
            <Post key={post.id} post={post} />
          ))}
          </div>
      </div>
    </div>
  );
};

export default AllPosts;

AllPosts.propTypes = {
  search: PropTypes.string
}