import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Loading,
  HeaderCustom,
  NotUser,
  OptionsGroup,
  ProfileContainer,
  ImagesContainer,
  Hobbies,
  Info,
  Back,
} from '../../components';
import auth from '@react-native-firebase/auth';
import {
  likeUser,
  ignoreUser,
  superLikeUser,
  computeAge,
  getUser,
  uploadCoordinates,
  sendNotification,
} from '../../controller';
import LinearGradient from 'react-native-linear-gradient';
import {color, spacing} from '../../theme';
import {ROUTER} from '../../constants/router';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
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
  const [user, setUser] = useState(User);
  const [isMatched, setIsMatched] = useState(-1);
  const [load, setLoad] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [coordinate, setCoordinate] = useState({
    lat: 0,
    long: 0,
  });
  const ref_scroll = useRef(null);

  const loadData = async () => {
    setLoad(true);
    const result = await getUser(route.params.userId);
    if (result) {
      setUser(result);
      setIsMatched(result.availableUsers.indexOf(auth().currentUser?.uid));
    }
    setLoad(false);
  };

  useEffect(() => {
    uploadCoordinates(setCoordinate);
  }, []);

  useEffect(() => {
    loadData();
    return () => {
      loadData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showInfo) {
      // @ts-ignore: Object is possibly 'null'.
      ref_scroll.current.scrollTo({x: 0, y: HEIGHT - 50, animated: true});
    }
  }, [showInfo]);

  return (
    <View style={styles.wrap}>
      {load && <Loading />}
      {user?.name && !load ? (
        <View>
          <ScrollView
            ref={ref_scroll}
            style={{width: WIDTH, height: HEIGHT}}
            contentContainerStyle={{
              paddingBottom: showInfo ? (isMatched > -1 ? 70 : spacing[4]) : 0,
            }}>
            <ImageBackground
              source={{uri: user.avatar || undefined}}
              style={styles.containerAll}
              resizeMode="cover">
              <HeaderCustom
                backgroundStatusBar={color.transparent}
                removeBorderWidth
                barStyle="light-content"
              />
              <Pressable
                style={styles.back}
                onPress={() => {
                  if (route.params.flag) {
                    navigation.replace(ROUTER.home);
                  } else {
                    navigation.goBack();
                  }
                }}>
                <Back color={color.bgWhite} />
              </Pressable>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0)', '#000000']}
                locations={[0.5323, 0.993]}
                style={[
                  styles.image,
                  {paddingBottom: isMatched > -1 ? 70 : spacing[4]},
                ]}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.name}>
                    {`${user.name}  ${computeAge(user.birthday)}`}
                  </Text>
                  <Pressable onPress={() => setShowInfo(!showInfo)}>
                    <Info />
                  </Pressable>
                </View>
                <Hobbies data={user.hobbies} />
              </LinearGradient>
            </ImageBackground>
            {showInfo && (
              <View>
                <ProfileContainer user={user} coordinate={coordinate} />
                <ImagesContainer images={user.images} />
              </View>
            )}
          </ScrollView>
          {isMatched > -1 && (
            <OptionsGroup
              onPressIgnore={async () => {
                await ignoreUser(route.params.userId);
                if (route.params.flag) {
                  navigation.replace(ROUTER.home);
                } else {
                  navigation.goBack();
                }
              }}
              onPressSupperLike={async () => {
                await superLikeUser(route.params.userId);
                if (route.params.flag) {
                  navigation.replace(ROUTER.home);
                } else {
                  navigation.goBack();
                }
              }}
              onPressLike={async () => {
                await likeUser(route.params.userId);
                // @ts-ignore: Object is possibly 'null'.
                sendNotification(route.params.userId, auth().currentUser?.uid);
                if (route.params.flag) {
                  navigation.replace(ROUTER.home);
                } else {
                  navigation.goBack();
                }
              }}
            />
          )}
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
    height: HEIGHT,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
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
  back: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    width: 30,
    height: 30,
    position: 'absolute',
    top: 40,
    left: 16,
  },
});
