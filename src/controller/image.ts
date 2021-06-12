import {checkPermissionCamera, checkPermissionPhoto, updateUser} from '.';
import {launchCamera} from 'react-native-image-picker';
import {getUrl, upload} from '../firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';

interface PropsCamera {
  uid: string;
  fileFolder: string;
  fileName: string;
  images: Array<string>;
  edit?: boolean;
  setLoadAvatar: (state: boolean) => void;
  loadAvatar?: boolean;
}

export const cameraLaunch = ({
  uid,
  fileFolder,
  fileName,
  images,
  edit,
  setLoadAvatar,
  loadAvatar,
}: PropsCamera) => {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  checkPermissionCamera().then((result) => {
    if (!result) {
      return;
    }
    launchCamera(options, async (res: any) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else {
        if (edit) {
          await upload(uid, fileFolder, fileName, res.assets[0].uri, () => {
            getUrl(uid, 'images', fileName).then((result) => {
              switch (fileName) {
                case 'image1.png':
                  images[0] = result;
                  break;
                case 'image2.png':
                  images[1] = result;
                  break;
                case 'image3.png':
                  images[2] = result;
                  break;
                case 'image4.png':
                  images[3] = result;
                  break;
                case 'image5.png':
                  images[4] = result;
                  break;
                case 'image6.png':
                  images[5] = result;
                  break;
                case 'image7.png':
                  images[6] = result;
                  break;
                case 'image8.png':
                  images[7] = result;
                  break;
              }
              updateUser({images: images}).then(() => {
                setLoadAvatar(!loadAvatar);
              });
            });
          });
        } else {
          await upload(uid, fileFolder, fileName, res.assets[0].uri, () => {
            getUrl(uid, 'images', fileName).then((result) => {
              if (fileName === 'avatar.png') {
                updateUser({avatar: result}).then(() => {
                  setLoadAvatar(!loadAvatar);
                });
              } else {
                images[images.indexOf(null)] = result;
                updateUser({images: images}).then(() => {
                  setLoadAvatar(!loadAvatar);
                });
              }
            });
          });
        }
      }
    });
  });
};

export const galleryLaunch = ({
  uid,
  fileFolder,
  fileName,
  images,
  edit,
  setLoadAvatar,
  loadAvatar,
}: PropsCamera) => {
  checkPermissionPhoto().then((result) => {
    if (!result) {
      return;
    }
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, async (res: any) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else {
        if (edit) {
          await upload(uid, fileFolder, fileName, res.assets[0].uri, () => {
            getUrl(uid, 'images', fileName).then((result) => {
              switch (fileName) {
                case 'image1.png':
                  images[0] = result;
                  break;
                case 'image2.png':
                  images[1] = result;
                  break;
                case 'image3.png':
                  images[2] = result;
                  break;
                case 'image4.png':
                  images[3] = result;
                  break;
                case 'image5.png':
                  images[4] = result;
                  break;
                case 'image6.png':
                  images[5] = result;
                  break;
                case 'image7.png':
                  images[6] = result;
                  break;
                case 'image8.png':
                  images[7] = result;
                  break;
              }
              updateUser({images: images}).then(() => {
                setLoadAvatar(!loadAvatar);
              });
            });
          });
        } else {
          await upload(uid, fileFolder, fileName, res.assets[0].uri, () => {
            getUrl(uid, 'images', fileName).then((result) => {
              if (fileName === 'avatar.png') {
                updateUser({avatar: result}).then(() => {
                  setLoadAvatar(!loadAvatar);
                });
              } else {
                images[images.indexOf(null)] = result;
                updateUser({images: images}).then(() => {
                  setLoadAvatar(!loadAvatar);
                });
              }
            });
          });
        }
      }
    });
  });
};

export const deleteImage = (fileName: string, images?: any) => {
  switch (fileName) {
    case 'image1.png':
      images[0] = null;
      break;
    case 'image2.png':
      images[1] = null;
      break;
    case 'image3.png':
      images[2] = null;
      break;
    case 'image4.png':
      images[3] = null;
      break;
    case 'image5.png':
      images[4] = null;
      break;
    case 'image6.png':
      images[5] = null;
      break;
    case 'image7.png':
      images[6] = null;
      break;
    case 'image8.png':
      images[7] = null;
      break;
  }
  updateUser({images: images});
};
