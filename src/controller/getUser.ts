import firestore from '@react-native-firebase/firestore';
export const getUser = async (userId: string) => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/profile/get/' + userId,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json());
};

export const checkUserInCall = async (userId: string, next: any) => {
  return await firestore()
    .collection('users')
    .doc(userId)
    .onSnapshot((user) => {
      next(user.data()!.stateJoinCall);
    });
};
