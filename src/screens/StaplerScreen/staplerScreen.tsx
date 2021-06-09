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
} from '../../controller';
import {HeaderCustom} from '../../components';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import GetLocation from 'react-native-get-location';
import {useNavigation} from '@react-navigation/native';
import {spacing} from '../../theme';
import {ROUTER} from '../../constants/router';
import LinearGradient from 'react-native-linear-gradient';
import {color} from '../../theme/color';

const not_result_image = require('../../../assets/images/not_result.png');
const avatar = require('../../../assets/images/avt1.png');

type Props = {
  name: string;
  size: number;
  color: string;
  onPress?: any;
};

const ButtonIcon = ({name, size, color, onPress}: Props) => {
  return (
    <TouchableOpacity style={styles.buttonIcon} onPress={onPress}>
      <CustomIcon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

const saveTokenToDatabase = async (token: string) => {
  const userId = auth().currentUser?.uid;
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });
};

const sendNotification = async (ownerId: string, userId: string) => {
  return await fetch(
    'https://still-brushlands-96770.herokuapp.com/notification/like/' +
      ownerId +
      '/' +
      userId,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json());
};

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
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
  const [coordinate, setCoordinate] = useState({
    lat: 0,
    long: 0,
  });

  async function loadData(isMounted: boolean) {
    // setIsModalVisibleLoading(true);
    await getAvailableUsers(filter).then(async (result) => {
      if (isMounted) {
        setUser(getUserRandom(result));
      }
    });
    setLoad(false);
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
    <ScrollView style={{width: WIDTH, height: HEIGHT - tabBarHeight}}>
      <ImageBackground
        source={avatar}
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
          <Text style={{color: 'red'}}>ABC</Text>
        </LinearGradient>
      </ImageBackground>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    width: '100%',
    height: HEIGHT - 49,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },
  containerButton: {
    width: WIDTH,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    bottom: spacing[2],
  },
});
