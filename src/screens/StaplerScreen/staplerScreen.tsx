import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  Filter,
  Hobbies,
  Info,
  NotUser,
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
  sendNotification,
  uploadCoordinates,
} from '../../controller';
import {HeaderCustom} from '../../components';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {spacing, color} from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import {ROUTER} from '../../constants';

const saveTokenToDatabase = async (token: string) => {
  const userId = auth().currentUser?.uid;
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });
};

const searching_default = require('../../../assets/images/searching_default.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

interface IUser {
  userId: string;
  name: string;
  birthday: string;
  gender: string;
  avatar: string;
  email: string;
  intro: string;
  lookingFor: string;
  height: string;
  university: string;
  drinking: string;
  smoking: string;
  kids: string;
  province: string;
  coordinates: string;
  images: Array<string>;
  hobbies: Array<{id: number; value: string}>;
}

interface TFilter {
  gender: string;
  lookingFor: string;
  drinking: string;
  smoking: string;
  kids: string;
  distance: number;
  age: {from: number; to: number};
}

type TRouteProps = {
  Filter: {
    filter: TFilter;
  };
};

export const StaplerScreen = () => {
  const route = useRoute<RouteProp<TRouteProps, 'Filter'>>();
  const navigation = useNavigation();
  const [searching, setSearching] = useState(true);
  const tabBarHeight = useBottomTabBarHeight();
  const [filter] = useState({
    gender: '',
    lookingFor: '',
    drinking: '',
    smoking: '',
    kids: '',
    distance: 10,
    age: {
      from: 18,
      to: 40,
    },
  });
  const [user, setUser] = useState<IUser>({
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
  });
  const [listUsers, setListUsers] = useState([]);
  const [load, setLoad] = useState(true);
  const [loadButton, setLoadButton] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [coordinate, setCoordinate] = useState({
    lat: 0,
    long: 0,
  });
  const ref_scroll = useRef(null);

  const loadData = () => {
    setUser(getUserRandom(listUsers));
  };

  const handleBlock = () => {
    setLoadButton(true);
    blockUser(user.userId);
    setLoad(!load);
    setLoadButton(false);
  };

  const handleLike = async () => {
    loadData();
    await likeUser(user.userId);
    // @ts-ignore: Object is possibly 'null'.
    sendNotification(user.userId, auth().currentUser?.uid);
    setLoad(!load);
  };

  const handleDisLike = async () => {
    loadData();
    await ignoreUser(user.userId);
    setLoad(!load);
  };

  const handleSupperLike = async () => {
    loadData();
    await superLikeUser(user.userId);
    setLoad(!load);
  };

  const handleFilter = () => {
    navigation.navigate(ROUTER.filter, {
      filter: route.params?.filter ?? filter,
    });
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
    getAvailableUsers(filter).then((result) => {
      setListUsers(result);
      setUser(getUserRandom(result));
      setSearching(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSearching(true);
    if (route.params?.filter) {
      getAvailableUsers(route.params?.filter).then((result) => {
        setListUsers(result);
        setUser(getUserRandom(result));
        setSearching(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.filter]);

  useEffect(() => {
    if (showInfo) {
      // @ts-ignore: Object is possibly 'null'.
      ref_scroll.current.scrollTo({x: 0, y: HEIGHT - 50, animated: true});
    }
  }, [showInfo]);

  return (
    <View style={styles.wrap}>
      {searching && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{width: 200, height: 200}}
            resizeMode="contain"
            source={searching_default}
          />
        </View>
      )}
      {user?.name ? (
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
                  <Pressable
                    onPress={() => {
                      setShowInfo(!showInfo);
                    }}>
                    <Info />
                  </Pressable>
                </View>
                <Hobbies data={user.hobbies} />
                <Pressable style={styles.iconFilter} onPress={handleFilter}>
                  <Filter />
                </Pressable>
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
    backgroundColor: color.bgWhite,
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
  iconFilter: {
    position: 'absolute',
    right: 10,
    top: 0,
  },
});
