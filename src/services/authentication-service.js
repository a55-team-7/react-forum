import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail } from "firebase/auth";
import { auth } from "../config/firebase-setup.js";

export const registerUser = async (email, password) => {  { /* This function will be used to register a user */}
    try {
        return  createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        return error;
    }
};

export const loginUser = async (email, password) => {                    { /* This function will be used to login a user */}
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        return error;
    }
};

export const logoutUser = async () => {    { /* This function will be used to logout a user */}
    try {
        const response = await signOut(auth);
        return response;
    } catch (error) {
        return error;
    }
}                             

export const changeUserEmail = async (newEmail) => {  
    try {
        if (auth.currentUser) {
            return updateEmail(auth.currentUser, newEmail);
        }
    } catch (error) {
        return error;
    }
};