const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export const calculateDistance = (coordinates1: any, coordinates2: any) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(coordinates2.lat - coordinates1.lat); // deg2rad below
  const dLon = deg2rad(coordinates2.long - coordinates1.long); // deg2radlon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coordinates1.long)) *
      Math.cos(deg2rad(coordinates2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export const computeAge = (birthday: string) => {
  const diff = Date.now() - Date.parse(birthday);
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const checkGender = (gender: string) => {
  if (gender === 'Man') {
    return {
      optionText: 0,
      value: 'Man',
    };
  } else if (gender === 'Woman') {
    return {
      optionText: 1,
      value: 'Woman',
    };
  } else if (gender === 'Other') {
    return {
      optionText: 2,
      value: 'Other',
    };
  } else {
    return {
      optionText: 3,
      value: '',
    };
  }
};

export const checkDrinking = (drinking: string) => {
  if (drinking === 'Never') {
    return {
      optionText: 0,
      value: 'Never',
    };
  } else if (drinking === 'Often') {
    return {
      optionText: 1,
      value: 'Often',
    };
  } else if (drinking === 'Occasionaly') {
    return {
      optionText: 2,
      value: 'Occasionaly',
    };
  } else if (drinking === 'Prefer Not To Say') {
    return {
      optionText: 3,
      value: 'Prefer Not To Say',
    };
  } else {
    return {
      optionText: 4,
      value: '',
    };
  }
};

export const checkLookingFor = (lookingFor: string) => {
  if (lookingFor === 'Chatting') {
    return {
      optionText: 0,
      value: 'Chatting',
    };
  } else if (lookingFor === 'Prefer Not To Say') {
    return {
      optionText: 1,
      value: 'Prefer Not To Say',
    };
  } else if (lookingFor === 'FriendShip') {
    return {
      optionText: 2,
      value: 'FriendShip',
    };
  } else if (lookingFor === 'Something Casual') {
    return {
      optionText: 3,
      value: 'Something Casual',
    };
  } else if (lookingFor === 'Long-term Relationship') {
    return {
      optionText: 4,
      value: 'Long-term Relationship',
    };
  } else {
    return {
      optionText: 5,
      value: '',
    };
  }
};

export const checkChild = (child: string) => {
  if (child === 'Have kids') {
    return {
      optionText: 0,
      value: 'Have Kids',
    };
  } else if (child === "Don't have kids") {
    return {
      optionText: 1,
      value: "Don't Have Kids",
    };
  } else if (child === 'Prefer Not To Say') {
    return {
      optionText: 2,
      value: 'Prefer Not To Say',
    };
  } else {
    return {
      optionText: 3,
      value: '',
    };
  }
};
