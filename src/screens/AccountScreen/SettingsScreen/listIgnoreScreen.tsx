import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  StatusBarCustom,
  Header,
  HeaderCustom,
  Back,
  OptionsGroup,
  Info,
  Hobbies,
  ProfileContainer,
  ImagesContainer,
} from '../../../components';
import {
  getListIgnore,
  computeAge,
  getUserRandom,
  likeUserIgnored,
  ignoreUserIgnored,
  superLikeUserIgnored,
  sendNotification,
  uploadCoordinates,
} from '../../../controller';
import auth from '@react-native-firebase/auth';
import {color, spacing} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const ListIgnoreScreen = () => {
  const navigation = useNavigation();
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
  const [showInfo, setShowInfo] = useState(false);
  const [coordinate, setCoordinate] = useState({
    lat: 0,
    long: 0,
  });
  const [status, setStatus] = useState(0);
  const [user, setUser] = useState(User);
  const [load, setLoad] = useState(false);
  const ref_scroll = useRef(null);

  const loadData = async (isMounted: boolean) => {
    await getListIgnore().then(async (result) => {
      if (isMounted) {
        if (result.status === 200) {
          setUser(getUserRandom(await result.json()));
          setStatus(await result.status);
        } else {
          setUser(User);
          setStatus(await result.status);
        }
      }
    });
  };

  const ignoreUser = async () => {
    await ignoreUserIgnored(user.userId);
    setLoad(!load);
  };

  const starUser = async () => {
    await superLikeUserIgnored(user.userId);
    setLoad(!load);
  };

  const likeUser = async () => {
    await likeUserIgnored(user.userId);
    // @ts-ignore: Object is possibly 'null'.
    sendNotification(user.userId, auth().currentUser?.uid);
    setLoad(!load);
  };

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
      ref_scroll.current.scrollTo({x: 0, y: HEIGHT - 50, animated: true});
    }
  }, [showInfo]);
  return status === 200 ? (
    <View style={styles.wrap}>
      <ScrollView
        ref={ref_scroll}
        style={{width: WIDTH, height: HEIGHT}}
        contentContainerStyle={{
          paddingBottom: showInfo ? 70 : 0,
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
              navigation.goBack();
            }}>
            <Back color={color.bgWhite} />
          </Pressable>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', '#000000']}
            locations={[0.5323, 0.993]}
            style={[styles.image, {paddingBottom: 70}]}>
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
      <OptionsGroup
        onPressIgnore={ignoreUser}
        onPressSupperLike={starUser}
        onPressLike={likeUser}
      />
    </View>
  ) : (
    <View style={styles.containerAll}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="List Ignore"
        leftComponent={
          <Pressable onPress={() => navigation.goBack()}>
            <Back />
          </Pressable>
        }
      />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Don't have list ignore</Text>
      </View>
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
    backgroundColor: color.bgWhite,
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
  modalFilter: {
    flex: 1,
    margin: 0,
  },
  modalMenu: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  interactiveContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
    position: 'absolute',
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
  },
  buttonIcon: {
    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.2,
  },
  headerContainer: {
    width: '100%',
    height: 45,
    backgroundColor: '#F8F8F8',
  },
  header: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#C8C8C8',
  },
  avatar: {
    height: 400,
    width: '100%',
    resizeMode: 'cover',
  },
  informationContainer: {
    flex: 1,
    marginTop: 16,
    paddingBottom: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  firstContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginTop: 5,
  },
  font26: {
    fontSize: 26,
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  font17: {
    fontSize: 17,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  buttonModal: {
    backgroundColor: '#F8F8F8',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  textButtonModal: {
    flex: 2,
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
