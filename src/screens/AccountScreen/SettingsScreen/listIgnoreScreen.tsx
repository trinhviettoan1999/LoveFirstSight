import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
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
const PEOPLE_DEFAULT = require('../../../../assets/images/people1_default.png');

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
  const [user, setUser] = useState(User);
  const [load, setLoad] = useState(true);
  const ref_scroll = useRef(null);

  const loadData = async () => {
    getListIgnore().then(async (result) => {
      setUser(getUserRandom(await result.json()));
      setLoad(false);
    });
  };

  const ignoreUser = async () => {
    await ignoreUserIgnored(user.userId);
    setLoad(true);
    loadData();
  };

  const starUser = async () => {
    await superLikeUserIgnored(user.userId);
    setLoad(true);
    loadData();
  };

  const likeUser = async () => {
    await likeUserIgnored(user.userId);
    // @ts-ignore: Object is possibly 'null'.
    sendNotification(user.userId, auth().currentUser?.uid);
    setLoad(true);
    loadData();
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

  return load ? (
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
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    </View>
  ) : user?.name === '' || user === undefined ? (
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
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          style={{width: 200, height: 200, marginTop: -50}}
          source={PEOPLE_DEFAULT}
          resizeMode="contain"
        />
      </View>
    </View>
  ) : (
    <View style={styles.wrap}>
      <ScrollView
        ref={ref_scroll}
        style={{width: WIDTH, height: HEIGHT}}
        contentContainerStyle={{
          paddingBottom: showInfo ? 70 : 0,
        }}>
        <ImageBackground
          source={{uri: user?.avatar || undefined}}
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
                {`${user?.name}  ${computeAge(user?.birthday)}`}
              </Text>
              <Pressable onPress={() => setShowInfo(!showInfo)}>
                <Info />
              </Pressable>
            </View>
            <Hobbies data={user?.hobbies} />
          </LinearGradient>
        </ImageBackground>
        {showInfo && (
          <View>
            <ProfileContainer user={user} coordinate={coordinate} />
            <ImagesContainer images={user?.images} />
          </View>
        )}
      </ScrollView>
      <OptionsGroup
        onPressIgnore={ignoreUser}
        onPressSupperLike={starUser}
        onPressLike={likeUser}
      />
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
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
