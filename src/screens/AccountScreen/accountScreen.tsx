import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {
  CustomIcon,
  ProfileInformation,
  ImageUser,
  RouteStackParamList,
  StatusBarCustom,
} from '../../components';
import auth from '@react-native-firebase/auth';
import {getUrl, upload} from '../../firebase/storage';
import {signOutAccount} from '../../firebase/firebase';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {updateUser} from '../../controller';
import 'react-native-console-time-polyfill';
import FastImage from 'react-native-fast-image';
import {checkPermissionPhoto, checkPermissionCamera} from '../../controller';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

const Header = ({navigation}: any) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text
          style={{
            flex: 5,
            fontSize: 26,
            fontWeight: 'bold',
            fontStyle: 'normal',
            color: '#6A1616',
          }}>
          Account
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('SettingsScreen')}
          style={{
            flex: 1,
            alignContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <CustomIcon name="setting" color="#212121" size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
};
//get image from camera
async function cameraLaunch(
  uid: string,
  fileFolder: string,
  fileName: string,
  images?: any,
  edit?: boolean,
  setLoadAvatar?: any,
  loadAvatar?: boolean,
) {
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
          await upload(uid, fileFolder, fileName, res.uri, () => {
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
          await upload(uid, fileFolder, fileName, res.uri, () => {
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
}
//get image from gallery
function imageGalleryLaunch(
  uid: string,
  fileFolder: string,
  fileName: string,
  setLoadAvatar?: any,
  loadAvatar?: boolean,
  images?: any,
  edit?: boolean,
) {
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
          await upload(uid, fileFolder, fileName, res.uri, () => {
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
          await upload(uid, fileFolder, fileName, res.uri, () => {
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
}

const deleteTokenToDatabase = async (token: string) => {
  const userId = auth().currentUser?.uid;
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayRemove(token),
    });
};

//calculate age
function computeAge(birthday: string) {
  const diff = Date.now() - Date.parse(birthday);
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

//delete image
function deleteImage(fileName: string, images?: any) {
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
}

type propsModal = {
  isModalVisible: boolean;
  setIsModalVisible: any;
  fileName: string;
  images?: any;
  edit?: boolean;
  setLoadAvatar?: any;
  loadAvatar?: boolean;
};

//Modal image
const ModalPicture = ({
  isModalVisible,
  setIsModalVisible,
  fileName,
  setLoadAvatar,
  loadAvatar,
  images,
  edit,
}: propsModal) => {
  return (
    <Modal
      swipeDirection="down"
      onSwipeComplete={() => setIsModalVisible(false)}
      hideModalContentWhileAnimating
      isVisible={isModalVisible}
      style={styles.modal}
      onBackdropPress={() => setIsModalVisible(false)}
      backdropOpacity={0.5}>
      <View style={styles.buttonModal}>
        <CustomIcon
          name="addcamera"
          size={30}
          color="#6A1616"
          style={{flex: 0.5}}
        />
        <Text
          style={styles.textButtonModal}
          onPress={() => {
            setIsModalVisible(false);
            cameraLaunch(
              // @ts-ignore: Object is possibly 'null'.
              auth().currentUser.uid,
              'images',
              fileName,
              images,
              edit,
              setLoadAvatar,
              loadAvatar,
            );
          }}>
          Open Camera
        </Text>
      </View>
      <View style={styles.buttonModal}>
        <CustomIcon
          name="addpicture"
          size={30}
          color="#6A1616"
          style={{flex: 0.5}}
        />
        <Text
          style={styles.textButtonModal}
          onPress={() => {
            setIsModalVisible(false);
            imageGalleryLaunch(
              // @ts-ignore: Object is possibly 'null'.
              auth().currentUser.uid,
              'images',
              fileName,
              setLoadAvatar,
              loadAvatar,
              images,
              edit,
            );
          }}>
          Upload From Gallery
        </Text>
      </View>
      {!edit ? null : (
        <View style={styles.buttonModal}>
          <CustomIcon
            name="bin"
            size={30}
            color="#6A1616"
            style={{flex: 0.5}}
          />
          <Text
            style={styles.textButtonModal}
            onPress={() => {
              deleteImage(fileName, images);
              setIsModalVisible(false);
            }}>
            Delete Image
          </Text>
        </View>
      )}
    </Modal>
  );
};

const add_image_default = require('../../../assets/images/add_image_default.png');

export const AccountScreen = ({
  route,
  navigation,
}: RouteStackParamList<'AccountScreen'>) => {
  const User = {
    name: '',
    birthday: '',
    gender: '',
    avatar: null,
    email: '',
    intro: '',
    lookingFor: '',
    height: '',
    university: '',
    drinking: '',
    smoking: '',
    kids: '',
    province: '',
    coordinates: {
      lat: 0,
      long: 0,
    },
    location: '',
    images: [null, null, null, null, null, null, null, null],
  };
  const [user, setUser] = useState(User);
  const [edit, setEdit] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadAvatar, setLoadAvatar] = useState(false);
  const [load, setLoad] = useState(false);
  const loadUser = async () => {
    const res = await fetch(
      'https://still-brushlands-96770.herokuapp.com/profile/get/' +
        // @ts-ignore: Object is possibly 'null'.
        auth().currentUser.uid,
    );
    await setUser(await res.json());
  };
  // console.log(user);
  useEffect(() => {
    // @ts-ignore: Object is possibly 'null'.
    loadUser();
  }, [route.params, loadAvatar]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUser();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <ScrollView>
        <Header navigation={navigation} />
        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(true);
            setFileName('avatar.png');
            setEdit(false);
          }}
          activeOpacity={0.9}>
          <View style={styles.avatar}>
            {load ? (
              <ActivityIndicator
                color="#red"
                size="large"
                style={styles.activityIndicator}
              />
            ) : null}
            <FastImage
              style={styles.avatar}
              onLoadStart={() => setLoad(true)}
              source={{
                // @ts-ignore: Object is possibly 'null'.
                uri: user.avatar,
                headers: {Authorization: 'staplerapp123456'},
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
              onLoadEnd={() => setLoad(false)}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.scrollView}>
          <View style={styles.informationContainer}>
            <View style={styles.firstContainer}>
              <Text
                style={styles.font26}
                onPress={() =>
                  navigation.navigate('EditNameScreen', {
                    name: user.name,
                  })
                }>
                {user.name}
              </Text>
              <Text
                style={styles.font26}
                onPress={() => navigation.navigate('EditAgeScreen')}>
                , {computeAge(user.birthday)}
              </Text>
            </View>
            <Text style={styles.font17}>{user.intro}</Text>
            <ProfileInformation
              iconName="gender"
              content={user.gender}
              onPress={() => {
                navigation.navigate('EditGenderScreen', {
                  gender: user.gender,
                });
              }}
            />
            <ProfileInformation
              iconName="lookingfor"
              content={user.lookingFor}
              onPress={() => {
                navigation.navigate('EditLookingForScreen', {
                  lookingFor: user.lookingFor,
                });
              }}
            />
            <ProfileInformation
              iconName="location"
              content={user.location}
              onPress={() => navigation.navigate('EditLivingScreen')}
            />
            <ProfileInformation
              iconName="height"
              content={user.height ? user.height + ' cm' : user.height}
              onPress={() =>
                navigation.navigate('EditHeightScreen', {
                  height: user.height,
                })
              }
            />
            <ProfileInformation
              iconName="university"
              content={user.university}
              onPress={() => navigation.navigate('EditUniversityScreen')}
            />
            <ProfileInformation
              iconName="province"
              content={user.province}
              onPress={() =>
                navigation.navigate('EditHomeTownScreen', {
                  province: user.province,
                })
              }
            />
            <ProfileInformation
              iconName="drinking"
              content={user.drinking}
              onPress={() =>
                navigation.navigate('EditDrinkingScreen', {
                  drinking: user.drinking,
                })
              }
            />
            <ProfileInformation
              iconName="smoking"
              content={user.smoking}
              onPress={() =>
                navigation.navigate('EditSmokingScreen', {
                  smoking: user.smoking,
                })
              }
            />
            <ProfileInformation
              iconName="child"
              content={user.kids}
              onPress={() =>
                navigation.navigate('EditYourKidScreen', {
                  kids: user.kids,
                })
              }
            />
          </View>
          {user.images[0] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image1.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[0]} />
            </TouchableOpacity>
          ) : null}
          {user.images[1] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image2.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[1]} />
            </TouchableOpacity>
          ) : null}
          {user.images[2] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image3.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[2]} />
            </TouchableOpacity>
          ) : null}
          {user.images[3] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image4.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[3]} />
            </TouchableOpacity>
          ) : null}
          {user.images[4] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image5.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[4]} />
            </TouchableOpacity>
          ) : null}
          {user.images[5] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image6.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[5]} />
            </TouchableOpacity>
          ) : null}
          {user.images[6] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image7.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[6]} />
            </TouchableOpacity>
          ) : null}
          {user.images[7] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image8.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[7]} />
            </TouchableOpacity>
          ) : null}
          <View style={styles.buttonContainer}>
            {user.images.indexOf(null) === -1 ? null : (
              <TouchableHighlight
                style={styles.button}
                onPress={() => {
                  const index = user.images.indexOf(null);
                  setIsModalVisible(true);
                  setFileName(`image${index + 1}.png`);
                  setEdit(false);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <CustomIcon
                    name="addcamera"
                    size={20}
                    color="#FFFFFF"
                    style={{marginRight: 5}}
                  />
                  <Text style={styles.textButton}>Add a Photo</Text>
                </View>
              </TouchableHighlight>
            )}
            {/* <TouchableHighlight style={styles.button}>
              <Text style={styles.textButton}>Connect Instagram</Text>
            </TouchableHighlight> */}
            <TouchableHighlight
              style={styles.button}
              onPress={() => {
                messaging()
                  .getToken()
                  .then((token) => {
                    deleteTokenToDatabase(token).then(() => {
                      signOutAccount(() => {
                        navigation.replace('LoadingScreen');
                      });
                    });
                  });
              }}>
              <Text style={styles.textButton}>Log out</Text>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
      <ModalPicture
        fileName={fileName}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        images={user.images}
        setLoadAvatar={setLoadAvatar}
        loadAvatar={loadAvatar}
        edit={edit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  firstContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginTop: 5,
  },
  informationContainer: {
    width: '100%',
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatar: {
    height: 400,
    width: '100%',
    alignItems: 'center',
  },
  font26: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  font17: {
    fontSize: 17,
    fontWeight: '600',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  button: {
    width: '90%',
    height: 45,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A1616',
  },
  textButton: {
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#FFFFFF',
  },
  headerContainer: {
    flex: 1,
    height: 45,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#C8C8C8',
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonModal: {
    backgroundColor: '#F8F8F8',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  textButtonModal: {
    flex: 2,
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
  },
  activityIndicator: {
    bottom: 200,
    top: 200,
    position: 'absolute',
  },
});
