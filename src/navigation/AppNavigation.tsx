import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import * as screen from '../screens';
import {
  Home,
  HomeFill,
  SupperLike,
  SupperLikeFill,
  Conversation,
  ConversationFill,
  Account,
  AccountFill,
  NewFill,
  New,
} from '../components';
import messaging from '@react-native-firebase/messaging';
import FlashMessage from 'react-native-flash-message';
import {ROUTER} from '../constants';
import {Alert, AppState} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AppTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          if (route.name === ROUTER.home) {
            return focused ? <HomeFill /> : <Home />;
          } else if (route.name === ROUTER.likedYou) {
            return focused ? <SupperLikeFill /> : <SupperLike />;
          } else if (route.name === ROUTER.conversation) {
            return focused ? <ConversationFill /> : <Conversation />;
          } else if (route.name === ROUTER.account) {
            return focused ? <AccountFill /> : <Account />;
          } else if (route.name === ROUTER.news) {
            return focused ? <NewFill /> : <New />;
          }
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
      <Tab.Screen name={ROUTER.home} component={screen.StaplerScreen} />
      <Tab.Screen name={ROUTER.news} component={screen.NewsScreen} />
      <Tab.Screen name={ROUTER.likedYou} component={screen.LikedYouScreen} />
      <Tab.Screen
        name={ROUTER.conversation}
        component={screen.ConversationScreen}
      />
      <Tab.Screen name={ROUTER.account} component={screen.AccountScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigation = () => {
  const navigationRef = useRef(null);
  function navigate(name: string, params: any) {
    // @ts-ignore: Object is possibly 'null'.
    navigationRef.current && navigationRef.current.navigate(name, params);
  }

  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log(remoteMessage);
        if (remoteMessage.data?.type === 'CallVideo') {
          navigate(ROUTER.incomingCall, {
            name: remoteMessage.data?.name,
            avatar: remoteMessage.data?.avatar,
            appId: JSON.parse(remoteMessage.data.infoChannel).appId,
            channelName: JSON.parse(remoteMessage.data.infoChannel).channelName,
            userId: parseInt(remoteMessage.data?.userId),
          });
          return;
        }
      },
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data?.type === 'CallVideo') {
        navigate(ROUTER.incomingCall, {
          name: remoteMessage.data?.name,
          avatar: remoteMessage.data?.avatar,
          appId: JSON.parse(remoteMessage.data.infoChannel).appId,
          channelName: JSON.parse(remoteMessage.data.infoChannel).channelName,
          userId: parseInt(remoteMessage.data?.userId),
          ownerId: remoteMessage.data?.ownerId,
        });
        return;
      }
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
        <Stack.Screen name={ROUTER.loading} component={screen.LoadingScreen} />
        <Stack.Screen name={ROUTER.initial} component={screen.InitialScreen} />
        <Stack.Screen name={ROUTER.signIn} component={screen.SignInScreen} />
        <Stack.Screen
          name={ROUTER.forGotPassword}
          component={screen.ForgotPasswordScreen}
        />
        <Stack.Screen
          name={ROUTER.enterMail}
          component={screen.EnterMailScreen}
        />
        <Stack.Screen
          name={ROUTER.enterCode}
          component={screen.EnterCodeScreen}
        />
        <Stack.Screen
          name={ROUTER.enterPassword}
          component={screen.EnterPassword}
        />
        <Stack.Screen
          name={ROUTER.initName}
          component={screen.InitNameScreen}
        />
        <Stack.Screen name={ROUTER.initAge} component={screen.InitAgeScreen} />
        <Stack.Screen
          name={ROUTER.initIntro}
          component={screen.InitIntroScreen}
        />
        <Stack.Screen
          name={ROUTER.initHobbies}
          component={screen.InitHobbiesScreen}
        />
        <Stack.Screen
          name={ROUTER.initAvatar}
          component={screen.InitAvatarScreen}
        />
        <Stack.Screen name={ROUTER.home} component={AppTab} />
        <Stack.Screen name={ROUTER.filter} component={screen.FilterScreen} />
        <Stack.Screen name={ROUTER.setting} component={screen.SettingsScreen} />
        <Stack.Screen
          name={ROUTER.listIgnore}
          component={screen.ListIgnoreScreen}
        />
        <Stack.Screen
          name={ROUTER.listBlock}
          component={screen.ListBlockScreen}
        />
        <Stack.Screen name={ROUTER.email} component={screen.EmailScreen} />
        <Stack.Screen
          name={ROUTER.connectedAccount}
          component={screen.ConnectedAccountScreen}
        />
        <Stack.Screen
          name={ROUTER.emailNotification}
          component={screen.EmailNotificationScreen}
        />
        <Stack.Screen
          name={ROUTER.pushNotification}
          component={screen.PushNotificationScreen}
        />
        <Stack.Screen
          name={ROUTER.editName}
          component={screen.EditNameScreen}
        />
        <Stack.Screen name={ROUTER.editAge} component={screen.EditAgeScreen} />
        <Stack.Screen
          name={ROUTER.editGender}
          component={screen.EditGenderScreen}
        />
        <Stack.Screen
          name={ROUTER.editLookingFor}
          component={screen.EditLookingForScreen}
        />
        <Stack.Screen
          name={ROUTER.editLiving}
          component={screen.EditLivingScreen}
        />
        <Stack.Screen
          name="EditHeightScreen"
          component={screen.EditHeightScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTER.editUniversity}
          component={screen.EditUniversityScreen}
        />
        <Stack.Screen
          name={ROUTER.editHomeTown}
          component={screen.EditHomeTownScreen}
        />
        <Stack.Screen
          name={ROUTER.editDrinking}
          component={screen.EditDrinkingScreen}
        />
        <Stack.Screen
          name={ROUTER.editSmoking}
          component={screen.EditSmokingScreen}
        />
        <Stack.Screen
          name={ROUTER.editYourKid}
          component={screen.EditYourKidScreen}
        />
        <Stack.Screen name={ROUTER.chat} component={screen.Chat} />
        <Stack.Screen
          name={ROUTER.conversation}
          component={screen.ConversationScreen}
        />
        <Stack.Screen name={ROUTER.profile} component={screen.ProfileScreen} />
        <Stack.Screen name={ROUTER.post} component={screen.PostScreen} />
        <Stack.Screen
          name={ROUTER.detailNew}
          component={screen.DetailNewScreen}
        />
        <Stack.Screen name={ROUTER.video} component={screen.VideoScreen} />
        <Stack.Screen
          name={ROUTER.incomingCall}
          component={screen.IncomingCallScreen}
        />
      </Stack.Navigator>
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
};
