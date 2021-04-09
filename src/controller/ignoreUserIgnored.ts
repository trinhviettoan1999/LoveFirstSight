import auth from '@react-native-firebase/auth';

export function ignoreUserIgnored(userId: string) {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/second-look/ignore/' +
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
