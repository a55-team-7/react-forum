import { useContext, useEffect, useState } from 'react';
import { getPostsByMostLikes } from '../../services/posts-service';
import Post from '../Post/Post';
import { MAX_POPULAR_POSTS } from '../../common/contants';
import { Box, Heading, Grid, useColorModeValue, useTheme, VStack } from '@chakra-ui/react';
import AppContext from '../../context/AppContext';


const Popular = () => {
  const [posts, setPosts] = useState([]);
  const theme = useTheme();
  const {user} = useContext(AppContext);
  const color = useColorModeValue(theme.colors.brand[100], theme.colors.brand[300]);

  useEffect(() => {
    getPostsByMostLikes()
      .then(posts => setPosts(posts.slice(0, MAX_POPULAR_POSTS)))
      .catch(console.error);
  }, []);

  return (
    <Box borderRadius="md" boxShadow="1g" w="1200px"  >

      {user ? <Heading as="h1" size="lg" mb={4}>Popular posts</Heading> : null}

      <Box id="new-posts-container">
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {posts.map((post, index) => (
             <Box key={index} bg="white" p={5} shadow={`md`} borderWidth="1px" borderRadius="10px" maxH="250px" w="390px">
              <Post post={post} />
            </Box>
          ))}
        </Grid>
      </Box>
      
    </Box>
  );
};

//   return (
//     <VStack id="popular-container" spacing={4} align="stretch">
//     <Heading as="h1" size="lg" mb={4} color={color}>Popular posts</Heading>
//     <SimpleGrid className="popular-grid" columns={{ base: -2, md: 1 }} spacing={10}>
//       {posts.map((post, index) => (
//         <Box key={index} p={5} shadow="md" borderWidth="1px" maxH="500px">
//           <Post post={post} />
//         </Box>
//       ))}
//     </SimpleGrid>
//   </VStack>
// );
// };

export default Popular;