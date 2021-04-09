import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
//Login Account
export const loginAccount = async (
  email: string,
  password: string,
  success_callback: any,
  setTextNotify: any,
) => {
  await auth()
    .signInWithEmailAndPassword(email, password)
    .then(success_callback)
    .catch((error: any) => {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid-email. Please again!');
      }
      if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        Alert.alert('Invalid Account. Please again!');
      }
      setTextNotify('LOG IN');
    });
};

//Create Account
export const createAccount = async (
  email: string,
  password: string,
  success_callback: any,
) => {
  await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(success_callback)
    .catch((error: any) => {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('That email address is already in use!');
      }
      if (error.code === 'auth/invalid-email') {
        Alert.alert('That email address is invalid!');
      }
    });
};

//Sign Out
export const signOutAccount = () => {
  auth()
    .signOut()
    .then(() => console.log('User singed out!'));
};

//Reset password

export const resetPassword = async (email: string) => {
  auth()
    .sendPasswordResetEmail(email)
    .then(() => console.log('Reset success!!'));
};
