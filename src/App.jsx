import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const App = () => {
  const [context, setContext] = useState({
    user: null,
    userData: null,
  }) //we will use this to share data between components [not implemented for now

  const [user, loading, error] = useAuthState(auth); //this is a hook from firebase that will return the user, loading and error

  useEffect(() => {
    if(user){

      getUserData(user.uid)
      .then(snapshot =>{
        if(snapshot.exists()){
          setContext({user, userData: snapshot.val()[ Object.keys(snapshot.val())[0] ] });
        }
      })
    }
  },[user, loading, error]) //this will update the context when  the user changes

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{...context, setContext}}> {/* in value we will pass everything the need to share with the other component (not implemented for now)*/}
          <Header />
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} /> {/* also named ReadIT as an experiment ??? home will show different things depending on weather the user is signed in or not*/}
            <Route path="login" element={<Login />} /> {/* also labeled as Sign In, login would be reusable as we will give the user the option to log in even if he somehow lands on the Register form (Look Excalidraw)*/}
            <Route path="register" element={<Register />} /> {/* also labeled as Join now , so that no one gets confused */}
            {/* Authenticated content:
             AllPost(or Feed) ,
              My Uploads,
               Post Details, Create Posts , 
               Settings,
               Profile,
               Logout???*/}
            <Route path="recents" element={<Recents />} />
            <Route path="popular" element={<Popular />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="my-posts" element={<AllPosts />} />
            <Route path="users/:handle" element={<UserPage />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppContext.Provider>
      </BrowserRouter>
    </>
  )
};

export default App;
