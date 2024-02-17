import { BrowserRouter, Route, Routes, useSearchParams } from "react-router-dom";
import Header from './components/Header/Header';
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound/NotFound";
import AppContext from "./context/AppContext";
import Recents from "./components/Recents/Recents";
import './App.css'
import Popular from "./components/Popular/Popular";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase-setup.js";
import { getUserData } from "./services/users-service";
import CreatePost from "./components/CreatePost/CreatePost";
import PostDetails from "./components/Post Details/PostDetails";
import UserPage from "./components/UserPage/UserPage";
import AllPosts from "./components/AllPosts/AllPosts";
import Authenticated from "./hoc/Authenticated.jsx";
import { Users } from "./components/Users/Users.jsx";

//SEARCH
//in search bar - tags, users OK
//in button - recently posted, most likes, most commented , oldest - OK 

//POSTS
//edit post (for admind and for own posts) and delete post (for admin and for own posts) IN DETAILED VIEW  OK - finish  (change title, content, tags, delete comments which are not your own , edit commnets which are your own)
//edit profile information for your own profile SHOULD NOT CHANGE USERNAME  OK                                            |
//edit your own comments                                                                                                  |

//FOR ADMINS
//search for a user by their username, email, or display name  (search by handle, email, or name in search bar) OK
//block and unblock a user -> a blocked user is not able to crate posts or to comment  - OK - to finish the new views OK 
//option to delete ANY post - (exept the one for the admins) 

//TAGS
//user must be able to add/remove/edit tags only on its own posts 
//Admins must be able to add/remove/edit tags on all posts


const AllRoutes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const setSearch = (value) => {
    setSearchParams({ search: value });
  }

  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <Routes>
        <Route path="home" element={<Home />}>
          <Route index element={<Authenticated> <AllPosts search={search} /> </Authenticated>} />
          <Route path="recents" element={<Recents />} />
          <Route path="popular" element={<Popular />} />
          <Route path="create-post" element={<Authenticated> <CreatePost /> </Authenticated>} />
          <Route path="my-posts" element={<Authenticated> <AllPosts search={search} /> </Authenticated>} />
          <Route path="users" element={<Authenticated> <Users search={search} />  </Authenticated>} />
        </Route>
        <Route path="home/my-posts/:id" element={<Authenticated> <PostDetails /> </Authenticated>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="users/:handle" element={<Authenticated> <UserPage />  </Authenticated>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => {
  const [context, setContext] = useState({
    user: null,
    userData: null,
  })

  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then(snapshot => {
          if (snapshot.exists()) {
            setContext({ user, userData: snapshot.val()[Object.keys(snapshot.val())[0]] });
          }
        })
    }
  }, [user, loading, error])

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...context, setContext }}>
        <AllRoutes />
      </AppContext.Provider>
    </BrowserRouter>
  )
};

export default App;