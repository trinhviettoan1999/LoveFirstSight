import firestore from '@react-native-firebase/firestore';

export const setStateVideoCall = async (
  conversationId: string,
  state: boolean,
) => {
  await firestore().collection('conversations').doc(conversationId).update({
    stateVideoCall: state,
  });
};
