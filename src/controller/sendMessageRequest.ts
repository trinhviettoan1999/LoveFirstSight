import auth from '@react-native-firebase/auth';
export const sendMessageRequest = (receiverId: string) => {
  return fetch(
    'https://still-brushlands-96770.herokuapp.com/conversation/send-message',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId: auth().currentUser?.uid,
        receiverId: receiverId,
      }),
    },
  ).then((res) => res.json());
};
