export const sendNotification = async (ownerId: string, userId: string) => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/notification/like/' +
      ownerId +
      '/' +
      userId,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json());
};
