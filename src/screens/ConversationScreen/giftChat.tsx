import React, {useState, useEffect} from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {
  CustomIcon,
  HeaderCustom,
  Back,
  Video,
  InputToolBar,
} from '../../components';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import uuid from 'react-native-uuid';
import {upload, getUrl} from '../../firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {getUser} from '../../controller';
import CameraRoll from '@react-native-community/cameraroll';
import {launchCamera} from 'react-native-image-picker';
import {Slider} from 'react-native-elements';
import {
  checkPermisstionAudio,
  checkPermissionCamera,
  createKey,
  updateUser,
  callVideo,
  getAllMessage,
  getMessageLoadMore,
  sendImageChat,
  setStateVideoCall,
} from '../../controller';
import 'react-native-console-time-polyfill';
import {ROUTER} from './../../constants/router';
import {color} from '../../theme';
import {sendMessage} from '../../controller/chat';

const messagesRef = firestore().collection('conversations');

const checkPermissionPhoto = () => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }
  return PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  ).then((result) => {
    console.log('Permission result:', result);
    // @ts-ignore
    return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
  });
};

const getPhotos = (setPhotos: any) => {
  checkPermissionPhoto();
  CameraRoll.getPhotos({
    first: 100,
    assetType: 'Photos',
  })
    .then((result) => {
      setPhotos(result.edges);
    })
    .catch((error) => {
      console.log(error);
    });
};

let audio: Sound;
let valueChangeInterval: NodeJS.Timeout;

export const Chat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {ownerId, name, conversationId, avatar, flag, state} = route.params;
  const [messages, setMessages] = useState([]);
  const uid = Math.floor(Math.random() * 100) + 1;
  const [audioPath] = useState(
    `${AudioUtils.DocumentDirectoryPath}/${uuid.v4()}`,
  );
  const [user, setUser] = useState({
    avatar: null,
  });
  const [userId, setUserId] = useState('');
  const [startAudio, setStartAudio] = useState(false);
  const [photos, setPhotos] = useState('');
  const [valueText, setValueText] = useState('');
  const [pressPhotos, setPressPhotos] = useState(false);
  const [pressCamera, setPressCamera] = useState(false);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [image, setImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [timeAudio, setTimeAudio] = useState(0.0);
  const [valueSlider, setValueSlider] = useState(0);
  const [currentPlayedMessage, setCurrentPlayedMessage] = useState('');
  // @ts-ignore: Object is possibly 'null'.
  const [createdAt, setCreatedAt] = useState(Date.parse(new Date()));
  const [lengthMessage, setLengthMessage] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playAudio, setPlayAudio] = useState(false);
  const [decibels, setDecibels] = useState([{id: '1', height: 0}]);
  const [audioSettings] = useState({
    SampleRate: 22050,
    Channels: 1,
    AudioQuality: 'Low',
    AudioEncoding: 'aac',
    metering: true,
    IncludeBase64: true,
    AudioEncodingBitRate: 32000,
  });

  useEffect(() => {
    // @ts-ignore: Object is possibly 'null'.
    getUser(auth().currentUser.uid).then((result) => {
      setUser(result);
    });
    // @ts-ignore: Object is possibly 'null'.
    setUserId(auth().currentUser.uid);
  }, []);

  useEffect(() => {
    AudioRecorder.onProgress = (data: any) => {
      setCurrentTime(Math.floor(data.currentTime));
      let temp = Math.floor(data.currentMetering);
      if (temp > 0 && temp <= 500) {
        decibels.push({id: uuid.v4(), height: 5});
      }
      if (temp > 500 && temp <= 5000) {
        decibels.push({id: uuid.v4(), height: 8});
      }
      if (temp > 5000 && temp <= 10000) {
        decibels.push({id: uuid.v4(), height: 10});
      }
      if (temp > 10000 && temp <= 15000) {
        decibels.push({id: uuid.v4(), height: 13});
      }
      if (temp > 15000 && temp <= 17000) {
        decibels.push({id: uuid.v4(), height: 16});
      }
      if (temp > 17000) {
        decibels.push({id: uuid.v4(), height: 19});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAudio]);

  useEffect(() => {
    getAllMessage(
      conversationId,
      setLengthMessage,
      setMessages,
      setCreatedAt,
      setIsLoadingEarlier,
    );
    return () =>
      getAllMessage(
        conversationId,
        setLengthMessage,
        setMessages,
        setCreatedAt,
        setIsLoadingEarlier,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCamera = () => {
    checkPermissionCamera().then((result) => {
      if (!result) {
        return;
      }
      let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      launchCamera(options, (res: any) => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else {
          // @ts-ignore: Object is possibly 'null'.
          sendImageChat(conversationId, userId, res.assets[0].uri, user.avatar);
        }
      });
    });
  };

  const handleAudio = async () => {
    checkPermisstionAudio().then(async (result: any) => {
      if (!result) {
        return;
      }
      if (!startAudio) {
        setStartAudio(true);
        await AudioRecorder.prepareRecordingAtPath(audioPath, audioSettings);
        await AudioRecorder.startRecording();
      } else {
        setStartAudio(false);
        await AudioRecorder.stopRecording();
        setCurrentTime(0);
        setDecibels([{id: '0', height: 0}]);
      }
    });
  };

  const renderAudio = (props: any) => {
    return !props.currentMessage.audioV ? null : (
      <View>
        {props.currentMessage._id === currentPlayedMessage ? (
          <View
            style={[
              styles.containerAudio,
              {
                backgroundColor:
                  props.position === 'left' ? color.bgWhite : color.primary,
              },
            ]}>
            <CustomIcon
              name="pause"
              size={20}
              color="#919191"
              style={styles.iconAudio}
            />
            <Slider
              // @ts-ignore: Object is possibly 'null'.
              value={valueSlider}
              style={{width: 110, marginLeft: 5}}
              minimumValue={0}
              maximumValue={timeAudio}
              maximumTrackTintColor="#C8C8C8"
              minimumTrackTintColor="blue"
              trackStyle={{height: 3}}
              thumbStyle={{
                height: 0,
                width: 0,
                backgroundColor: '#FFFFFF',
              }}
            />
          </View>
        ) : (
          <View
            style={[
              styles.containerAudio,
              {
                backgroundColor:
                  props.position === 'left' ? '#E1E1E1' : '#6A1616',
              },
            ]}>
            <CustomIcon
              name="play"
              size={20}
              color="#FFFFFF"
              style={styles.iconAudio}
              onPress={() => {
                setPlayAudio(true);
                setCurrentPlayedMessage(props.currentMessage._id);
                audio = new Sound(props.currentMessage.audioV, '', (error) => {
                  valueChangeInterval = setInterval(() => {
                    audio.getCurrentTime((seconds, isPlaying) => {
                      if (isPlaying) {
                        setValueSlider(seconds);
                        console.log(seconds);
                      }
                      if (seconds >= audio.getDuration()) {
                        clearInterval(valueChangeInterval);
                      }
                    });
                  }, 50);
                  if (error) {
                    console.log('failed to load the sound', error);
                  }
                  // @ts-ignore: Object is possibly 'null'.
                  setTimeAudio(audio.getDuration());
                  audio.play((success) => {
                    if (success) {
                      setCurrentPlayedMessage('');
                      setPlayAudio(false);
                      console.log(success, 'success play');
                    } else {
                      Alert.alert('There was an error playing this audio');
                    }
                  });
                  setValueSlider(0.01);
                });
              }}
            />
            <Slider
              style={{width: 110, marginLeft: 5}}
              maximumTrackTintColor="#C8C8C8"
              trackStyle={{height: 3}}
              thumbStyle={{
                height: 0,
                width: 0,
                backgroundColor: '#FFFFFF',
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const handleBack = () => {
    if (flag) {
      navigation.replace(ROUTER.home);
    } else {
      navigation.goBack();
    }
  };

  const handleVideoCall = () => {
    createKey(
      '904b6f3ec0bd44ac991b9d0166cb741c',
      '0a74d4d72dc94bab83c42b611c802c8f',
      conversationId,
      uid,
    )
      .then((result) => result.json())
      .then((key) => {
        // setStateVideoCall(conversationId, true);
        updateUser({
          stateJoinCall: true,
        });
        callVideo('904b6f3ec0bd44ac991b9d0166cb741c', conversationId, ownerId);
        navigation.navigate(ROUTER.video, {
          name: name,
          avatar: avatar,
          appId: '904b6f3ec0bd44ac991b9d0166cb741c',
          channelName: conversationId,
          userId: uid,
          token: key,
        });
      });
    setStateVideoCall(conversationId, true);
  };

  const onPressAvatar = () => {
    navigation.navigate(ROUTER.profile, {userId: ownerId});
  };

  const handleSendImage = () => {
    // @ts-ignore: Object is possibly 'null'.
    sendImageChat(conversationId, userId, image, user.avatar);
    setImage(null);
  };

  const renderLoadEarlier = () => {
    return lengthMessage > 0 && isLoadingEarlier ? (
      <ActivityIndicator size="small" color="#6a1616" />
    ) : null;
  };

  const onLoadEarlier = () => {
    setIsLoadingEarlier(true);
    getMessageLoadMore(
      conversationId,
      createdAt,
      setLengthMessage,
      setCreatedAt,
      setMessages,
      setIsLoadingEarlier,
      messages,
    );
  };

  const renderBubble = (props: any) => {
    return (
      <View>
        {renderAudio(props)}
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: color.primary,
            },
            left: {
              backgroundColor: color.bgWhite,
            },
          }}
        />
      </View>
    );
  };

  const handleMic = () => {
    handleAudio();
    setPressPhotos(false);
    setPressCamera(false);
  };

  const handleBin = () => {
    handleAudio();
    setPressPhotos(false);
    setPressCamera(false);
  };

  const handleCamera = () => {
    getCamera();
    setStartAudio(false);
    setPressPhotos(false);
  };

  const handleGallery = () => {
    getPhotos(setPhotos);
    setPressPhotos(!pressPhotos);
    setPressCamera(false);
  };

  const handleSendAudio = async () => {
    handleAudio();
    var fileName = `${uuid.v4()}.aac`;
    await upload(userId, 'sound', fileName, `file://${audioPath}`, () => {
      getUrl(userId, 'sound', fileName).then((result) => {
        messagesRef
          .doc(conversationId)
          .collection('messages')
          .add({
            messageType: 'audio',
            audioV: result,
            text: '',
            createdAt: new Date().getTime(),
            user: {
              _id: userId,
              avatar: user.avatar,
            },
          });
      });
    });
  };

  const onSendMessage = (message: any) => {
    sendMessage(
      conversationId,
      message,
      userId,
      // @ts-ignore: Object is possibly 'null'.
      user.avatar,
      ownerId,
      // @ts-ignore: Object is possibly 'null'.
      messages[0]?.user._id,
      state,
    );
    setValueText('');
  };

  const renderInputToolBar = () => {
    return (
      <InputToolBar
        currentTime={currentTime}
        startAudio={startAudio}
        pressCamera={pressCamera}
        pressPhotos={pressPhotos}
        valueText={valueText}
        decibels={decibels}
        setValueText={setValueText}
        setCurrentTime={setCurrentTime}
        onSendMessage={() => onSendMessage(valueText)}
        onPressMic={handleMic}
        onPressBin={handleBin}
        onPressCamera={handleCamera}
        onPressGallery={handleGallery}
        onPressSendAudio={handleSendAudio}
      />
    );
  };

  return (
    <View style={styles.containerAll}>
      <HeaderCustom
        leftComponent={
          <TouchableOpacity onPress={handleBack}>
            <Back />
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity onPress={handleVideoCall}>
            <Video />
          </TouchableOpacity>
        }
        centerComponent={
          <View style={styles.headerName}>
            <TouchableOpacity
              style={styles.avatar}
              activeOpacity={0.5}
              onPress={onPressAvatar}>
              <Image style={styles.avatar} source={{uri: avatar}} />
            </TouchableOpacity>
            <Text style={styles.textName}>{name}</Text>
          </View>
        }
      />
      <View style={styles.containerGiftChat}>
        <GiftedChat
          renderTime={() => {
            return <View style={{height: 0, width: 0}} />;
          }}
          messages={messages}
          messageIdGenerator={() => uuid.v4()}
          renderInputToolbar={renderInputToolBar}
          renderBubble={renderBubble}
          loadEarlier={true}
          onLoadEarlier={onLoadEarlier}
          isLoadingEarlier={isLoadingEarlier}
          infiniteScroll={true}
          renderLoadEarlier={renderLoadEarlier}
          user={{
            _id: userId,
            // @ts-ignore: Object is possibly 'null'.
            avatar: user.avatar,
          }}
          onPressAvatar={onPressAvatar}
        />
      </View>
      {pressPhotos ? (
        <FlatList
          // @ts-ignore: Object is possibly 'null'.
          data={photos}
          numColumns={3}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.buttonFlatlist}
              activeOpacity={0.6}
              onPress={() => {
                setImage(item.node.image.uri);
              }}>
              <Image
                style={styles.imageFlatlist}
                source={{uri: item.node.image.uri}}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.node.image.uri}
          columnWrapperStyle={styles.row}
          style={styles.flatlist}
        />
      ) : null}
      {image && (
        <TouchableOpacity
          style={styles.buttonSend}
          onPress={handleSendImage}
          activeOpacity={0.6}>
          <Text style={styles.textButtonSend}>Send</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginRight: 5,
  },
  headerName: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textName: {
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
  },
  containerGiftChat: {
    flex: 2,
  },
  flatlist: {
    flex: 1,
    paddingHorizontal: 2,
  },
  buttonFlatlist: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  imageFlatlist: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  inputToolbar: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: color.textGray,
    backgroundColor: color.bgWhite,
  },
  textInput: {
    marginLeft: 5,
    flex: 2,
    alignSelf: 'center',
    fontSize: 16,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
    margin: 1,
  },
  icon: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  buttonSend: {
    width: 150,
    height: 50,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
    backgroundColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textButtonSend: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#FFFFFF',
  },
  containerWaveSound: {
    flex: 1,
    height: 35,
    backgroundColor: '#6A1616',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'center',
  },
  textTime: {
    flex: 0.2,
    alignSelf: 'center',
    color: '#FFFFFF',
  },
  wave: {
    flex: 4,
    marginLeft: 3,
    marginRight: 8,
    flexDirection: 'row',
  },
  chilWave: {
    alignSelf: 'center',
    width: 2,
    marginLeft: 1,
    backgroundColor: '#FFFFFF',
  },
  containerAudio: {
    height: 30,
    width: 150,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconAudio: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    backgroundColor: 'transparent',
    marginLeft: 5,
  },
  textTimeAudio: {
    color: '#FFFFFF',
  },
});
