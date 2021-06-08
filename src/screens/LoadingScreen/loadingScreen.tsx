import React, {useEffect} from 'react';
import {View, StyleSheet, Platform, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import {RouteStackParamList, HeaderCustom} from '../../components';
import {checkPermisstionGPS} from '../../controller';
import messaging from '@react-native-firebase/messaging';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const logo = require('../../../assets/images/Logo.png');

export const LoadingScreen = ({
  navigation,
}: RouteStackParamList<'LoadingScreen'>) => {
  function load() {
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
          const time = setTimeout(() => {
            if (auth().currentUser) {
              navigation.replace('StaplerScreen');
            } else {
              navigation.replace('SignInScreen');
            }
          }, 2000);
          // clearTimeout(time);
        }
      });
  }

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
                navigation.replace('InitialScreen');
              }
              load();
            });
          }
        })
        .catch((err) => {
          if (err.message === 'denied') {
            navigation.replace('InitialScreen');
          }
          console.log(err);
        });
    } else {
      checkPermisstionGPS().then((result) => {
        if (!result) {
          navigation.replace('InitialScreen');
        }
        load();
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.container}>
      <Image
        style={{height: 250, width: 250}}
        source={logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    bottom: 15,
    position: 'absolute',
    alignItems: 'center',
  },
});
