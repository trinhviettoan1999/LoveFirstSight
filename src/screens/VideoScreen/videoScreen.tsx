import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  PermissionsAndroid,
  Text,
} from 'react-native';
import {RouteStackParamList} from '../../components';

import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

export default function VideoScreen({
  navigation,
}: RouteStackParamList<'InitScreen'>) {
  const [props, setProps] = useState({
    peerIds: [],
    appId: '904b6f3ec0bd44ac991b9d0166cb741c',
    channelName: 'VietToan',
    token:
      '006904b6f3ec0bd44ac991b9d0166cb741cIADMUIxlzlXQdIjWuo0dtJWezW1osqCNL2+epw+mN2B5Pqn2Jm0AAAAAEAC74Hh621dwYAEAAQDbV3Bg',
    vidMute: false,
    audMute: false,
    joinSucceed: false,
  });

  async function init() {
    engine = await RtcEngine.create(props.appId);
    await engine.enableVideo(); //Enable the audio
    engine.addListener('UserJoined', (uid: number) => {
      // @ts-ignore: Object is possibly 'null'.
      if (props.peerIds.indexOf(uid) === -1) {
        // @ts-ignore: Object is possibly 'null'.
        setProps({...props, peerIds: [...props.peerIds, uid]});
      }
    });
    engine.addListener('UserOffline', (uid: number) => {
      setProps({
        ...props,
        peerIds: props.peerIds.filter((result) => result !== uid),
      });
    });
    engine.addListener('JoinChannelSuccess', () => {
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
    engine.leaveChannel();
    setProps({...props, peerIds: [], joinSucceed: false});
  }
  async function join() {
    await engine.joinChannel(props.token, props.channelName, null, 0);
  }
  useEffect(() => {
    requestCameraAndAudioPermission().then((result) => console.log(result));
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.full}>
      {props.joinSucceed && !props.vidMute && (
        <RtcLocalView.SurfaceView
          style={{
            width: 150,
            height: 200,
            top: 0,
            right: 0,
            position: 'absolute',
          }}
          channelId={props.channelName}
          renderMode={VideoRenderMode.Hidden}
        />
      )}
      {props.peerIds.length > 0 && (
        <RtcRemoteView.SurfaceView
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
          uid={props.peerIds[0]}
          channelId={props.channelName}
          renderMode={VideoRenderMode.Hidden}
          key={props.peerIds[0]}
        />
      )}
      <View style={styles.buttonBar}>
        <Icon.Button
          style={styles.iconStyle}
          backgroundColor="#0093E9"
          name={props.audMute ? 'mic-off' : 'mic'}
          onPress={endCall}
        />
        <Icon.Button
          style={styles.iconStyle}
          backgroundColor="#0093E9"
          name="call-end"
          onPress={join}
        />
        <Icon.Button
          style={styles.iconStyle}
          backgroundColor="#0093E9"
          name={props.vidMute ? 'videocam-off' : 'videocam'}
          onPress={toggleVideo}
        />
      </View>
    </View>
  );
}

let dimensions = {
  //get dimensions of the device to use in view styles
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const styles = StyleSheet.create({
  buttonBar: {
    height: 50,
    backgroundColor: '#0093E9',
    display: 'flex',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
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
});
