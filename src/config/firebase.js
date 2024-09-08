// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth/web-extension";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiB5r-hKSjePRFJuFGw7wi8SHSm6na_kg",
  authDomain: "chat-app-gs-f17ca.firebaseapp.com",
  projectId: "chat-app-gs-f17ca",
  storageBucket: "chat-app-gs-f17ca.appspot.com",
  messagingSenderId: "760965000680",
  appId: "1:760965000680:web:e6fa5ae54d3d815c05485d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db= getFirestore(app);

const signup = async(username,email,password) => {
    try { 
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey There i am using chat app",
            lastSeen: Date.now()

        })
        await setDoc(doc(db,"Chats", user.uid),{
            chatsData:[]
        })

    } catch(error) { 
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));

    }
    
}

const login = async(email,password) => {
    try { 
        await signInWithEmailAndPassword(auth, email,password);
        
    } catch (error) { 
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));

    }
}

const logout = async () => {
    try {
        await signOut(auth)
    } catch (error) { 
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
        
    }
}

const resetPass  = async (email) => {
    if (!email) {
        toast.error("Enter your email");
        return null;
    }
    try {
        const userRef = collection(db,'users');
        const q = query(userRef,where("email","==",email));
        const querySnap = await getDocs(q);
        if (! querySnap.empty) { 
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset Email Sent")
            
        }
        else{
            toast.error("Email doesn't exists")
        }
    } catch (error) { 
        console.error(error);
        toast.error(error.message)
        
    }
}

export {signup,login,logout,auth,db,resetPass}