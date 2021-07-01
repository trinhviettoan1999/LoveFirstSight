import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {CustomIcon, HeaderCustom} from '../../components';
import {computeAge, getLikedUsers, getTopPick} from '../../controller';
import {color} from '../../theme/color';
import {ROUTER} from '../../constants/router';

const Tab = createMaterialTopTabNavigator();
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Item = ({item, onPress, iconName}: any) => {
  return (
    <Pressable style={styles.itemContainer} onPress={onPress}>
      <View style={styles.avatar}>
        <FastImage
          style={styles.avatar}
          source={{
            // @ts-ignore: Object is possibly 'null'.
            uri: item.avatar,
            headers: {Authorization: 'staplerapp123456'},
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <View style={styles.informationContainer}>
        <Text onPress={onPress} style={styles.text}>
          {item.name}
        </Text>
        <Text onPress={onPress} style={styles.text}>
          , {computeAge(item.birthday)}
        </Text>
        <CustomIcon
          name={iconName}
          size={15}
          color={iconName === 'lookingfor' ? 'red' : '#0078D4'}
          style={{marginLeft: 5}}
        />
      </View>
    </Pressable>
  );
};

const ListItem = ({data, navigation, iconName}: any) => {
  const renderItem = ({item}: any) => {
    return (
      <Item
        iconName={iconName}
        item={item}
        onPress={() =>
          navigation.navigate(ROUTER.profile, {userId: item.userId})
        }
      />
    );
  };
  return (
    <FlatList
      contentContainerStyle={{paddingBottom: 16, backgroundColor: 'white'}}
      numColumns={2}
      columnWrapperStyle={{flex: 1}}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.userId}
    />
  );
};

const LikedYou = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    getLikedUsers().then(async (result) => {
      setData(await result.json());
      setStatus(await result.status);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLikedUsers().then(async (result) => {
        setData(await result.json());
        setStatus(await result.status);
      });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {status === 200 ? (
        <ListItem data={data} navigation={navigation} iconName="lookingfor" />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Don't have who liked you!!</Text>
        </View>
      )}
    </View>
  );
};

const TopPick = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    getTopPick().then(async (result) => {
      setData(await result.json());
      setStatus(await result.status);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTopPick().then(async (result) => {
        setData(await result.json());
        setStatus(await result.status);
      });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {status === 200 ? (
        <ListItem data={data} navigation={navigation} iconName="star" />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>TopPick</Text>
        </View>
      )}
    </View>
  );
};

export const LikedYouScreen = () => {
  return (
    <View style={{flex: 1, backgroundColor: color.bgWhite}}>
      <HeaderCustom
        height={0}
        backgroundStatusBar={color.bgWhite}
        removeBorderWidth
        barStyle="dark-content"
      />
      <Tab.Navigator
        lazy={false}
        tabBarOptions={{
          activeTintColor: color.primary,
          inactiveTintColor: color.text,
          labelStyle: {fontSize: 14, fontWeight: 'bold'},
          tabStyle: {height: 45},
          indicatorStyle: {backgroundColor: color.primary},
          style: {
            backgroundColor: color.bgWhite,
          },
        }}>
        <Tab.Screen
          name="LikedYou"
          component={LikedYou}
          options={{tabBarLabel: 'Liked You'}}
        />
        <Tab.Screen
          name="TopPick"
          component={TopPick}
          options={{tabBarLabel: 'Top Pick'}}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: (WIDTH - 16 * 3) / 2,
    height: 250,
    borderRadius: 5,
    marginTop: 16,
    marginLeft: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 10,
  },
  informationContainer: {
    width: '80%',
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    marginBottom: 16,
    alignSelf: 'center',
    borderRadius: 5,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  flatList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    height: HEIGHT,
  },
  avatar: {
    flex: 1,
    borderRadius: 5,
  },
});
