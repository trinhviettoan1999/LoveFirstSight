import auth from '@react-native-firebase/auth';

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
