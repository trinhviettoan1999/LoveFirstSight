import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  StatusBarCustom,
  CustomIcon,
  ProfileInformation,
  ImageUser,
  RouteStackParamList,
} from '../../components';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import {
  likeUser,
  ignoreUser,
  superLikeUser,
  computeAge,
  getUser,
  calculateDistance,
} from '../../controller';
import GetLocation from 'react-native-get-location';

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

const ProfileScreen = ({
  navigation,
  route,
}: RouteStackParamList<'InitScreen'>) => {
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
    likedUsers: [],
  };
  const [isModalVisibleLoading, setIsModalVisibleLoading] = useState(false);
  const [user, setUser] = useState(User);
  const [isMatched, setIsMatched] = useState(-1);
  const [coordinate, setCoordinate] = useState({
    lat: 0,
    long: 0,
  });
  async function loadData(isMounted: boolean) {
    setIsModalVisibleLoading(true);
    await getUser(route.params.userId).then(async (result) => {
      if (isMounted) {
        setUser(result);
        setIsMatched(result.availableUsers.indexOf(auth().currentUser?.uid));
      }
    });
    setIsModalVisibleLoading(false);
  }

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
  }, []);
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.avatar}>
          <Image
            // @ts-ignore: Object is possibly 'null'.
            source={{
              uri: user.avatar,
            }}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.iconBack}
            activeOpacity={0.9}
            onPress={() => {
              if (route.params.flag) {
                navigation.replace('StaplerScreen');
              } else {
                navigation.goBack();
              }
            }}>
            <CustomIcon name="back" color="#FFFFFF" size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.informationContainer}>
            <View style={styles.firstContainer}>
              <Text style={styles.font26}>{user.name}</Text>
              <Text style={styles.font26}>, {computeAge(user.birthday)}</Text>
            </View>
            <Text style={styles.font17}>{user.intro}</Text>
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
              <ProfileInformation iconName="province" content={user.province} />
            ) : null}
            {user.drinking ? (
              <ProfileInformation iconName="drinking" content={user.drinking} />
            ) : null}
            {user.smoking ? (
              <ProfileInformation iconName="smoking" content={user.smoking} />
            ) : null}
            {user.kids ? (
              <ProfileInformation iconName="child" content={user.kids} />
            ) : null}
          </View>
          {user.images[0] ? <ImageUser urlImage={user.images[0]} /> : null}
          {user.images[1] ? <ImageUser urlImage={user.images[1]} /> : null}
          {user.images[2] ? <ImageUser urlImage={user.images[2]} /> : null}
          {user.images[3] ? <ImageUser urlImage={user.images[3]} /> : null}
          {user.images[4] ? <ImageUser urlImage={user.images[4]} /> : null}
          {user.images[5] ? <ImageUser urlImage={user.images[5]} /> : null}
          {user.images[6] ? <ImageUser urlImage={user.images[6]} /> : null}
          {user.images[7] ? <ImageUser urlImage={user.images[7]} /> : null}
        </View>
        <View style={{height: 70}} />
      </ScrollView>
      {isMatched === -1 ? null : (
        <View style={styles.interactiveContainer}>
          <ButtonIcon
            name="dislike"
            size={30}
            color="#745300"
            onPress={async () => {
              await ignoreUser(route.params.userId);
              if (route.params.flag) {
                navigation.replace('StaplerScreen');
              } else {
                navigation.goBack();
              }
            }}
          />
          <ButtonIcon
            name="star"
            size={40}
            color="#0078D4"
            onPress={async () => {
              await superLikeUser(route.params.userId);
              if (route.params.flag) {
                navigation.replace('StaplerScreen');
              } else {
                navigation.goBack();
              }
            }}
          />
          <ButtonIcon
            name="lookingfor"
            size={30}
            color="#6A1616"
            onPress={async () => {
              await likeUser(route.params.userId);
              // @ts-ignore: Object is possibly 'null'.
              sendNotification(route.params.userId, auth().currentUser?.uid);
              if (route.params.flag) {
                navigation.replace('StaplerScreen');
              } else {
                navigation.goBack();
              }
            }}
          />
        </View>
      )}

      <Modal
        isVisible={isModalVisibleLoading}
        style={styles.modalLoading}
        backdropOpacity={0.5}>
        <ActivityIndicator size="large" color="#6A1616" />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: '#F8F8F8',
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
  iconBack: {
    position: 'absolute',
    top: 20,
    left: 10,
    width: 30,
  },
});

export default ProfileScreen;
