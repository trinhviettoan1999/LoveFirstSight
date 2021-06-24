import React, {useEffect} from 'react';
import {ImageBackground, Platform, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {checkPermisstionGPS} from '../../controller';
import messaging from '@react-native-firebase/messaging';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {ROUTER} from '../../constants/router';
import {HeaderCustom} from '../../components';
import {color} from '../../theme/color';

const logo = require('../../../assets/images/Logo.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const LoadingScreen = () => {
  const navigation = useNavigation();
  const load = () => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          console.log(remoteMessage.data);
          // @ts-ignore: Object is possibly 'null'.
          if (remoteMessage.data.type === 'Chat') {
            // @ts-ignore: Object is possibly 'null'.
            navigation.replace(remoteMessage.data.type, {
              // @ts-ignore: Object is possibly 'null'.
              name: remoteMessage.data.name,
              // @ts-ignore: Object is possibly 'null'.
              avatar: remoteMessage.data.avatar,
              // @ts-ignore: Object is possibly 'null'.
              conversationId: remoteMessage.data.conversationId,
              // @ts-ignore: Object is possibly 'null'.
              ownerId: remoteMessage.data.userId,
              flag: true,
            });
          }
          // @ts-ignore: Object is possibly 'null'.
          if (remoteMessage.data.type === 'ProfileScreen') {
            // @ts-ignore: Object is possibly 'null'.
            navigation.replace(remoteMessage.data.type, {
              // @ts-ignore: Object is possibly 'null'.
              userId: remoteMessage.data.userId,
              flag: true,
            });
          }
        } else {
          setTimeout(() => {
            if (auth().currentUser) {
              navigation.replace(ROUTER.home);
            } else {
              navigation.replace(ROUTER.signIn);
            }
          }, 2000);
        }
      });
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then((data) => {
          if (data) {
            checkPermisstionGPS().then((result) => {
              if (!result) {
                navigation.replace(ROUTER.initial);
              }
              load();
            });
          }
        })
        .catch((err) => {
          if (err.message === 'denied') {
            navigation.replace(ROUTER.initial);
          }
          console.log(err);
        });
    } else {
      checkPermisstionGPS().then((result) => {
        if (!result) {
          navigation.replace(ROUTER.initial);
        }
        load();
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ImageBackground style={{height: HEIGHT, width: WIDTH}} source={logo}>
      <HeaderCustom removeBorderWidth backgroundStatusBar={color.transparent} />
    </ImageBackground>
  );
};
