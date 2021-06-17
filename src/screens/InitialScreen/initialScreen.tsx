import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  RouteStackParamList,
  CustomIcon,
  StatusBarCustom,
} from '../../components';
import {checkPermisstionGPS} from '../../controller';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import auth from '@react-native-firebase/auth';
import {ROUTER} from '../../constants';

export const InitialScreen = ({
  navigation,
}: RouteStackParamList<'StaplerScreen'>) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <CustomIcon name="stapler-outline" size={50} color="#6A1616" />
        <Text style={styles.textLogo}>STAPLER</Text>
      </View>
      <StatusBarCustom backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.containerText}>
        <Text style={styles.text}>
          Please try again. If you don't have GPS turned on, turn on GPS.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.reload}
        activeOpacity={0.7}
        onPress={() => {
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
          })
            .then((data) => {
              if (data) {
                checkPermisstionGPS().then((result) => {
                  if (!result) {
                    return;
                  }
                  if (auth().currentUser) {
                    navigation.replace(ROUTER.home);
                  } else {
                    navigation.replace(ROUTER.signIn);
                  }
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }}>
        <CustomIcon name="reload" size={30} color="#6A1616" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  containerText: {
    marginTop: 200,
    height: 40,
    width: '90%',
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontStyle: 'normal',
    color: '#C8C8C8',
    fontWeight: 'bold',
  },
  reload: {
    width: 40,
    height: 40,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLogo: {
    flexDirection: 'row',
    top: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLogo: {
    marginLeft: 16,
    color: '#6A1616',
    fontSize: 50,
    fontWeight: '600',
    fontStyle: 'normal',
  },
});
