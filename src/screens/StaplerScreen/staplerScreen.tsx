import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  StatusBarCustom,
  CustomIcon,
  ProfileInformation,
  ImageUser,
} from '../../components';
import Modal from 'react-native-modal';
import FilterScreen from './filterScreen';
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
import {RouteStackParamList} from '../../components';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import GetLocation from 'react-native-get-location';

const Header = ({setIsModalVisibleFilter, setIsModalVisibleMenu}: any) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: 'bold',
            fontStyle: 'normal',
            color: '#6A1616',
            flex: 12,
          }}>
          Stapler
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            flex: 2,
            alignItems: 'flex-end',
            marginRight: 5,
          }}
          onPress={() => setIsModalVisibleFilter(true)}>
          <CustomIcon name="filter" color="#212121" size={15} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{flex: 2, alignItems: 'flex-end'}}
          activeOpacity={0.9}
          onPress={() => setIsModalVisibleMenu(true)}>
          <CustomIcon name="menu" color="#212121" size={25} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

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

const HomeScreen = ({navigation}: RouteStackParamList<'StaplerScreen'>) => {
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
  const [isModalVisibleFilter, setIsModalVisibleFilter] = useState(false);
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
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        setIsModalVisibleFilter={setIsModalVisibleFilter}
        setIsModalVisibleMenu={setIsModalVisibleMenu}
      />
      {load && (
        <View style={styles.load}>
          <ActivityIndicator color="#6A1616" size={20} />
          <Text style={styles.textLoad}>Loading...</Text>
        </View>
      )}
      {user?.name && !load ? (
        <>
          <ScrollView style={styles.scrollView}>
            <FastImage
              style={styles.avatar}
              source={{
                // @ts-ignore: Object is possibly 'null'.
                uri: user.avatar,
                headers: {Authorization: 'staplerapp123456'},
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.container}>
              <View style={styles.informationContainer}>
                <View style={styles.firstContainer}>
                  <Text style={styles.font26}>{user.name}</Text>
                  <Text style={styles.font26}>
                    , {computeAge(user.birthday)}
                  </Text>
                  <View style={styles.containerMessageIcon}>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Notification',
                          `Do you want to send message to ${user.name}?`,
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'OK',
                              onPress: () => {
                                sendMessageRequest(user.userId).then(
                                  (conversationId) => {
                                    setLoad(!load);
                                    navigation.navigate('Chat', {
                                      name: user.name,
                                      avatar: user.avatar,
                                      conversationId: conversationId,
                                      ownerId: user.userId,
                                      state: true,
                                    });
                                  },
                                );
                              },
                            },
                          ],
                          {cancelable: false},
                        );
                      }}>
                      <CustomIcon name="messenger" size={25} color="#6A1616" />
                    </TouchableOpacity>
                  </View>
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
              {user.images[0] ? <ImageUser urlImage={user.images[0]} /> : null}
              {user.images[1] ? <ImageUser urlImage={user.images[1]} /> : null}
              {user.images[2] ? <ImageUser urlImage={user.images[2]} /> : null}
              {user.images[3] ? <ImageUser urlImage={user.images[3]} /> : null}
              {user.images[4] ? <ImageUser urlImage={user.images[4]} /> : null}
              {user.images[5] ? <ImageUser urlImage={user.images[5]} /> : null}
              {user.images[6] ? <ImageUser urlImage={user.images[6]} /> : null}
              {user.images[7] ? <ImageUser urlImage={user.images[7]} /> : null}
            </View>
            <View style={{height: 80}} />
          </ScrollView>
          <View style={styles.interactiveContainer}>
            <ButtonIcon
              name="dislike"
              size={30}
              color="#745300"
              onPress={async () => {
                await ignoreUser(user.userId);
                setLoad(!load);
              }}
            />
            <ButtonIcon
              name="star"
              size={40}
              color="#0078D4"
              onPress={async () => {
                await superLikeUser(user.userId);
                setLoad(!load);
              }}
            />
            <ButtonIcon
              name="lookingfor"
              size={30}
              color="#6A1616"
              onPress={async () => {
                await likeUser(user.userId);
                // @ts-ignore: Object is possibly 'null'.
                sendNotification(user.userId, auth().currentUser?.uid);
                setLoad(!load);
              }}
            />
          </View>
          <Modal
            swipeDirection="down"
            onSwipeComplete={() => setIsModalVisibleMenu(false)}
            hideModalContentWhileAnimating
            isVisible={isModalVisibleMenu}
            style={styles.modalMenu}
            onBackdropPress={() => setIsModalVisibleMenu(false)}
            backdropOpacity={0.5}>
            <View style={styles.buttonModal}>
              <CustomIcon
                name="report"
                size={30}
                color="#6A1616"
                style={{flex: 0.5}}
              />
              <Text
                style={styles.textButtonModal}
                onPress={() => {
                  reportUser(user.userId);
                  setLoad(!load);
                  setIsModalVisibleMenu(false);
                }}>
                Report {user.name}'s profile
              </Text>
            </View>
            <View style={styles.buttonModal}>
              <CustomIcon
                name="block-people"
                size={30}
                color="#6A1616"
                style={{flex: 0.5}}
              />
              <Text
                style={styles.textButtonModal}
                onPress={() => {
                  blockUser(user.userId);
                  setLoad(!load);
                  setIsModalVisibleMenu(false);
                }}>
                Block {user.name}'s profile
              </Text>
            </View>
          </Modal>
        </>
      ) : null}
      {!user?.name && !load && (
        <View
          style={[
            styles.scrollView,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Text style={{fontSize: 16}}>Don't have Users with your filter</Text>
        </View>
      )}
      <Modal
        swipeDirection="left"
        onSwipeComplete={() => setIsModalVisibleFilter(false)}
        hideModalContentWhileAnimating
        isVisible={isModalVisibleFilter}
        style={styles.modalFilter}
        onBackdropPress={() => setIsModalVisibleFilter(false)}
        backdropOpacity={0.5}>
        <FilterScreen
          setIsModalVisible={setIsModalVisibleFilter}
          setFilter={setFilter}
          filter={filter}
          setLoad={setLoad}
          load={load}
        />
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
  containerMessageIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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

export default HomeScreen;
