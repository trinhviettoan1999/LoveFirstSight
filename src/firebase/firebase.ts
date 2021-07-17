import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk';
import {Alert} from 'react-native';
//Login Account
export const loginAccount = async (
  email: string,
  password: string,
  success_callback: any,
  fail_callback: any,
) => {
  await auth()
    .signInWithEmailAndPassword(email, password)
    .then(success_callback)
    .catch(fail_callback);
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
export const signOutAccount = async () => {
  if (auth().currentUser?.providerData[0].providerId === 'google.com') {
    GoogleSignin.configure({
      webClientId:
        '500865270015-2uat70emstop40v4v0cc9rmnhd3ogecm.apps.googleusercontent.com',
    });
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  }
  if (auth().currentUser?.providerData[0].providerId === 'facebook.com') {
    LoginManager.logOut();
  }
  await auth().signOut();
};

//Reset password

export const resetPassword = async (email: string) => {
  auth()
    .sendPasswordResetEmail(email)
    .then(() => console.log('Reset success!!'));
};
