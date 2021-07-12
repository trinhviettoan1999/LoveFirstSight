import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {StarSmall, HeartFill} from '../../components';
import {computeAge, getLikedUsers, getTopPick} from '../../controller';
import {color} from '../../theme/color';
import {ROUTER} from '../../constants/router';
import {SafeAreaView} from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const LIKEYOU_DEFAULT = require('../../../assets/images/likeyou_default.png');

const Item = ({item, onPress, iconName}: any) => {
  const subString = (name: string) => {
    if (name.length > 15) {
      return name.substring(0, 10) + '...';
    }
    return name;
  };

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
          {subString(item.name)}
        </Text>
        <Text onPress={onPress} style={styles.text}>
          {`, ${computeAge(item.birthday)} `}
        </Text>
        {iconName === 'lookingfor' ? <HeartFill /> : <StarSmall />}
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
      contentContainerStyle={{
        paddingBottom: 100,
        backgroundColor: 'white',
      }}
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
          <Image
            style={{width: 200, height: 200, marginTop: -50}}
            source={LIKEYOU_DEFAULT}
            resizeMode="contain"
          />
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
    <View style={{backgroundColor: 'white'}}>
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
    <SafeAreaView
      style={{width: WIDTH, height: HEIGHT, backgroundColor: color.bgWhite}}
      edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={color.bgWhite} />
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
    </SafeAreaView>
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
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  informationContainer: {
    width: '90%',
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
