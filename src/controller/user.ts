import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import GetLocation from 'react-native-get-location';

export const checkAccount = async (userId: string) => {
  const check = await firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then((documentSnapshot) => documentSnapshot.exists);
  return check;
};

export const getUser = async (userId: string) => {
  const user = (await firestore().collection('users').doc(userId).get()).data();
  return user;
};

export const getHobbiesUser = async () => {
  const listHobbies = (
    await firestore().collection('users').doc(auth().currentUser?.uid).get()
  ).data();
  return listHobbies?.hobbies;
};

export const getUserRandom = (availableUsers: any) => {
  const index = Math.floor(availableUsers.length * Math.random());
  return availableUsers[index];
};

export const getAvailableUsers = async (filter: any) => {
  return await fetch('https://still-brushlands-96770.herokuapp.com/match', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: auth().currentUser?.uid,
      gender: filter.gender,
      distance: filter.distance,
      age: filter.age,
      lookingFor: filter.lookingFor,
      drinking: filter.drinking,
      smoking: filter.smoking,
      kids: filter.kids,
      from: filter.province,
    }),
  }).then((res) => res.json());
};

export const getLikedUsers = async () => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/list/liked-you/' +
      auth().currentUser?.uid,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res);
};

export const getTopPick = async () => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/list/top-pick/' +
      auth().currentUser?.uid,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res);
};

export const getListIgnore = async () => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/list/ignored/' +
      auth().currentUser?.uid,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res);
};

export const getListBlock = async () => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/list/block/' +
      auth().currentUser?.uid,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res);
};

export const updateUser = (user: any) => {
  return fetch(
    'https://still-brushlands-96770.herokuapp.com/profile/update/' +
      auth().currentUser?.uid,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    },
  );
};

export const likeUser = (userId: string) => {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/match/like/' +
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
};

export const likeUserIgnored = (userId: string) => {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/second-look/like/' +
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
};

export const ignoreUserIgnored = (userId: string) => {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/second-look/ignore/' +
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
};

export const superLikeUser = (userId: string) => {
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
};

export const superLikeUserIgnored = (userId: string) => {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/second-look/super/' +
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
};

export const blockUser = (userId: string) => {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/match/block/' +
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
};

export const unBlockUser = (userId: string) => {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/match/unblock/' +
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
};

export const unMatchUser = async (userId: string, conversationId: string) => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/match/unmatch/' +
      auth().currentUser?.uid +
      '/' +
      userId +
      '/' +
      conversationId,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  );
};

export const ignoreUser = (userId: string) => {
  fetch(
    'https://still-brushlands-96770.herokuapp.com/match/ignore/' +
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
};

export const reportUser = (userId: string) => {
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
};

export const addImageUser = (urlImage: any) => {
  return fetch(
    'https://still-brushlands-96770.herokuapp.com/profile/add-image/' +
      auth().currentUser?.uid,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({urlImage: urlImage}),
    },
  );
};

export const uploadCoordinates = (setCoordinate: any) => {
  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 60000,
  })
    .then((location) => {
      setCoordinate({
        lat: location.latitude,
        long: location.longitude,
      });
      updateUser({
        coordinates: {
          lat: location.latitude,
          long: location.longitude,
        },
      });
    })
    .catch((error) => {
      const {code, message} = error;
      console.log(code, message);
    });
};

export const deleteTokenToDatabase = async (token: string) => {
  const userId = auth().currentUser?.uid;
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayRemove(token),
    });
};
