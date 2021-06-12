import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  CustomIcon,
  ProfileInformation,
  ImageUser,
  ButtonCustom,
  ModalPicture,
  HeaderCustom,
  Setting,
} from '../../components';
import auth from '@react-native-firebase/auth';
import {signOutAccount} from '../../firebase/firebase';
import 'react-native-console-time-polyfill';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
import {color, spacing} from '../../theme';
import {ROUTER} from '../../constants/router';
import {getUser, deleteTokenToDatabase} from '../../controller';

//calculate age
function computeAge(birthday: string) {
  const diff = Date.now() - Date.parse(birthday);
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
const WIDTH = Dimensions.get('window').width;

export const AccountScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const User = {
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
    coordinates: {
      lat: 0,
      long: 0,
    },
    location: '',
    images: [null, null, null, null, null, null, null, null],
  };
  const [user, setUser] = useState(User);
  const [edit, setEdit] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadAvatar, setLoadAvatar] = useState(false);
  const [load, setLoad] = useState(false);
  const [loadLogout, setLoadLogout] = useState(false);

  const loadUser = async () => {
    const user = await getUser(auth().currentUser?.uid || '');
    setUser(user);
  };

  // console.log(user);
  useEffect(() => {
    // @ts-ignore: Object is possibly 'null'.
    loadUser();
  }, [route.params, loadAvatar]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUser();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <HeaderCustom
        barStyle="dark-content"
        leftComponent={<Text style={styles.textHeader}>Account</Text>}
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate(ROUTER.setting)}>
            <Setting />
          </TouchableOpacity>
        }
      />
      <ScrollView>
        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(true);
            setFileName('avatar.png');
            setEdit(false);
          }}
          activeOpacity={0.9}>
          <View style={styles.avatar}>
            {load ? (
              <ActivityIndicator
                color="#red"
                size="large"
                style={styles.activityIndicator}
              />
            ) : null}
            <FastImage
              style={styles.avatar}
              onLoadStart={() => setLoad(true)}
              source={{
                // @ts-ignore: Object is possibly 'null'.
                uri: user.avatar,
                headers: {Authorization: 'staplerapp123456'},
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
              onLoadEnd={() => setLoad(false)}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.scrollView}>
          <View style={styles.informationContainer}>
            <View style={styles.firstContainer}>
              <Text
                style={styles.font26}
                onPress={() =>
                  navigation.navigate(ROUTER.editName, {
                    name: user.name,
                  })
                }>
                {user.name}
              </Text>
              <Text
                style={styles.font26}
                onPress={() => navigation.navigate(ROUTER.editAge)}>
                , {computeAge(user.birthday)}
              </Text>
            </View>
            <Text style={styles.font17}>{user.intro}</Text>
            <ProfileInformation
              iconName="gender"
              content={user.gender}
              onPress={() => {
                navigation.navigate(ROUTER.editGender, {
                  gender: user.gender,
                });
              }}
            />
            <ProfileInformation
              iconName="lookingfor"
              content={user.lookingFor}
              onPress={() => {
                navigation.navigate(ROUTER.editLookingFor, {
                  lookingFor: user.lookingFor,
                });
              }}
            />
            <ProfileInformation
              iconName="location"
              content={user.location}
              onPress={() => navigation.navigate(ROUTER.editLiving)}
            />
            <ProfileInformation
              iconName="height"
              content={user.height ? user.height + ' cm' : user.height}
              onPress={() =>
                navigation.navigate(ROUTER.editHeight, {
                  height: user.height,
                })
              }
            />
            <ProfileInformation
              iconName="university"
              content={user.university}
              onPress={() => navigation.navigate(ROUTER.editUniversity)}
            />
            <ProfileInformation
              iconName="province"
              content={user.province}
              onPress={() =>
                navigation.navigate(ROUTER.editHomeTown, {
                  province: user.province,
                })
              }
            />
            <ProfileInformation
              iconName="drinking"
              content={user.drinking}
              onPress={() =>
                navigation.navigate(ROUTER.editDrinking, {
                  drinking: user.drinking,
                })
              }
            />
            <ProfileInformation
              iconName="smoking"
              content={user.smoking}
              onPress={() =>
                navigation.navigate(ROUTER.editSmoking, {
                  smoking: user.smoking,
                })
              }
            />
            <ProfileInformation
              iconName="child"
              content={user.kids}
              onPress={() =>
                navigation.navigate(ROUTER.editYourKid, {
                  kids: user.kids,
                })
              }
            />
          </View>
          {user.images[0] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image1.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[0] || undefined} />
            </TouchableOpacity>
          ) : null}
          {user.images[1] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image2.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[1] || undefined} />
            </TouchableOpacity>
          ) : null}
          {user.images[2] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image3.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[2] || undefined} />
            </TouchableOpacity>
          ) : null}
          {user.images[3] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image4.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[3] || undefined} />
            </TouchableOpacity>
          ) : null}
          {user.images[4] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image5.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[4] || undefined} />
            </TouchableOpacity>
          ) : null}
          {user.images[5] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image6.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[5] || undefined} />
            </TouchableOpacity>
          ) : null}
          {user.images[6] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image7.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[6] || undefined} />
            </TouchableOpacity>
          ) : null}
          {user.images[7] ? (
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setFileName('image8.png');
                setEdit(true);
              }}
              activeOpacity={0.9}>
              <ImageUser urlImage={user.images[7] || undefined} />
            </TouchableOpacity>
          ) : null}
          <View style={styles.buttonContainer}>
            {user.images.indexOf(null) === -1 ? null : (
              <ButtonCustom
                title="Add a Photo"
                buttonStyle={styles.button}
                onPress={() => {
                  const index = user.images.indexOf(null);
                  setIsModalVisible(true);
                  setFileName(`image${index + 1}.png`);
                  setEdit(false);
                }}
                icon={
                  <CustomIcon
                    name="addcamera"
                    size={20}
                    color="#FFFFFF"
                    style={{marginRight: 5}}
                  />
                }
              />
            )}
            {/* <TouchableHighlight style={styles.button}>
              <Text style={styles.textButton}>Connect Instagram</Text>
            </TouchableHighlight> */}
            <ButtonCustom
              loading={loadLogout}
              title="Log out"
              buttonStyle={styles.button}
              onPress={() => {
                setLoadLogout(true);
                messaging()
                  .getToken()
                  .then((token) => {
                    deleteTokenToDatabase(token).then(() => {
                      signOutAccount(() => {
                        navigation.replace(ROUTER.loading);
                      });
                    });
                  });
                setLoadLogout(false);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <ModalPicture
        fileName={fileName}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        images={user.images}
        setLoadAvatar={setLoadAvatar}
        loadAvatar={loadAvatar}
        edit={edit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  textHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: color.primary,
  },
  firstContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginTop: 5,
  },
  informationContainer: {
    width: '100%',
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatar: {
    height: 400,
    width: '100%',
    alignItems: 'center',
  },
  font26: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  font17: {
    fontSize: 17,
    fontWeight: '600',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  button: {
    minHeight: 50,
    borderRadius: spacing[2],
    width: WIDTH - 32,
    backgroundColor: color.primary,
    marginTop: spacing[4],
  },
  textButton: {
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#FFFFFF',
  },
  headerContainer: {
    flex: 1,
    height: 45,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flex: 1,
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
  activityIndicator: {
    bottom: 200,
    top: 200,
    position: 'absolute',
  },
});
