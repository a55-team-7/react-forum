import Post from '../Post/Post';
import { useEffect, useState } from 'react';
import { getAllPosts, getPostsByMostComments, getPostsByMostLikes, getPostsByNewest, getPostsByOldest } from '../../services/posts-service';
//import Container from '../Container/Container';
//import './AllPosts.css';
import PropTypes from 'prop-types';
// import Button from '../Button/Button';
import { Box, Button, Heading, SimpleGrid, Divider, Stack, Radio, RadioGroup, Grid, Flex } from '@chakra-ui/react';
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
    (post.tags ? Object.values(post.tags) : []).some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
    post.content.toLowerCase().includes(search.toLowerCase())
  );

  const toogleFilterLike = () => {
    setFilterToggle(!filterToggle);

  }

  // const handleFilterChange = (event) => {
  //   if (filter === event.target.value) {
  //     setFilter('');
  //   } else {
  //     setFilter(event.target.value);
  //   }
  // }

  // Had to be changed, because of the RadioGroup component from Chakra UI 
  // who doesn't work with the onChange event
  const handleFilterChange = (value) => {
    setFilter(value);
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

  const colors = [
    'rgb(0, 0, 255)',     // Blue
    'rgb(75, 0, 130)',    // Indigo
    'rgb(0, 153, 0)',     // Green
    'rgb(0, 255, 255)',   // Cyan
    'rgb(238, 59, 59)',   // Blood orange
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Box borderRadius="md" boxShadow="1g" w="1200px"  >




      <Flex direction="row" alignItems={'center'}>
        <Heading as="h1" size="lg" mr={'15px'}>My feed</Heading>
        <div className="material-symbols-outlined" style={{ marginRight: '15px' }} onClick={toogleFilterLike}>&#xe429;</div>

        {filterToggle && (
          <RadioGroup onChange={handleFilterChange} value={filter}>
            <Stack direction="row">
              <Radio value="most liked">most liked</Radio>
              <Radio value="recents">recents</Radio>
              <Radio value="most commented">most commented</Radio>
              <Radio value="oldest">oldest</Radio>
            </Stack>
          </RadioGroup>
        )}

      </Flex>

      {/* {filterToggle && (
        <RadioGroup onChange={handleFilterChange} value={filter}>
          <Stack direction="row">
            <Radio value="most liked">most liked</Radio>
            <Radio value="recents">recents</Radio>
            <Radio value="most commented">most commented</Radio>
            <Radio value="oldest">oldest</Radio>
          </Stack>
        </RadioGroup>
      )} */}

      <Divider my={4} />

      <Box id="posts-container" >
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {(filter ? sortedPostsState : filteredPosts).map(post => (
            <Box key={post.id} bg="white" p={5} shadow={`5px 10px 35px  ${getRandomColor()}`} borderWidth="1px" borderRadius="md" maxH="250px" w="390px">
              <Post post={post} />
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

AllPosts.propTypes = {
  search: PropTypes.string
}

export default AllPosts;

//   return (
//     <div>
//       <h1>My feed</h1>

//       <Button onClick={toogleFilterLike}> Filter </Button>

//       {filterToggle && (
//         <>
//           <label>
//             <input type="checkbox" value="most liked" checked={filter === 'most liked'} onChange={handleFilterChange} />
//             most liked
//           </label>
//           <label>
//             <input type="checkbox" value="recents" checked={filter === 'recents'} onChange={handleFilterChange} />
//             recents
//           </label>
//           <label>
//             <input type="checkbox" value="most commented" checked={filter === 'most commented'} onChange={handleFilterChange} />
//             most commented
//           </label>
//           <label>
//             <input type="checkbox" value="oldest" checked={filter === 'oldest'} onChange={handleFilterChange} />
//             oldest
//           </label>
//         </>
//       )}

//       <div id="posts-container">
//         <div>
//           {(filter ? sortedPostsState : filteredPosts).map(post => (
//             <Post key={post.id} post={post} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

