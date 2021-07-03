import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {
  RouteStackParamList,
  CustomIcon,
  StatusBarCustom,
} from '../../components';
import {checkPermisstionGPS} from '../../controller';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import auth from '@react-native-firebase/auth';
import {ROUTER} from '../../constants';
import {color} from '../../theme/color';

export const InitialScreen = ({
  navigation,
}: RouteStackParamList<'StaplerScreen'>) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Text style={styles.textLogo}>LOVE FIRST SIGHT</Text>
      </View>
      <StatusBarCustom backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.containerText}>
        <Text style={styles.text}>
          Please try again. If you don't have GPS turned on, turn on GPS.
        </Text>
      </View>
      <Pressable
        style={styles.reload}
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
                    navigation.replace(ROUTER.tab);
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
        <CustomIcon name="reload" size={30} color={color.primary} />
      </Pressable>
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
    top: 200,
  },
  textLogo: {
    color: color.primary,
    fontSize: 40,
    fontWeight: '600',
    fontStyle: 'normal',
  },
});
