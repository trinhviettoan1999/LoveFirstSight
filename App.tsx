import React, {useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {
  AccountScreen,
  ConversationScreen,
  StaplerScreen,
  LikedYouScreen,
  SettingsScreen,
  EmailScreen,
  PushNotificationScreen,
  EmailNotificationScreen,
  ConnectedAccountScreen,
  EditNameScreen,
  EditAgeScreen,
  EditGenderScreen,
  EditLookingForScreen,
  EditLivingScreen,
  EditHeightScreen,
  EditUniversityScreen,
  EditHomeTownScreen,
  EditDrinkingScreen,
  EditSmokingScreen,
  EditYourKidScreen,
  EnterMailScreen,
  EnterCodeScreen,
  InitNameScreen,
  InitAgeScreen,
  InitIntroScreen,
  InitHobbiesScreen,
  InitAvatarScreen,
  SignInScreen,
  Chat,
  EnterPassword,
  LoadingScreen,
  ProfileScreen,
  ListIgnoreScreen,
  ListBlockScreen,
  InitialScreen,
  ForgotPasswordScreen,
  NewsScreen,
  PostScreen,
  DetailNewScreen,
  VideoScreen,
  IncomingCallScreen,
  FilterScreen,
} from './src/screens';
import {CustomIcon} from './src/components';
import messaging from '@react-native-firebase/messaging';
import {ROUTER} from './src/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AppTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'stapler-fill';
          if (route.name === 'StaplerScreen') {
            iconName = focused ? 'stapler-fill' : 'stapler-outline';
          } else if (route.name === 'LikedYou') {
            iconName = focused ? 'superlike' : 'superlike-outline';
          } else if (route.name === 'Conversation') {
            iconName = focused ? 'conversation' : 'conversation-outline';
          } else if (route.name === 'AccountScreen') {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'NewsScreen') {
            iconName = focused ? 'posts' : 'posts';
          }
          return <CustomIcon name={iconName} color={color} size={size} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#6A1616',
        inactiveTintColor: '#212121',
        labelStyle: {fontSize: 12},
        showLabel: false,
        style: {
          backgroundColor: '#F8F8F8',
        },
      }}
      lazy={false}>
      <Tab.Screen name="StaplerScreen" component={StaplerScreen} />
      <Tab.Screen name="NewsScreen" component={NewsScreen} />
      <Tab.Screen name="LikedYou" component={LikedYouScreen} />
      <Tab.Screen name="Conversation" component={ConversationScreen} />
      <Tab.Screen name="AccountScreen" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const navigationRef = useRef(null);
  function navigate(name: string, params: any) {
    // @ts-ignore: Object is possibly 'null'.
    navigationRef.current && navigationRef.current.navigate(name, params);
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data?.type === 'CallVideo') {
        navigate(ROUTER.incomingCall, {
          name: remoteMessage.data?.name,
          avatar: remoteMessage.data?.avatar,
          appId: JSON.parse(remoteMessage.data.infoChannel).appId,
          channelName: JSON.parse(remoteMessage.data.infoChannel).channelName,
          userId: remoteMessage.data?.userId,
        });
        return;
      }
      Alert.alert(
        'A new FCM message arrived!',
        JSON.stringify(remoteMessage.notification),
      );
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // @ts-ignore: Object is possibly 'null'.
      if (remoteMessage.data.type === 'Chat') {
        // @ts-ignore: Object is possibly 'null'.
        navigate(remoteMessage.data.type, {
          // @ts-ignore: Object is possibly 'null'.
          name: remoteMessage.data.name,
          // @ts-ignore: Object is possibly 'null'.
          avatar: remoteMessage.data.avatar,
          // @ts-ignore: Object is possibly 'null'.
          conversationId: remoteMessage.data.conversationId,
          // @ts-ignore: Object is possibly 'null'.
          ownerId: remoteMessage.data.userId,
        });
      }
      // @ts-ignore: Object is possibly 'null'.
      if (remoteMessage.data.type === 'ProfileScreen') {
        // @ts-ignore: Object is possibly 'null'.
        navigate(remoteMessage.data.type, {
          // @ts-ignore: Object is possibly 'null'.
          userId: remoteMessage.data.userId,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={ROUTER.loading}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name={ROUTER.loading} component={LoadingScreen} />
        <Stack.Screen name={ROUTER.initial} component={InitialScreen} />
        <Stack.Screen name={ROUTER.signIn} component={SignInScreen} />
        <Stack.Screen
          name={ROUTER.forGotPassword}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen name={ROUTER.enterMail} component={EnterMailScreen} />
        <Stack.Screen name={ROUTER.enterCode} component={EnterCodeScreen} />
        <Stack.Screen name={ROUTER.enterPassword} component={EnterPassword} />
        <Stack.Screen name={ROUTER.initName} component={InitNameScreen} />
        <Stack.Screen name={ROUTER.initAge} component={InitAgeScreen} />
        <Stack.Screen name={ROUTER.initIntro} component={InitIntroScreen} />
        <Stack.Screen name={ROUTER.initHobbies} component={InitHobbiesScreen} />
        <Stack.Screen name={ROUTER.initAvatar} component={InitAvatarScreen} />
        <Stack.Screen name={ROUTER.home} component={AppTab} />
        <Stack.Screen name={ROUTER.filter} component={FilterScreen} />
        <Stack.Screen name={ROUTER.setting} component={SettingsScreen} />
        <Stack.Screen name={ROUTER.listIgnore} component={ListIgnoreScreen} />
        <Stack.Screen name={ROUTER.listBlock} component={ListBlockScreen} />
        <Stack.Screen name={ROUTER.email} component={EmailScreen} />
        <Stack.Screen
          name={ROUTER.connectedAccount}
          component={ConnectedAccountScreen}
        />
        <Stack.Screen
          name={ROUTER.emailNotification}
          component={EmailNotificationScreen}
        />
        <Stack.Screen
          name={ROUTER.pushNotification}
          component={PushNotificationScreen}
        />
        <Stack.Screen name={ROUTER.editName} component={EditNameScreen} />
        <Stack.Screen name={ROUTER.editAge} component={EditAgeScreen} />
        <Stack.Screen name={ROUTER.editGender} component={EditGenderScreen} />
        <Stack.Screen
          name={ROUTER.editLookingFor}
          component={EditLookingForScreen}
        />
        <Stack.Screen name={ROUTER.editLiving} component={EditLivingScreen} />
        <Stack.Screen
          name="EditHeightScreen"
          component={EditHeightScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTER.editUniversity}
          component={EditUniversityScreen}
        />
        <Stack.Screen
          name={ROUTER.editHomeTown}
          component={EditHomeTownScreen}
        />
        <Stack.Screen
          name={ROUTER.editDrinking}
          component={EditDrinkingScreen}
        />
        <Stack.Screen name={ROUTER.editSmoking} component={EditSmokingScreen} />
        <Stack.Screen name={ROUTER.editYourKid} component={EditYourKidScreen} />
        <Stack.Screen name={ROUTER.chat} component={Chat} />
        <Stack.Screen
          name={ROUTER.conversation}
          component={ConversationScreen}
        />
        <Stack.Screen name={ROUTER.profile} component={ProfileScreen} />
        <Stack.Screen name={ROUTER.post} component={PostScreen} />
        <Stack.Screen name={ROUTER.detailNew} component={DetailNewScreen} />
        <Stack.Screen name={ROUTER.video} component={VideoScreen} />
        <Stack.Screen
          name={ROUTER.incomingCall}
          component={IncomingCallScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
