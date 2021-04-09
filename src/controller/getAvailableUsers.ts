import auth from '@react-native-firebase/auth';

export async function getAvailableUsers(filter: any) {
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
}
