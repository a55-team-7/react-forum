import { useSearchParams } from "react-router-dom";
import Post from "../Post/Post";
import { useState } from "react";



const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div>
      <h1>All Posts</h1>
    </div>
  );

};

export default AllPosts;