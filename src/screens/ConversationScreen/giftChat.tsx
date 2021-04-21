import React, {useState, useEffect, useRef} from 'react';
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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {
  Header,
  StatusBarCustom,
  RouteStackParamList,
  CustomIcon,
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
  likeUser,
  updateStateConversation,
  createKey,
  setStateVideoCall,
  getStateVideoCall,
  checkUserInCall,
  updateUser,
} from '../../controller';
import 'react-native-console-time-polyfill';
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

const sendNotification = async (
  ownerId: string,
  userId: string,
  message: string,
  conversationId: string,
) => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/notification/message/' +
      ownerId +
      '/' +
      userId +
      '/' +
      message +
      '/' +
      conversationId,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json());
};

const getAudioTimeString = (seconds: any) => {
  const m = parseInt(((seconds % (60 * 60)) / 60).toString());
  const s = parseInt((seconds % 60).toString());
  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
};

let audio: Sound;
let valueChangeInterval: NodeJS.Timeout;
const Chat = ({route, navigation}: RouteStackParamList<'InitScreen'>) => {
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
  const flatListWave = useRef(null);
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
    checkUserInCall(ownerId, (isUserCalling: any) => {
      getStateVideoCall(conversationId, (result: any) => {
        if (result && isUserCalling) {
          navigation.navigate('IncomingCallScreen', {
            name: name,
            avatar: avatar,
            appId: '904b6f3ec0bd44ac991b9d0166cb741c',
            channelName: conversationId,
            userId: uid,
          });
        }
      });
    });
  }, []);
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
      // decibels.push({id: uuid.v4(), value: temp});
      console.log(temp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAudio]);

  // useEffect(() => {
  //   console.log('OK');
  //   valueChangeInterval = setInterval(() => {
  //     if (audio) {
  //       audio.getCurrentTime((seconds) => {
  //         console.log(seconds);
  //         setValueSlider(seconds);
  //       });
  //     }
  //   }, 100);
  // }, []);
  // useEffect(() => {
  //   console.log('Vô');
  //   if (valueSlider > 6) {
  //     clearInterval(valueChangeInterval);
  //   }
  // }, [valueSlider]);

  // useEffect(() => {
  //   let isMounted = true;
  //   if (audio) {
  //     audio.getCurrentTime((seconds) => {
  //       if (isMounted) {
  //         console.log(seconds);
  //         setValueSlider(seconds);
  //       }
  //     });
  //   }
  //   if (!playAudio) {
  //     isMounted = false;
  //     console.log('OK');
  //     setValueSlider(0);
  //   }
  //   console.log('re-render because x changed:', valueSlider);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [valueSlider]);
  useEffect(() => {
    const unsubscribe = messagesRef
      .doc(conversationId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        }) as any;
        setLengthMessage(threads.length);
        setMessages(threads);
        if (threads.length > 0) {
          setCreatedAt(threads[threads.length - 1].createdAt);
        }
        setIsLoadingEarlier(false);
      });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getMesssages = () => {
    messagesRef
      .doc(conversationId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .where('createdAt', '<', createdAt)
      .limit(20)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        }) as any;
        setLengthMessage(threads.length);
        if (threads.length > 0) {
          setCreatedAt(threads[threads.length - 1].createdAt);
          setMessages(GiftedChat.prepend(messages, threads));
          setIsLoadingEarlier(false);
        }
      });
  };

  async function onSendMessage(message: any) {
    await messagesRef
      .doc(conversationId)
      .collection('messages')
      .add({
        messageType: 'text',
        text: message,
        createdAt: new Date().getTime(),
        user: {
          _id: userId,
          avatar: user.avatar,
        },
      })
      .then(async () => {
        sendNotification(ownerId, userId, message, conversationId);
        // @ts-ignore: Object is possibly 'null'.
        if (state && messages[0].user._id !== auth().currentUser?.uid) {
          await likeUser(ownerId);
          await updateStateConversation(conversationId).then((res) =>
            console.log(res),
          );
        }
      });
  }

  const onLoadEarlier = () => {
    setIsLoadingEarlier(true);
    getMesssages();
  };

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
          var fileName = `${uuid.v4()}.png`;
          upload(userId, 'imagesMessages', fileName, res.uri, () => {
            getUrl(userId, 'imagesMessages', fileName).then((result) => {
              messagesRef
                .doc(conversationId)
                .collection('messages')
                .add({
                  messageType: 'image',
                  image: result,
                  text: '',
                  createdAt: new Date().getTime(),
                  user: {
                    _id: userId,
                    avatar: user.avatar,
                  },
                });
            });
          });
        }
      });
    });
  };

  const sendImage = async () => {
    var fileName = `${uuid.v4()}.png`;
    // @ts-ignore: Object is possibly 'null'.
    await upload(userId, 'imagesMessages', fileName, image, () => {
      getUrl(userId, 'imagesMessages', fileName).then((result) => {
        messagesRef
          .doc(conversationId)
          .collection('messages')
          .add({
            messageType: 'image',
            image: result,
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
                  props.position === 'left' ? '#E1E1E1' : '#6A1616',
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
  const renderBubble = (props: any) => {
    return (
      <View>
        {renderAudio(props)}
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#6A1616',
            },
            left: {
              backgroundColor: '#E1E1E1',
            },
          }}
        />
      </View>
    );
  };

  const renderLoadEarlier = () => {
    return lengthMessage > 0 && isLoadingEarlier ? (
      <ActivityIndicator size="small" color="#6a1616" />
    ) : null;
  };

  const renderInputToolBar = () => {
    return (
      <View style={styles.inputToolbar}>
        {!startAudio ? (
          <TouchableOpacity
            style={styles.icon}
            activeOpacity={0.9}
            onPress={() => {
              handleAudio();
              setPressPhotos(false);
              setPressCamera(false);
            }}>
            <CustomIcon
              name="mic"
              size={23}
              color={pressCamera || pressPhotos ? '#919191' : '#6A1616'}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.icon, {marginLeft: 10}]}
            activeOpacity={0.9}
            onPress={() => {
              handleAudio();
              setPressPhotos(false);
              setPressCamera(false);
            }}>
            <CustomIcon
              name="bin"
              size={25}
              color={pressCamera || pressPhotos ? '#919191' : '#6A1616'}
            />
          </TouchableOpacity>
        )}
        {!startAudio ? (
          <TouchableOpacity
            style={styles.icon}
            activeOpacity={0.9}
            onPress={() => {
              getCamera();
              setStartAudio(false);
              setPressPhotos(false);
            }}>
            <CustomIcon
              name="camera"
              size={22}
              color={startAudio || pressPhotos ? '#919191' : '#6A1616'}
            />
          </TouchableOpacity>
        ) : null}
        {!startAudio ? (
          <TouchableOpacity
            style={styles.icon}
            activeOpacity={0.9}
            onPress={() => {
              getPhotos(setPhotos);
              setPressPhotos(!pressPhotos);
              setPressCamera(false);
            }}>
            <CustomIcon
              name="gallerry"
              size={21}
              color={startAudio || pressCamera ? '#919191' : '#6A1616'}
            />
          </TouchableOpacity>
        ) : null}
        {!startAudio ? (
          <TextInput
            style={styles.textInput}
            value={valueText}
            onChangeText={(text) => {
              setValueText(text);
            }}
            multiline={true}
            placeholder="Type a message..."
          />
        ) : (
          <View style={styles.containerWaveSound}>
            <FlatList
              ref={flatListWave}
              data={decibels}
              renderItem={({item}) => (
                <View style={[styles.chilWave, {height: item.height}]} />
              )}
              horizontal
              keyExtractor={(item) => item.id}
              style={styles.wave}
              showsHorizontalScrollIndicator={false}
              onContentSizeChange={() => {
                // @ts-ignore: Object is possibly 'null'.
                flatListWave.current.scrollToEnd({animated: true});
              }}
              onLayout={() => {
                // @ts-ignore: Object is possibly 'null'.
                flatListWave.current.scrollToEnd({animated: true});
              }}
            />
            <Text style={styles.textTime}>
              {getAudioTimeString(currentTime)}
            </Text>
          </View>
        )}
        {valueText ? (
          <TouchableOpacity
            style={[
              styles.icon,
              {
                marginRight: 16,
                width: 30,
                alignItems: 'flex-end',
              },
            ]}
            activeOpacity={0.9}
            onPress={() => {
              onSendMessage(valueText);
              setValueText('');
            }}>
            <CustomIcon name="send" size={20} color="#6A1616" />
          </TouchableOpacity>
        ) : null}
        {startAudio ? (
          <TouchableOpacity
            style={[styles.icon, {marginRight: 16}]}
            activeOpacity={0.9}
            onPress={async () => {
              handleAudio();
              var fileName = `${uuid.v4()}.aac`;
              await upload(
                userId,
                'sound',
                fileName,
                `file://${audioPath}`,
                () => {
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
                },
              );
            }}>
            <CustomIcon name="send-message" size={25} color="#6A1616" />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <View style={styles.containerGiftChat}>
        <Header
          showAvatar={true}
          avatarUri={avatar}
          onPressAvatar={() => {
            navigation.navigate('ProfileScreen', {userId: ownerId});
          }}
          title={name}
          showIconLeft={true}
          iconNameLeft="back"
          onPressLeft={() => {
            if (flag) {
              navigation.replace('StaplerScreen');
            } else {
              navigation.goBack();
            }
          }}
          showIconRight={true}
          iconNameRight="video"
          onPressRight={() => {
            createKey(
              '904b6f3ec0bd44ac991b9d0166cb741c',
              '0a74d4d72dc94bab83c42b611c802c8f',
              conversationId,
              uid,
            )
              .then((result) => result.json())
              .then((key) => {
                setStateVideoCall(conversationId, true);
                updateUser({
                  stateJoinCall: true,
                });
                navigation.navigate('VideoScreen', {
                  name: name,
                  avatar: avatar,
                  appId: '904b6f3ec0bd44ac991b9d0166cb741c',
                  channelName: conversationId,
                  userId: uid,
                  token: key,
                });
              });
          }}
        />
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
          onPressAvatar={() => {
            navigation.navigate('ProfileScreen', {userId: ownerId});
          }}
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
      {image ? (
        <TouchableOpacity
          style={styles.buttonSend}
          onPress={() => {
            sendImage();
            setImage(null);
          }}
          activeOpacity={0.6}>
          <Text style={styles.textButtonSend}>Send</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
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
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
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
    backgroundColor: '#6A1616',
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

export default Chat;
