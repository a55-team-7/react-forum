import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase-setup.js";
import { getUserData } from "./services/users-service";
import AppContext from "./context/AppContext";
import AllRoutes from "./components/All Routes/AllRoutes";
import { ChakraProvider } from "@chakra-ui/react";

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
//option to delete ANY post - (exept the one for the admins) OK

//TAGS
//user must be able to add/remove/edit tags only on its own posts 
//Admins must be able to add/remove/edit tags on all posts

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

