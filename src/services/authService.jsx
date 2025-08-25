import { createUserWithEmailAndPassword
       ,onAuthStateChanged
       ,signInWithEmailAndPassword,
       signInWithPopup
       ,updateProfile
       ,signOut } from "firebase/auth";

import { auth,googleAuthProvider } from "../firebase";

//Register with email password
export const registerWithEmail = async (email , password ,fullName) =>{
    try {
        const userCredentials= await createUserWithEmailAndPassword(auth , email ,password);
        //update Profile with the user Name 
        await updateProfile(userCredentials.user,{
            displayName: fullName
        });
        return userCredentials.user;
    }
    catch (error){
        throw error ;
    }
}

//Login with email and password
export const loginWithEmail = async(email , password)=>{
 try{
    const userCredentials = await signInWithEmailAndPassword(auth ,email,password);
    return userCredentials.user;
 }
 catch (error){
    throw error;
 }
}

//Login with Google 
export const loginWithGoogle = async ()=>{
    try{
        const result = await signInWithPopup(auth , googleAuthProvider);
        return result
    }
    catch(error){
        throw error;
    }
}

//logOut 
export const logOut = async()=>{
    try {
        await signOut(auth);
    }
    catch(error){
        throw error;
    }
}

//Auth State Change 
export const observeAuthState = (callback) =>{
    return onAuthStateChanged(auth , callback);
}