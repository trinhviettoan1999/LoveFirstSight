import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  CustomIcon,
  ProfileInformation,
  ImageUser,
  Filter,
  Options,
  DisLike,
  Star,
  Like,
  Hobbies,
  Info,
} from '../../components';
import Modal from 'react-native-modal';
import {
  likeUser,
  ignoreUser,
  reportUser,
  superLikeUser,
  getAvailableUsers,
  computeAge,
  getUserRandom,
  blockUser,
  sendMessageRequest,
  updateUser,
  calculateDistance,
  getHobbiesUser,
  sendNotification,
} from '../../controller';
import {HeaderCustom} from '../../components';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import GetLocation from 'react-native-get-location';
import {useNavigation} from '@react-navigation/native';
import {spacing, color} from '../../theme';
import {ROUTER} from '../../constants/router';
import LinearGradient from 'react-native-linear-gradient';

const not_result_image = require('../../../assets/images/not_result.png');
const avatar = require('../../../assets/images/avt1.png');

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
    avatar: null,
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
    images: [null, null, null, null, null, null, null, null],
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
  const [showInfo, setShowInfo] = useState(false);
  const [coordinate, setCoordinate] = useState({
    lat: 0,
    long: 0,
  });

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
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then((location) => {
        setCoordinate({
          lat: location.latitude,
          long: location.longitude,
        });
        updateUser({
          coordinates: {
            lat: location.latitude,
            long: location.longitude,
          },
        });
      })
      .catch((error) => {
        const {code, message} = error;
        console.log(code, message);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadData(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  return (
    <View style={styles.wrap}>
      {load && (
        <View style={styles.load}>
          <ActivityIndicator color={color.primary} size="large" />
          <Text style={styles.textLoad}>Loading...</Text>
        </View>
      )}
      {user?.name && !load ? (
        <View>
          <ScrollView
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
                  <TouchableOpacity onPress={() => setShowInfo(!showInfo)}>
                    <Info />
                  </TouchableOpacity>
                </View>
                <Hobbies data={user.hobbies} />
              </LinearGradient>
            </ImageBackground>
            {showInfo && (
              <View>
                <View style={styles.infoContainer}>
                  <ProfileInformation iconName="gender" content={user.gender} />
                  {user.lookingFor ? (
                    <ProfileInformation
                      iconName="lookingfor"
                      content={user.lookingFor}
                    />
                  ) : null}
                  <ProfileInformation
                    iconName="location"
                    content="Located in Ho Chi Minh City, Viet Nam"
                  />
                  <ProfileInformation
                    iconName="scope"
                    content={
                      `${calculateDistance(user.coordinates, coordinate)
                        .toFixed(1)
                        .toString()}` + ' km'
                    }
                  />
                  {user.height ? (
                    <ProfileInformation
                      iconName="height"
                      content={user.height + ' cm'}
                    />
                  ) : null}
                  {user.university ? (
                    <ProfileInformation
                      iconName="university"
                      content={user.university}
                    />
                  ) : null}
                  {user.province ? (
                    <ProfileInformation
                      iconName="province"
                      content={user.province}
                    />
                  ) : null}
                  {user.drinking ? (
                    <ProfileInformation
                      iconName="drinking"
                      content={user.drinking}
                    />
                  ) : null}
                  {user.smoking ? (
                    <ProfileInformation
                      iconName="smoking"
                      content={user.smoking}
                    />
                  ) : null}
                  {user.kids ? (
                    <ProfileInformation iconName="child" content={user.kids} />
                  ) : null}
                </View>
                <View style={{paddingHorizontal: spacing[4]}}>
                  {user.images[0] ? (
                    <ImageUser urlImage={user.images[0] || ''} />
                  ) : null}
                  {user.images[1] ? (
                    <ImageUser urlImage={user.images[1] || ''} />
                  ) : null}
                  {user.images[2] ? (
                    <ImageUser urlImage={user.images[2] || ''} />
                  ) : null}
                  {user.images[3] ? (
                    <ImageUser urlImage={user.images[3] || ''} />
                  ) : null}
                  {user.images[4] ? (
                    <ImageUser urlImage={user.images[4] || ''} />
                  ) : null}
                  {user.images[5] ? (
                    <ImageUser urlImage={user.images[5] || ''} />
                  ) : null}
                  {user.images[6] ? (
                    <ImageUser urlImage={user.images[6] || ''} />
                  ) : null}
                  {user.images[7] ? (
                    <ImageUser urlImage={user.images[7] || ''} />
                  ) : null}
                </View>
              </View>
            )}
          </ScrollView>
          <View style={styles.containerButton}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={async () => {
                await ignoreUser(user.userId);
                setLoad(!load);
              }}>
              <DisLike />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={async () => {
                await superLikeUser(user.userId);
                setLoad(!load);
              }}>
              <Star />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={async () => {
                await likeUser(user.userId);
                // @ts-ignore: Object is possibly 'null'.
                sendNotification(user.userId, auth().currentUser?.uid);
                setLoad(!load);
              }}>
              <Like />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {/* {!user?.name && !load && (
        <View
          style={[
            styles.wrap,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Image
            source={not_result_image}
            style={styles.imageResult}
            resizeMode="contain"
          />
          <Text style={{fontSize: 16}}>Don't have Users with your filter</Text>
        </View>
      )} */}
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
  imageResult: {
    width: 250,
    height: 250,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 70,
    paddingHorizontal: spacing[4],
  },
  containerButton: {
    width: WIDTH,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    bottom: spacing[2],
  },
  name: {
    marginBottom: spacing[4],
    marginRight: spacing[2],
    color: color.bgWhite,
    lineHeight: 27,
    fontWeight: '700',
    fontSize: 25,
  },
  infoContainer: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: color.bgWhite,
    borderRadius: spacing[2],
  },
  load: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLoad: {
    marginTop: 10,
  },
});
