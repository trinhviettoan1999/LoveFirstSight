import storage from '@react-native-firebase/storage';
import ImageResizer from 'react-native-image-resizer';

//upload
export const upload = (
  userId: any,
  folder: string,
  fileName: string,
  pathFile: string,
  next: any,
) => {
  if (folder === 'sound') {
    const reference = storage().ref(userId + '/' + folder + '/' + fileName);
    reference.putFile(pathFile).then(next);
  } else {
    ImageResizer.createResizedImage(
      pathFile,
      800,
      800,
      'JPEG',
      100,
      0,
      undefined,
      false,
      {mode: 'contain'},
    ).then(async (resizedImage) => {
      const reference = storage().ref(userId + '/' + folder + '/' + fileName);
      await reference.putFile(resizedImage.uri).then(next);
    });
  }
};
//get Image
export const getUrl = async (userId: any, folder: string, fileName: string) => {
  return await storage()
    .ref(userId + '/' + folder + '/' + fileName)
    .getDownloadURL()
    .then((result) => result);
};
