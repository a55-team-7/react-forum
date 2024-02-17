import Post from '../Post/Post';
import { useEffect, useState } from 'react';
import { getAllPosts, getPostsByMostComments, getPostsByMostLikes, getPostsByNewest, getPostsByOldest } from '../../services/posts-service';
//import Container from '../Container/Container';
//import './AllPosts.css';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import { get } from 'firebase/database';

const AllPosts = ({ search }) => {
  const [posts, setPosts] = useState([]);
  const [filterToggle, setFilterToggle] = useState(false);
  const [filter, setFilter] = useState('');
  const [sortedPostsState, setSortedPostsState] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getAllPosts();
      setPosts(posts);
    }
    fetchPosts()
  }, [search]); // refetch when search changes

  useEffect(() => {
    sortedPosts();
  }, [filter]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.author.toLowerCase().includes(search.toLowerCase()) ||
    //post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
    post.content.toLowerCase().includes(search.toLowerCase())
  );

  const toogleFilterLike = () => {
    setFilterToggle(!filterToggle);

  }

  const handleFilterChange = (event) => {
    if (filter === event.target.value) {
      setFilter('');
    } else {
      setFilter(event.target.value);
    }
  }

 

  const sortedPosts = async () => {
    let result;
    switch (filter) {
      case 'most liked':
        result = await getPostsByMostLikes();
        break;
      case 'recents':
        result = await getPostsByNewest();
        break;
      case 'most commented':
        result = await getPostsByMostComments();
        break;
      case 'oldest':
        result = await getPostsByOldest();
        break;
      default:
        result = [];
    }
    setSortedPostsState(result);
  };

  return (
    <div>
      <h1>My feed</h1>

      <Button onClick={toogleFilterLike}> Filter </Button>

      {filterToggle && (
        <>
          <label>
            <input type="checkbox" value="most liked" checked={filter === 'most liked'} onChange={handleFilterChange} />
            most liked
          </label>
          <label>
            <input type="checkbox" value="recents" checked={filter === 'recents'} onChange={handleFilterChange} />
            recents
          </label>
          <label>
            <input type="checkbox" value="most commented" checked={filter === 'most commented'} onChange={handleFilterChange} />
            most commented
          </label>
          <label>
            <input type="checkbox" value="oldest" checked={filter === 'oldest'} onChange={handleFilterChange} />
            oldest
          </label>
        </>
      )}

      <div id="posts-container">
        <div>
          {(filter ? sortedPostsState : filteredPosts).map(post => (
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