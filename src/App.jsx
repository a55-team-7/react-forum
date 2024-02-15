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
        <Route index element={<Home />} />
        <Route path="home" element={<Home />}>
          <Route path="recents" element={<Recents />} />
          <Route path="popular" element={<Popular />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="my-posts" element={<AllPosts search={search}/>} />
          <Route path="posts/:id" element={<PostDetails />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="users/:handle" element={<UserPage />} />
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