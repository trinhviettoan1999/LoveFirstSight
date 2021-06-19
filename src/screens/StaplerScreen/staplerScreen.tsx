import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  Filter,
  Hobbies,
  Info,
  NotUser,
  Loading,
  ProfileContainer,
  ImagesContainer,
  OptionsGroup,
  ButtonCustom,
} from '../../components';
import {
  likeUser,
  ignoreUser,
  superLikeUser,
  getAvailableUsers,
  computeAge,
  getUserRandom,
  blockUser,
  sendMessageRequest,
  sendNotification,
  uploadCoordinates,
} from '../../controller';
import {HeaderCustom} from '../../components';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {spacing, color} from '../../theme';
import {ROUTER} from '../../constants/router';
import LinearGradient from 'react-native-linear-gradient';

const saveTokenToDatabase = async (token: string) => {
  const userId = auth().currentUser?.uid;
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });
};

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

// interface User {
//   userId: string;
//   name: string;
//   birthday: string;
//   gender: string;
//   avatar?: string;
//   email: string;
//   intro: string;
//   lookingFor: string;
//   height: string;
//   university: string;
//   drinking: string;
//   smoking: string;
//   kids: string;
//   province: string;
//   coordinates: string;
//   images: Array<string>;
//   hobbies: Array<{id: number; value: string}>;
// }

export const StaplerScreen = () => {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const User = {
    userId: '',
    name: '',
    birthday: '',
    gender: '',
    avatar: '',
    email: '',
    intro: '',
    lookingFor: '',
    height: '',
    university: '',
    drinking: '',
    smoking: '',
    kids: '',
    province: '',
    coordinates: '',
    images: ['', '', '', '', '', '', '', ''],
    hobbies: [],
  };
  const [filter, setFilter] = useState({
    gender: '',
    lookingFor: '',
    drinking: '',
    smoking: '',
    kids: '',
    province: '',
    university: '',
    height: '',
    distance: 10,
    age: {
      from: 18,
      to: 40,
    },
  });
  const [isModalVisibleMenu, setIsModalVisibleMenu] = useState(false);
  const [user, setUser] = useState(User);
  const [load, setLoad] = useState(true);
  const [loadButton, setLoadButton] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [coordinate, setCoordinate] = useState({
    lat: 0,
    long: 0,
  });
  const ref_scroll = useRef(null);

  async function loadData(isMounted: boolean) {
    // setIsModalVisibleLoading(true);
    await getAvailableUsers(filter).then(async (result) => {
      if (isMounted) {
        setUser(getUserRandom(result));
        setLoad(false);
      }
    });
  }

  const handleYesAlert = () => {
    sendMessageRequest(user.userId).then((conversationId) => {
      setLoad(!load);
      navigation.navigate('Chat', {
        name: user.name,
        avatar: user.avatar,
        conversationId: conversationId,
        ownerId: user.userId,
        state: true,
      });
    });
  };

  const handleBlock = () => {
    setLoadButton(true);
    blockUser(user.userId);
    setLoad(!load);
    setLoadButton(false);
  };

  const handleLike = async () => {
    await likeUser(user.userId);
    // @ts-ignore: Object is possibly 'null'.
    sendNotification(user.userId, auth().currentUser?.uid);
    setLoad(!load);
  };

  const handleDisLike = async () => {
    await ignoreUser(user.userId);
    setLoad(!load);
  };

  const handleSupperLike = async () => {
    await superLikeUser(user.userId);
    setLoad(!load);
  };

  useEffect(() => {
    //get token device
    messaging()
      .getToken()
      .then((token) => {
        return saveTokenToDatabase(token);
      });
    //Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      saveTokenToDatabase(token);
    });
  }, []);

  useEffect(() => {
    uploadCoordinates(setCoordinate);
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadData(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  useEffect(() => {
    if (showInfo) {
      // @ts-ignore: Object is possibly 'null'.
      ref_scroll.current.scrollTo({x: 0, y: HEIGHT, animated: true});
    }
  }, [showInfo]);

  return (
    <View style={styles.wrap}>
      {load && <Loading />}
      {user?.name && !load ? (
        <View>
          <ScrollView
            ref={ref_scroll}
            style={{width: WIDTH, height: HEIGHT - tabBarHeight}}
            contentContainerStyle={{paddingBottom: showInfo ? 70 : 0}}>
            <ImageBackground
              source={{uri: user.avatar || undefined}}
              style={styles.containerAll}
              resizeMode="cover">
              <HeaderCustom
                backgroundStatusBar={color.transparent}
                removeBorderWidth
                barStyle="light-content"
              />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0)', '#000000']}
                locations={[0.5323, 0.993]}
                style={styles.image}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.name}>
                    {`${user.name}  ${computeAge(user.birthday)}`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowInfo(!showInfo);
                    }}>
                    <Info />
                  </TouchableOpacity>
                </View>
                <Hobbies data={user.hobbies} />
              </LinearGradient>
            </ImageBackground>
            {showInfo && (
              <View>
                <ProfileContainer user={user} coordinate={coordinate} />
                <ImagesContainer images={user.images} />
                <ButtonCustom
                  loading={loadButton}
                  title="Block User"
                  buttonStyle={styles.button}
                  onPress={handleBlock}
                />
              </View>
            )}
          </ScrollView>
          <OptionsGroup
            onPressIgnore={handleDisLike}
            onPressSupperLike={handleSupperLike}
            onPressLike={handleLike}
          />
        </View>
      ) : null}
      {!user?.name && !load && <NotUser />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  containerAll: {
    width: '100%',
    height: HEIGHT - 49,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 70,
    paddingHorizontal: spacing[4],
  },
  name: {
    marginBottom: spacing[4],
    marginRight: spacing[2],
    color: color.bgWhite,
    lineHeight: 27,
    fontWeight: '700',
    fontSize: 25,
  },
  button: {
    alignSelf: 'center',
    minHeight: 50,
    borderRadius: spacing[2],
    width: WIDTH - 32,
    backgroundColor: color.primary,
    marginTop: spacing[4],
  },
});
