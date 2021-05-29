import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {CustomIcon, RouteStackParamList} from '../../components';
import {computeAge, getLikedUsers, getTopPick} from '../../controller';
const Tab = createMaterialTopTabNavigator();

const Item = ({item, onPress, iconName}: any) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
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
          color={iconName === 'lookingfor' ? '#6A1616' : '#0078D4'}
          style={{marginLeft: 5}}
        />
      </View>
    </TouchableOpacity>
  );
};

const ListItem = ({data, navigation, iconName}: any) => {
  const renderItem = ({item}: any) => {
    return (
      <Item
        iconName={iconName}
        item={item}
        onPress={() =>
          navigation.navigate('ProfileScreen', {userId: item.userId})
        }
      />
    );
  };
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.userId}
      numColumns={2}
      columnWrapperStyle={styles.flatList}
    />
  );
};

const LikedYou = ({navigation}: RouteStackParamList<'InitScreen'>) => {
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
    <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
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

const TopPick = ({navigation}: RouteStackParamList<'InitScreen'>) => {
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
    <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
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
    <Tab.Navigator
      lazy={false}
      tabBarOptions={{
        activeTintColor: '#6A1616',
        inactiveTintColor: '#000000',
        labelStyle: {fontSize: 14, marginTop: 20, fontWeight: 'bold'},
        tabStyle: {height: 60},
        indicatorStyle: {backgroundColor: '#6A1616'},
        style: {
          backgroundColor: '#F8F8F8',
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
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: '47.5%',
    height: 250,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
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
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  flatList: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  avatar: {
    flex: 1,
    borderRadius: 10,
  },
});
