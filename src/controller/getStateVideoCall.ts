import firestore from '@react-native-firebase/firestore';

export const getStateVideoCall = async (conversationId: string, next: any) => {
  let state = false;
  await firestore()
    .collection('conversations')
    .doc(conversationId)
    .onSnapshot((conversation) => {
      next(conversation.data()!.stateVideoCall);
    });
  return state;
};
