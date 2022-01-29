import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";

export const initializeLoginFramework = () => {
    // if(initializeApp.length === 0) {
        initializeApp(firebaseConfig);
    // }
}

export const handleGoogleSignIn = () => {
    console.log("Google sign in")
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider)
        .then((result) => {
            console.log(result)
            const { displayName, email, photoURL } = result.user;
            const signedInUser = {
                isSignedIn: true,
                name: displayName,
                email: email,
                photo: photoURL,
                success: true
            }
            return signedInUser
        }).catch((error) => {
            console.log(error);
        });
}

// export const handleGitHubSignIn = () => {
//     const provider = new GithubAuthProvider();
//     const auth = getAuth();
//     return signInWithPopup(auth, provider)
//         .then((res) => {
//             res.user.success = true;
//             return res.user;
//         })
//         .catch((error) => {
//             console.log(error)
//         });
// } // does not work ):

export const handleSignOut = () => {
    console.log('Google Sign Out')
    const auth = getAuth();
    return signOut(auth).then(() => {
        const signedInUser = {
            isSignedIn: false,
            newUser: false,
            name: '',
            email: '',
            photo: '',
            error: '',
            success: false
        }
        return signedInUser
    }).catch((error) => {
    });
}

export const handelCreateUserWithEmailAndPassword = (name, email, password) => {
    const auth = getAuth();
      return createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          console.log(res)
          const newUserInfo = res.user;
          newUserInfo.error = '';
          newUserInfo.success = true;
          updateUserName(name);
          return newUserInfo;
        })
        .catch((error) => {
          console.log(error)
          const newUserInfo = { };
          newUserInfo.error = 'something wrong please try again';
          newUserInfo.success = false;
          return newUserInfo;
        });
}

export const handelSignInWithEmailAndPassword = (email, password) => {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const newUserInfo = res.user;
        newUserInfo.error = '';
        newUserInfo.success = true;
        return newUserInfo;
      })
      .catch((error) => {
        const newUserInfo = {};
        newUserInfo.error = 'something wrong please try again';
        newUserInfo.success = false;
        return newUserInfo;
      });
}

export const updateUserName = name => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      console.log('User name update successfully')
    }).catch((error) => {
      console.log(error)
    });

  }