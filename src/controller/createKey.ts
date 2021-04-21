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
