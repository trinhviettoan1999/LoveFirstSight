import auth from '@react-native-firebase/auth';

export function reportUser(userId: string) {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/match/report/' +
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
