import auth from '@react-native-firebase/auth';
export const addImageUser = (urlImage: any) => {
  return fetch(
    'https://still-brushlands-96770.herokuapp.com/profile/add-image/' +
      auth().currentUser?.uid,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({urlImage: urlImage}),
    },
  );
};
