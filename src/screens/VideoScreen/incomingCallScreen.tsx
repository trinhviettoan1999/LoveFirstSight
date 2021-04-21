import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RouteStackParamList, CustomIcon} from '../../components';
import {setStateVideoCall, createKey} from '../../controller';

const IncommingCallScreen = ({
  navigation,
  route,
}: RouteStackParamList<'InitScreen'>) => {
  const {name, avatar, appId, channelName, userId} = route.params;
  function handleCancel() {
    setStateVideoCall(channelName, false).then(() => navigation.goBack());
  }
  function handleAccept() {
    createKey(appId, '0a74d4d72dc94bab83c42b611c802c8f', channelName, userId)
      .then((result) => result.json())
      .then((key) => {
        navigation.replace('VideoScreen', {
          name,
          avatar,
          appId,
          channelName,
          userId,
          token: key,
        });
      });
  }
  return (
    <ImageBackground source={{uri: avatar}} style={styles.imageBackground}>
      <Text style={styles.text}>{name} is calling...</Text>
      <View style={styles.containerButton}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#FFFFFF'}]}
          activeOpacity={0.6}
          onPress={handleCancel}>
          <CustomIcon name="cancel" size={25} color="#6A1616" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#6A1616'}]}
          activeOpacity={0.6}
          onPress={handleAccept}>
          <CustomIcon name="video" size={25} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  containerButton: {
    position: 'absolute',
    bottom: 120,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IncommingCallScreen;
