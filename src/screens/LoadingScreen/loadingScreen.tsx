import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  RouteStackParamList,
  CustomIcon,
  StatusBarCustom,
} from '../../components';
import {checkPermisstionGPS} from '../../controller';
import messaging from '@react-native-firebase/messaging';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
const LoadingScreen = ({navigation}: RouteStackParamList<'LoadingScreen'>) => {
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
          if (auth().currentUser) {
            navigation.replace('StaplerScreen');
          } else {
            navigation.replace('SignInScreen');
          }
        }
      });
  }

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.container}>
      <StatusBarCustom backgroundColor="#6A1616" barStyle="light-content" />
      <View style={styles.containerLogo}>
        <CustomIcon name="stapler-outline" size={50} color="#FFEBEB" />
        <Text style={styles.text}>STAPLER</Text>
      </View>
      <ActivityIndicator
        color="#white"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A1616',
    alignItems: 'center',
  },
  containerLogo: {
    flexDirection: 'row',
    top: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: 16,
    color: '#FFEBEB',
    fontSize: 50,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  activityIndicator: {
    bottom: 15,
    position: 'absolute',
    alignItems: 'center',
  },
});

export default LoadingScreen;
