import { get, set, ref, query, equalTo, orderByChild } from "firebase/database";
import { db } from "../config/firebase-setup.js";
                                     //(hande='pesho') - give me everything which pesho contains
export const getUserByHandle = async (handle) => { //search a user by email or name for example?
    return await get(ref(db, `users/${handle}`)); //we use references to access data in the database / it points to it
}

//we want to add value to the handle object , which is in the users object in this case
export const createUserHandle = (handle, uid, email, name, lastName) => { 
    return set(ref(db, `users/${handle}`), // we are using this function write or set data to a defined path in the database
        {                                              //null objects may be ignored
            handle, uid, email, name, lastName, createdOn: new Date(), likedTweets: {} //here we are creating the user object with the handle, uid, email, createdOn and likedTweets
                                                                       //and sending it to the database in the required path
        }
    );
}

//query returns a query object that can be used to read data from the database as it 
//can chain multiple methods to filter the data and return the results
export const getUserData = async (uid) => {  //retrieve data for a single user by his id
    const userRef = (query(ref(db, 'users'), orderByChild('uid'), equalTo(uid))); 
    return await get(userRef); // we are getting the query object we received
}