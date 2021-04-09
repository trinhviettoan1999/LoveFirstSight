import auth from '@react-native-firebase/auth';

export function likeUserIgnored(userId: string) {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/second-look/like/' +
      auth().currentUser?.uid +
      '/' +
      userId,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  );
}
