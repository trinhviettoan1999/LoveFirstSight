import {Platform, PermissionsAndroid} from 'react-native';

export const checkPermissionCamera = () => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }
  return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
    (result) => {
      console.log('Permission result:', result);
      // @ts-ignore
      return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
    },
  );
};

export const checkPermissionPhoto = () => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }
  return PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  ).then((result) => {
    console.log('Permission result:', result);
    // @ts-ignore
    return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
  });
};

export const checkPermisstionAudio = () => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }
  return PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ).then((result) => {
    console.log('Permission result:', result);
    // @ts-ignore
    return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
  });
};

export const checkPermisstionGPS = () => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }
  return PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ).then((result) => {
    console.log('Permission result:', result);
    // @ts-ignore
    return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
  });
};
