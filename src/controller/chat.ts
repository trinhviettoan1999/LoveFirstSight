import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const createKey = (
  appID: string,
  appCertificate: string,
  channelName: string,
  uid: number,
) => {
  return fetch(
    'https://still-brushlands-96770.herokuapp.com/agora/create-key',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appID,
        appCertificate,
        channelName,
        uid,
      }),
    },
  );
};

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

export const setStateVideoCall = async (
  conversationId: string,
  state: boolean,
) => {
  await firestore().collection('conversations').doc(conversationId).update({
    stateVideoCall: state,
  });
};

export async function callVideo(
  appId: string,
  channelName: string,
  ownerId: string,
) {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/notification/call',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: auth().currentUser?.uid,
        appId: appId,
        ownerId: ownerId,
        channelName: channelName,
      }),
    },
  ).then((res) => res.json());
}
