import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RouteStackParamList, DisLike} from '../../components';
import {setStateVideoCall, createKey, endCall} from '../../controller';
import {ROUTER} from '../../constants/router';
import {VideoFull} from '../../components/AllSvgIcon/AllSvgIcon';

export const IncomingCallScreen = ({
  navigation,
  route,
}: RouteStackParamList<'InitScreen'>) => {
  const {name, avatar, appId, channelName, userId, ownerId} = route.params;

  const handleCancel = () => {
    endCall(ownerId).then(() => navigation.goBack());
    setStateVideoCall(channelName, false);
  };

  const handleAccept = () => {
    createKey(appId, '0a74d4d72dc94bab83c42b611c802c8f', channelName, userId)
      .then((result) => result.json())
      .then((key) => {
        navigation.replace(ROUTER.video, {
          name,
          avatar,
          appId,
          channelName,
          userId,
          token: key,
        });
      });
  };

  return (
    <ImageBackground source={{uri: avatar}} style={styles.imageBackground}>
      <Text style={styles.text}>{name} is calling...</Text>
      <View style={styles.containerButton}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={handleCancel}>
          <DisLike />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={handleAccept}>
          <VideoFull />
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
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    // width: 60,
    // height: 60,
    // borderRadius: 30,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
