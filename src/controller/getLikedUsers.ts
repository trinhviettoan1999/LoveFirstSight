import auth from '@react-native-firebase/auth';
export const getLikedUsers = async () => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/list/liked-you/' +
      auth().currentUser?.uid,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res);
};
