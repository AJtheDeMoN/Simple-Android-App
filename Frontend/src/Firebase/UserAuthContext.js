import React, {useContext, useState, useEffect} from "react";
import {auth, db} from "./firebase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { setDoc, doc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export default function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    const login = (email, password) => {
        return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth,email, password).then((userCredential) => {
            setCurrentUser(userCredential.user.uid);
            // localStorage.setItem("user", JSON.stringify(userCredential.user));
            AsyncStorage.setItem("user", JSON.stringify(userCredential.user.uid));
            resolve(userCredential.user);
        })
        .catch((error) => {
            reject(error);
        });
        })
    }
    const logout = () => {
        // localStorage.removeItem("user");
        // localStorage.removeItem("token");
        AsyncStorage.removeItem("user");
        return signOut(auth);
    }
    const register = (email, password, phone, name) => {
        return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password).then((userCred)=>{
            const user=userCred.user;
            // localStorage.setItem("user", JSON.stringify(user));
            setCurrentUser(userCred.user.uid);
            AsyncStorage.setItem("user", JSON.stringify(userCred.user.uid));
            const ref=collection(db, "users");
            console.log('after registering')
            setDoc(doc(ref, user.uid), {
                email: email,
                phone: phone,
                name: name
            }).then(()=>resolve(user))
            .catch((error)=>{
                reject(error);
            })
        })
    })
    }
    useEffect(() => {
        // Check local storage for a stored user
        // const storedUser = localStorage.getItem('user');
        const storedUser=null;
        if (storedUser) {
          // If there's a user in local storage, parse and set it as the current user
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          setLoading(false);
        } else {
          // If no user in local storage, listen for changes in authentication state
          const unsubscribe = onAuthStateChanged(auth,(user) => {
            if(user)
            setCurrentUser(user.uid);
            else
            setCurrentUser(null)
            setLoading(false);
            console.log("user g", user);
          });
      
          // Cleanup the subscription when the component unmounts
          return () => unsubscribe();
        }
      }, []);
    const value = {
        currentUser,
        login,
        logout,
        register
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}