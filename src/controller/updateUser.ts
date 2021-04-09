import auth from '@react-native-firebase/auth';
export const updateUser = (user: any) => {
  return fetch(
    'https://still-brushlands-96770.herokuapp.com/profile/update/' +
      auth().currentUser?.uid,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    },
  );
};
