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

const App = () => {

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{}}> {/* in value we will pass everything the need to share with the other component (not implemented for now)*/}
          <Header />
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} /> {/* also named ReadIT as an experiment ??? home will show different things depending on weather the user is signed in or not*/}
            <Route path="login" element={<Login />} /> {/* also labeled as Sign In, login would be reusable as we will give the user the option to log in even if he somehow lands on the Register form (Look Excalidraw)*/}
            <Route path="register" element={<Register />} /> {/* also labeled as Join now , so that no one gets confused */}
            <Route path="recents" element={<Recents />} />
            <Route path="popular" element={<Popular />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppContext.Provider>
      </BrowserRouter>
    </>
  )
};

export default App;
