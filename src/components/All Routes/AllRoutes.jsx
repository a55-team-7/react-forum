import { BrowserRouter, Route, Routes, useSearchParams } from "react-router-dom";
import Header from '../Header/Header';
import Home from "../Home/Home";
import Register from "../Register/Register";
import Login from "../Login/Login";
import NotFound from "../NotFound/NotFound";
import Recents from "../Recents/Recents";
import Popular from "../Popular/Popular";
import CreatePost from "../CreatePost/CreatePost";
import PostDetails from "../Post Details/PostDetails";
import UserPage from "../UserPage/UserPage";
import AllPosts from "../AllPosts/AllPosts";
import Authenticated from "../../hoc/Authenticated.jsx";
import { Users } from "../Users/Users.jsx";

export const AllRoutes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const setSearch = (value) => {
    setSearchParams({ search: value });
  }

  return (
    <>
      <Routes>
        <Route path="home" element={<Home search={search} setSearch={setSearch} />}>
          <Route index element={<Authenticated> <AllPosts search={search} /> </Authenticated>} />
          <Route path="recents" element={<Recents />} />
          <Route path="popular" element={<Popular />} />
          <Route path="create-post" element={<Authenticated> <CreatePost /> </Authenticated>} />
          <Route path="my-posts" element={<Authenticated> <AllPosts search={search} /> </Authenticated>} />
          <Route path="users" element={<Authenticated> <Users search={search} />  </Authenticated>} />
          <Route path="users/:handle" element={<Authenticated> <UserPage />  </Authenticated>} />
           <Route path="my-posts/:id" element={<Authenticated> <PostDetails /> </Authenticated>} />
        </Route>
       
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default AllRoutes;