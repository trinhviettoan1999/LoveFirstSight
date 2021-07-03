import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Dimensions,
  Pressable,
  ImageBackground,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {color, spacing} from '../../theme';
import {ROUTER} from '../../constants/router';
import {
  BackCircle,
  HeaderCustom,
  ButtonCustom,
  openNotification,
  CameraFill,
  GalleryFill,
} from '../../components';
import {checkPermissionCamera, checkPermissionPhoto} from '../../controller';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {upload, getUrl} from '../../firebase/storage';
import * as firebase from '../../firebase/firebase';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';

//get image from camera
function cameraLaunch(setResourcePath: any) {
  checkPermissionCamera().then((result) => {
    if (!result) {
      return;
    }
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, async (res: any) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else {
        setResourcePath(res.assets[0].uri);
      }
    });
  });
}

//get image from gallery
function imageGalleryLaunch(setResourcePath: any) {
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
        setResourcePath(res.assets[0].uri);
      }
    });
  });
}

const createUser = (user: any) => {
  return fetch('https://still-brushlands-96770.herokuapp.com/profile/create', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response)
    .then((res) => {
      res.json().then(async () => {
        if (res.status === 200) {
          console.log('Created User!!');
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const background_image = require('../../../assets/images/background_default.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const InitAvatarScreen = ({navigation}: any) => {
  const route = useRoute();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [resourcePath, setResourcePath] = useState(null);
  const {user} = route.params;

  const handleContinue = async () => {
    setLoad(true);
    if (!resourcePath) {
      setLoad(false);
      openNotification('danger', 'Please choose a avatar!!');
      return;
    }
    if (auth().currentUser) {
      user.userId = auth().currentUser?.uid;
      await upload(
        auth().currentUser?.uid,
        'images',
        'avatar.png',
        // @ts-ignore: Object is possibly 'null'.
        resourcePath,
        async () => {
          const result = await getUrl(user.userId, 'images', 'avatar.png');
          if (result) {
            createUser({...user, avatar: result})
              .then(() => {
                navigation.reset({
                  index: 0,
                  routes: [{name: ROUTER.tab}],
                });
                setLoad(false);
              })
              .catch((err) => {
                setLoad(false);
                console.log(err);
              });
          }
        },
      );
    } else {
      await firebase.createAccount(user.email, user.password, async () => {
        user.userId = auth().currentUser?.uid;
        await upload(
          user.userId,
          'images',
          'avatar.png',
          // @ts-ignore: Object is possibly 'null'.
          resourcePath,
          async () => {
            const result = await getUrl(user.userId, 'images', 'avatar.png');
            if (result) {
              createUser({...user, avatar: result})
                .then(() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: ROUTER.tab}],
                  });
                  setLoad(false);
                })
                .catch((err) => {
                  setLoad(false);
                  console.log(err);
                });
            }
          },
        );
      });
    }
  };

  return (
    <ImageBackground style={styles.image} source={background_image}>
      <HeaderCustom
        backgroundStatusBar={color.transparent}
        removeBorderWidth
        leftComponent={
          <Pressable onPress={() => navigation.goBack()}>
            <BackCircle />
          </Pressable>
        }
      />
      <View style={styles.container}>
        <Text style={styles.textQuestion}>Almost Done</Text>
        <Text style={styles.textNote}>Choose a avatar ...</Text>
        <TouchableHighlight
          style={styles.avatarContainer}
          onPress={() => setIsModalVisible(true)}
          underlayColor="#FFFFFF">
          <FastImage
            style={styles.avatar}
            source={{
              // @ts-ignore: Object is possibly 'null'.
              uri: resourcePath
                ? resourcePath
                : 'https://vsmcamp.com/wp-content/uploads/2020/11/JaZBMzV14fzRI4vBWG8jymplSUGSGgimkqtJakOV.jpeg',
              headers: {Authorization: 'staplerapp123456'},
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableHighlight>
        <Modal
          isVisible={isModalVisible}
          style={styles.modal}
          onBackdropPress={() => setIsModalVisible(false)}
          animationOutTiming={2000}
          backdropOpacity={0.5}>
          <View style={styles.buttonModal}>
            <CameraFill />
            <Text
              style={styles.textButtonModal}
              onPress={() => {
                setIsModalVisible(false);
                cameraLaunch(setResourcePath);
              }}>
              Open Camera
            </Text>
          </View>
          <View style={styles.buttonModal}>
            <GalleryFill />
            <Text
              style={styles.textButtonModal}
              onPress={() => {
                setIsModalVisible(false);
                imageGalleryLaunch(setResourcePath);
              }}>
              Upload From Gallery
            </Text>
          </View>
        </Modal>
        <ButtonCustom
          loading={load}
          title="CONTINUE"
          containerStyle={styles.containerButton}
          onPress={handleContinue}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: HEIGHT,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  containerButton: {
    marginTop: spacing[2],
    alignSelf: 'center',
  },
  avatarContainer: {
    width: '100%',
    height: 350,
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
    marginTop: 10,
    borderWidth: 0.5,
    alignItems: 'center',
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
    marginLeft: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  textQuestion: {
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: color.text,
    marginTop: spacing[4],
  },
  textNote: {
    fontSize: 17,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#ACACAC',
    marginTop: 10,
  },
});
