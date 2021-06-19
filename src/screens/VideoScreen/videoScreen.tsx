import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  ImageBackground,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  updateUser,
  setStateVideoCall,
  getStateVideoCall,
} from '../../controller';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import Sound from 'react-native-sound';
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {
  MicFill,
  MicOff,
  VideoOff,
  VideoOn,
  CallEnd,
} from '../../components/AllSvgIcon/AllSvgIcon';
import {color} from '../../theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HeaderCustom} from '../../components';

const nhachuong = require('../../../assets/sounds/chuongdienthoai.mp3');
const sound = new Sound(nhachuong);
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const VideoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  var engine: RtcEngine | undefined;
  const {appId, channelName, token, avatar, name, userId, ownerId} =
    route.params;
  const [props, setProps] = useState({
    peerIds: [],
    vidMute: false,
    audMute: false,
    joinSucceed: false,
  });

  const addListener = () => {
    engine?.addListener('JoinChannelSuccess', () => {
      console.log('JoinChannelSuccess');
      setProps({...props, joinSucceed: true});
    });
    engine?.addListener('UserJoined', (uid: number) => {
      console.log('UserJoined');
      // @ts-ignore: Object is possibly 'null'.
      if (props.peerIds.indexOf(uid) === -1) {
        sound.stop();
        // @ts-ignore: Object is possibly 'null'.
        setProps({...props, peerIds: [...props.peerIds, uid]});
      }
    });
    engine?.addListener('UserOffline', (uid: number) => {
      console.log('UserOffline');
      setProps({
        ...props,
        peerIds: props.peerIds.filter((result) => result !== uid),
      });
    });
    engine?.addListener('Error', (errorCode) => {
      console.info('Error', errorCode);
    });
  };

  const init = async () => {
    engine = await RtcEngine.create(appId);
    addListener();
    await engine?.enableAudio();
    await engine?.enableVideo(); //Enable the audio
  };

  const joinChannel = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
    await engine?.joinChannel(token, channelName, null, userId);
  };

  const toggleAudio = () => {
    engine?.muteLocalAudioStream(!props.audMute);
    setProps({...props, audMute: !props.audMute});
  };

  const toggleVideo = () => {
    engine?.muteLocalVideoStream(!props.vidMute);
    setProps({...props, vidMute: !props.vidMute});
  };

  const endCallVideo = async () => {
    sound.stop();
    setStateVideoCall(channelName, false);
    updateUser({
      stateJoinCall: false,
    });
    setProps({...props, peerIds: [], joinSucceed: false});
  };

  useEffect(() => {
    init().then(() => {
      joinChannel();
    });
    return () => {
      init();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sound.setNumberOfLoops(-1);
    sound.setVolume(1);
    sound.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getStateVideoCall(channelName, async (result: boolean) => {
      if (!result) {
        await engine?.leaveChannel();
        navigation.goBack();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.full} edges={['bottom']}>
      {props.peerIds.length === 0 && (
        <ImageBackground
          style={styles.image}
          source={{uri: avatar}}
          resizeMode="cover">
          <HeaderCustom
            backgroundStatusBar={color.transparent}
            barStyle="light-content"
            removeBorderWidth
          />
          <Text style={styles.textName}>Calling to {name}...</Text>
        </ImageBackground>
      )}
      {props.peerIds.length > 0 && (
        <View
          style={{
            width: WIDTH,
            height: HEIGHT,
          }}>
          <HeaderCustom
            backgroundStatusBar={color.transparent}
            barStyle="light-content"
            removeBorderWidth
          />
          {!props.vidMute && (
            <RtcLocalView.SurfaceView
              style={styles.localVideo}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              key={auth().currentUser?.uid}
            />
          )}
          <RtcRemoteView.SurfaceView
            style={{
              width: WIDTH,
              height: HEIGHT,
            }}
            uid={props.peerIds[0]}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
            key={props.peerIds[0]}
          />
        </View>
      )}
      <View style={styles.buttonBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonIcon}
          onPress={toggleAudio}>
          {props.audMute ? <MicOff /> : <MicFill />}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonIcon}
          onPress={endCallVideo}>
          <CallEnd />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonIcon}
          onPress={toggleVideo}>
          {props.vidMute ? <VideoOff /> : <VideoOn />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBar: {
    height: 50,
    backgroundColor: color.light,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  iconStyle: {
    fontSize: 34,
    paddingTop: 15,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 15,
    borderRadius: 0,
  },
  full: {
    flex: 1,
  },
  localVideo: {
    width: 150,
    height: 200,
    top: 0,
    right: 0,
    position: 'absolute',
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
