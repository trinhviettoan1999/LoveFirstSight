import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  ImageBackground,
  Text,
  TouchableOpacity,
} from 'react-native';
import {updateUser} from '../../controller';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

const requestCameraAndAudioPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the cameras & mic');
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

var engine: RtcEngine;
let sound: Sound;
const nhachuong = require('../../../assets/sounds/chuongdienthoai.mp3');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const VideoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {appId, channelName, token, avatar, name, userId} = route.params;
  const [props, setProps] = useState({
    peerIds: [],
    vidMute: false,
    audMute: false,
    joinSucceed: false,
  });

  async function init() {
    console.log('1');
    sound = new Sound(nhachuong);
    sound.setNumberOfLoops(-1);
    sound.setVolume(1);
    engine = await RtcEngine.create(appId);
    await engine.enableVideo(); //Enable the audio
    await engine.joinChannel(token, channelName, null, userId);
    engine.addListener('UserJoined', (uid: number) => {
      // @ts-ignore: Object is possibly 'null'.
      if (props.peerIds.indexOf(uid) === -1) {
        sound.stop();
        // @ts-ignore: Object is possibly 'null'.
        setProps({...props, peerIds: [...props.peerIds, uid]});
      }
    });
    engine.addListener('UserOffline', (uid: number) => {
      setProps({
        ...props,
        peerIds: props.peerIds.filter((result) => result !== uid),
      });
      engine.leaveChannel();
      navigation.goBack();
    });
    engine.addListener('JoinChannelSuccess', () => {
      sound.play();
      setProps({...props, joinSucceed: true});
    });
    engine.addListener('Error', (errorCode) => {
      console.info('Error', errorCode);
    });
  }

  function toggleAudio() {
    engine.muteLocalAudioStream(!props.audMute);
    setProps({...props, audMute: !props.audMute});
  }

  function toggleVideo() {
    engine.muteLocalVideoStream(!props.vidMute);
    setProps({...props, vidMute: !props.vidMute});
  }

  function endCall() {
    sound.stop();
    engine.leaveChannel();
    updateUser({
      stateJoinCall: false,
    });
    setProps({...props, peerIds: [], joinSucceed: false});
    navigation.goBack();
  }

  useEffect(() => {});

  useEffect(() => {
    requestCameraAndAudioPermission();
    init();
    return () => {
      requestCameraAndAudioPermission();
      init();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.full} edges={['bottom']}>
      {props.peerIds.length === 0 && (
        <ImageBackground
          style={styles.image}
          source={{uri: avatar}}
          resizeMode="cover">
          <Text style={styles.textName}>Calling to {name}...</Text>
        </ImageBackground>
      )}
      {props.peerIds.length > 0 && (
        <View
          style={{
            width: WIDTH,
            height: HEIGHT,
          }}>
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
          onPress={endCall}>
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
    bottom: 20,
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
