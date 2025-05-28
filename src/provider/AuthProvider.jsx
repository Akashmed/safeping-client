import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
import { app } from "../components/firebase/firebase.config";
// import { removeCookie } from "../Api/route";
import React from "react";
import { removeCookie } from "../api/auth";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password);
    }

    const signIn = (email, password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth,email,password);
    }

    const googleSignIn = () =>{
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const resetPassword = (email) =>{
        setLoading(true);
        return sendPasswordResetEmail(auth,email);
    }

    const logOut = async() =>{
        setLoading(true);
        await removeCookie();
        return signOut(auth);
    }

    const updateUserProfile = (name, photo) =>{
        // setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        })
    }

    // Auth State
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, currentUser=>{
            setUser(currentUser);
            console.log('current user----->', currentUser);
            setLoading(false);
        })
        return ()=>{
            return unsubscribe();
        }
    },[])

    const authInfo = {
        user,
        loading, 
        setLoading,
        createUser,
        signIn,
        googleSignIn,
        resetPassword,
        logOut,
        updateUserProfile
    }
    return (
        <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;