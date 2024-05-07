import React,{useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import './App.css';
import { login, logout, selectUser } from "./features/userSlice";
import { auth } from "./firebase";
import Feed from './Feed';
import Header from './Header';
import Login from './Login';
import Sidebar from './Sidebar';
import Widgets from './Widgets';

function App() {
  const userState = useSelector(selectUser);
  const {user} = userState;
  const dispatch = useDispatch();

useEffect(() => {
  auth.onAuthStateChanged((userAuth)=>{
    console.log("app user",userAuth);
    if(userAuth){
      dispatch(
        login({
          email: userAuth.email,
          uid: userAuth.uid,
          displayName: userAuth.displayName,
          photoUrl: userAuth.photoURL,
        })
      )
    } else{
      dispatch(logout());
    }
  })
}, []);

  return (
    <div className="app">

      {!user ? (
        <Login />
        ) : (<>
          <Header />
          <div className="app__body">
          <Sidebar />
          <Feed />
          <Widgets/>
        </div>
        </>)}

    </div>
  );
}

export default App;
