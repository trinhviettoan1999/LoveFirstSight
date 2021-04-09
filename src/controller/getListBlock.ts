import auth from '@react-native-firebase/auth';
export const getListBlock = async () => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/list/block/' +
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
