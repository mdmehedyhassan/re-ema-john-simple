import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { handelCreateUserWithEmailAndPassword, handelSignInWithEmailAndPassword, handleGoogleSignIn, handleSignOut, initializeLoginFramework } from './loginManager';

initializeLoginFramework()

const Login = () => {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }

  // const gitHubSignIn = () => {
  //   handleGitHubSignIn()
  //   .then(res => {
  //     handleResponse(res, true);
  //   })
  // }

  const signOut = () => {
    handleSignOut()
    .then(res => {
      handleResponse(res, false);
    })
  }

  const handleBlur = (e) => {
    let isFieldValid;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length >= 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value)
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (e.target.name === 'name') {
      isFieldValid = true;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }
  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      handelCreateUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }
    if (!newUser && user.email && user.password) {
      handelSignInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }
    e.preventDefault();
  }

  const handleResponse = (res, redirect) => {
    setUser(res);
    setLoggedInUser(res);
    if(redirect){
      history.replace(from);
    }
  }

  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={signOut}>Google sign out</button> : 
        <button onClick={googleSignIn}>Google sign in</button>

      }
      <br />
      
      {
        user.isSignedIn &&
        <div>
          <h1>Welcome, {user.name}</h1>
          <h4>{user.email}</h4>
          <img src={user.photo} alt="" />
        </div>
      }
      <h1>Our own Authentication</h1>
      <input onChange={() => setNewUser(!newUser)} type="checkbox" name="newUser" id="" />
      <label htmlFor="newUser">New User Sign up</label>

      <form>
        {
          newUser && <input onBlur={handleBlur} type="text" name="name" id="" placeholder="Your Name" />
        }
        <br />
        <input onBlur={handleBlur} type="text" name="email" placeholder="Your Email address" id="" required />
        <br />
        <input onBlur={handleBlur} type="password" name="password" placeholder="Your Password" id="" required />
        <br />
        <input onClick={handleSubmit} type="submit" value={newUser ? 'Sign up' : 'Sign In'} />
      </form>
      {
        user.error && <p style={{ color: 'red' }}>{user.error}</p>
      }
      {
        user.success && <p style={{ color: 'green' }}>User {newUser ? "created" : "logged in"}  successfully</p>
      }
    </div>
  );
};

export default Login;