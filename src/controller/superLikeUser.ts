import auth from '@react-native-firebase/auth';

export function superLikeUser(userId: string) {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/match/super/' +
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
