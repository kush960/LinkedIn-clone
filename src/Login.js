import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { login } from './features/userSlice';
import { auth } from './firebase';
import "./Login.css"

function Login() {
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const loginHandler = async (e) => {
    e.preventDefault();
    try{
      const userAuth = await auth.signInWithEmailAndPassword(email, password);
   
      console.log(userAuth);
      dispatch(
        login({
          email: userAuth.user.email,
          uid: userAuth.user.uid,
          displayName: userAuth.user.displayName,
          photoUrl: userAuth.user.photoURL,
        })
      )
   
    }catch(error){
      alert("loginHandler",error);
    }
  }
  const registerHandler = async () => {
    if(!name){
      return alert("Please enter a full name!");
    }

    try{
      const userAuth = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

       await userAuth.user.updateProfile({
            displayName:name,
            photoURL: profilePic
          });

          dispatch(
            login({
              email: userAuth.user.email,
              uid: userAuth.user.uid,
              displayName: name,
              photoUrl: profilePic,
            })
          )

    } catch (error) {
      console.log(error);
      alert(error);
    }

  }

  return (
    <div className="login">
      <img
        src="https://news.hitb.org/sites/default/files/styles/large/public/field/image/500px-LinkedIn_Logo.svg__1.png"
        alt="Linkedin main logo" />

      <form>
        <input
          type="text"
          placeholder='Full name (required for register)'
          value={name}
          onChange={e => setName(e.target.value)} />

        <input
          type="text"
          placeholder='Profile pic URL (optional)'
          value={profilePic}
          onChange={e => setProfilePic(e.target.value)} />

        <input
          type="email"
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)} />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type='submit' onClick={loginHandler}>Sign In</button>
      </form>

      <p>
        Not a member?{" "}
        <span className="login__register" onClick={registerHandler}>
          Register Now
        </span>
      </p>
    </div>
  )
}

export default Login;