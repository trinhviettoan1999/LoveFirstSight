import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {
  Header,
  RouteStackParamList,
  CustomIcon,
  StatusBarCustom,
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
        setResourcePath({
          filePath: res,
          fileData: res.data,
          fileUri: res.uri,
        });
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
        setResourcePath({
          filePath: res,
          fileData: res.data,
          fileUri: res.uri,
        });
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

const InitAvatarScreen = ({
  route,
  navigation,
}: RouteStackParamList<'FirstScreen'>) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resourcePath, setResourcePath] = useState({
    fileUri: null,
    filePath: null,
    fileData: null,
  });
  const {user} = route.params;
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack()}
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
              uri: resourcePath.fileUri
                ? resourcePath.fileUri
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
                cameraLaunch(setResourcePath);
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
                imageGalleryLaunch(setResourcePath);
              }}>
              Upload From Gallery
            </Text>
          </View>
        </Modal>
        <TouchableHighlight
          style={[
            styles.button,
            {backgroundColor: resourcePath.fileUri ? '#6A1616' : '#E1E1E1'},
          ]}
          disabled={resourcePath != null ? false : true}
          onPress={async () => {
            await firebase.createAccount(
              user.email,
              user.password,
              async () => {
                user.userId = auth().currentUser?.uid;
                await upload(
                  user.userId,
                  'images',
                  'avatar.png',
                  // @ts-ignore: Object is possibly 'null'.
                  resourcePath.fileUri,
                  () => {
                    getUrl(user.userId, 'images', 'avatar.png').then(
                      (result) => {
                        user.avatar = result;
                      },
                    );
                    createUser(user);
                  },
                );
              },
            );
            navigation.replace('StaplerScreen');
          }}>
          <Text style={styles.textButton}>CONTINUE</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  textQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
    marginTop: 40,
  },
  textNote: {
    fontSize: 17,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#ACACAC',
    marginTop: 10,
  },
  button: {
    width: 190,
    height: 54,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  textButton: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#FFFFFF',
  },
});

export default InitAvatarScreen;
