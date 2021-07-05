import React, {useEffect} from 'react';
import {View, StyleSheet, ImageBackground, Text, Pressable} from 'react-native';
import {RouteStackParamList, DisLike, HeaderCustom} from '../../components';
import {
  setStateVideoCall,
  createKey,
  getStateVideoCall,
} from '../../controller';
import {ROUTER} from '../../constants/router';
import {VideoFull} from '../../components/AllSvgIcon/AllSvgIcon';
import Sound from 'react-native-sound';
import {color} from '../../theme';

const nhachuong = require('../../../assets/sounds/chuongdienthoai.mp3');
const sound = new Sound(nhachuong);

export const IncomingCallScreen = ({
  navigation,
  route,
}: RouteStackParamList<'InitScreen'>) => {
  const {name, avatar, appId, channelName, userId, ownerId} = route.params;

  const handleCancel = () => {
    setStateVideoCall(channelName, false);
    sound.stop();
    navigation.goBack();
  };

  // useEffect(() => {
  //   getStateVideoCall(channelName, async (result: boolean) => {
  //     if (!result) {
  //       sound.stop();
  //       navigation.goBack();
  //     }
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    sound.setNumberOfLoops(-1);
    sound.setVolume(1);
    sound.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = () => {
    createKey(appId, '0a74d4d72dc94bab83c42b611c802c8f', channelName, userId)
      .then((result) => result.json())
      .then((key) => {
        sound.stop();
        navigation.navigate(ROUTER.video, {
          name,
          avatar,
          appId,
          channelName,
          userId,
          token: key,
          type: 'incoming',
        });
      });
  };

  return (
    <ImageBackground source={{uri: avatar}} style={styles.imageBackground}>
      <HeaderCustom
        backgroundStatusBar={color.transparent}
        barStyle="light-content"
        removeBorderWidth
      />
      <Text style={styles.text}>{name} is calling...</Text>
      <View style={styles.containerButton}>
        <Pressable onPress={handleCancel}>
          <DisLike />
        </Pressable>
        <Pressable onPress={handleAccept}>
          <VideoFull />
        </Pressable>
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
});
