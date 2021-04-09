import auth from '@react-native-firebase/auth';
export const getConversationWait = async () => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/conversation/' +
      auth().currentUser?.uid +
      '/true',
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json());
};
