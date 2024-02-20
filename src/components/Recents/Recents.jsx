import { useEffect, useState } from 'react';
import { getPostsByNewest } from '../../services/posts-service';
import Post from '../Post/Post';
import { MAX_RECENT_POSTS } from '../../common/contants';
import { Box, Heading, Flex, Grid, useColorModeValue, useTheme, VStack } from '@chakra-ui/react';

const Recents = () => {
  const [posts, setPosts] = useState([]);
  const theme = useTheme();
  const color = useColorModeValue(theme.colors.brand[100], theme.colors.brand[300])

  useEffect(() => {
    getPostsByNewest()
      .then(posts => setPosts(posts.slice(0, MAX_RECENT_POSTS)))
      .catch(console.error);
  }, []);

  return (
    <Flex>
    <Box borderRadius="md" boxShadow="1g" w="1200px"  >
      <Heading as="h1" size="lg" mb={4}>Recent posts</Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {posts.map((post, index) => (
          <Box key={index} bg="white" p={5} shadow="md" borderWidth="2px" maxH="250px" w="390px">
            <Post post={post} />
          </Box>
        ))}
      </Grid>
    </Box>
    </Flex>
  );
};

//   return (
//     <VStack id="recents-container" spacing={4} align="stretch">
//       <Heading as="h1" size="lg" mb={4} color={color}>Recent posts</Heading>
//       <Flex className="recents-grid" columns={{ base: -2, md: 0 }} spacing={10}>
//         <Box>
//         {posts.map((post, index) => (
//           <Box key={index} p={5} shadow="md" borderWidth="1px" maxH="500px">
//             <Post post={post} />
//           </Box>
//         ))}
//         </Box>
//       </Flex>
//     </VStack>
//   );
// };

export default Recents;