import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  checkIsReadConversation,
  getConversation,
  updateStatusIsRead,
} from '../../controller';
import FastImage from 'react-native-fast-image';
import {ROUTER} from '../../constants/router';
import {color} from '../../theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
const Tab = createMaterialTopTabNavigator();

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const CONVERSATION_DEFAULT = require('../../../assets/images/conversation_default.png');

//item Conversation
const ItemConversation = ({item, onPress}: any) => {
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    if (auth().currentUser !== undefined) {
      checkIsReadConversation(item.conversationId, (result: boolean) => {
        setIsRead(result || false);
      });
      return () => {
        checkIsReadConversation(item.conversationId, (result: boolean) => {
          setIsRead(result || false);
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Pressable
      style={styles.itemConversationContainer}
      onPress={() => {
        onPress();
        if (isRead) {
          updateStatusIsRead(item.conversationId);
        }
      }}>
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
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <Text style={styles.textName}>{item.name}</Text>
        {isRead ? (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            <Text style={styles.textMessage}>{item.text}</Text>
            <View style={styles.status} />
          </View>
        ) : (
          <Text style={styles.textMessageIsRead}>{item.text}</Text>
        )}
      </View>
    </Pressable>
  );
};

const ConversationWait = () => {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const [conversation, setConversation] = useState([]);

  const renderItemConversation = ({item}: any) => {
    return (
      <ItemConversation
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          navigation.navigate(ROUTER.chat, {
            name: item.name,
            avatar: item.avatar,
            conversationId: item.conversationId,
            ownerId: item.userId,
            state: true,
          });
        }}
        isCheck={true}
      />
    );
  };

  useEffect(() => {
    if (auth().currentUser !== undefined) {
      getConversation(true, (result: any) => {
        setConversation(result);
      });
      return () => {
        getConversation(true, (result: any) => {
          setConversation(result);
        });
      };
    }
  }, []);

  return (
    <View style={styles.allContainer}>
      <View style={styles.container}>
        {conversation.length <= 0 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={{width: 200, height: 200, marginTop: -50}}
              source={CONVERSATION_DEFAULT}
              resizeMode="contain"
            />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.flatlistContainer}
            showsVerticalScrollIndicator={false}
            data={conversation}
            renderItem={renderItemConversation}
            keyExtractor={(item) =>
              // @ts-ignore: Object is possibly 'null'.
              item.conversationId
            }
            extraData={selectedId}
          />
        )}
      </View>
    </View>
  );
};

const Conversation = () => {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const renderItemConversation = ({item}: any) => {
    return (
      <ItemConversation
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          navigation.navigate(ROUTER.chat, {
            name: item.name,
            avatar: item.avatar,
            conversationId: item.conversationId,
            ownerId: item.userId,
            state: false,
          });
        }}
        isCheck={true}
      />
    );
  };

  useEffect(() => {
    if (auth().currentUser !== undefined) {
      getConversation(false, (result: any) => {
        setConversation(result);
      });
      return () => {
        getConversation(false, (result: any) => {
          setConversation(result);
        });
      };
    }
  }, []);

  return (
    <View style={styles.allContainer}>
      <View style={styles.container}>
        {conversation.length <= 0 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={{width: 200, height: 200, marginTop: -50}}
              source={CONVERSATION_DEFAULT}
              resizeMode="contain"
            />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.flatlistContainer}
            showsVerticalScrollIndicator={false}
            data={conversation}
            renderItem={renderItemConversation}
            keyExtractor={(item) =>
              // @ts-ignore: Object is possibly 'null'.
              item.conversationId
            }
            extraData={selectedId}
          />
        )}
      </View>
    </View>
  );
};

export const ConversationScreen = () => {
  return (
    <SafeAreaView
      style={{width: WIDTH, height: HEIGHT, backgroundColor: color.bgWhite}}
      edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={color.bgWhite} />
      <Tab.Navigator
        lazy
        tabBarOptions={{
          activeTintColor: color.primary,
          inactiveTintColor: color.text,
          labelStyle: {fontSize: 14, fontWeight: 'bold'},
          tabStyle: {height: 50},
          indicatorStyle: {backgroundColor: color.primary},
          style: {
            backgroundColor: color.bgWhite,
          },
        }}>
        <Tab.Screen
          name="Conversations"
          component={Conversation}
          options={{tabBarLabel: 'Conversations'}}
        />
        <Tab.Screen
          name="Messages Request"
          component={ConversationWait}
          options={{tabBarLabel: 'Messages Request'}}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
  },
  flatlistContainer: {
    paddingTop: 10,
    paddingBottom: 80,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  textName: {
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#000000',
  },
  itemConversationContainer: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 5,
    borderRadius: 10,
  },
  textMessageIsRead: {
    fontSize: 14,
    fontStyle: 'normal',
    color: color.textGray,
    fontWeight: '500',
  },
  textMessage: {
    flex: 1,
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: color.text,
  },
  status: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.primary,
  },
});
