import firestore from '@react-native-firebase/firestore';

export const checkAccount = async (userId: string) => {
  const check = await firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then((documentSnapshot) => documentSnapshot.exists);
  return check;
};
