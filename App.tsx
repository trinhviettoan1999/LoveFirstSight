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
} from './src/screens';
import {CustomIcon, RouteParamList} from './src/components';
import messaging from '@react-native-firebase/messaging';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RouteParamList>();
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
    // requestUserPermission();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
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
        initialRouteName="LoadingScreen"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InitialScreen"
          component={InitialScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EnterMailScreen"
          component={EnterMailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EnterCodeScreen"
          component={EnterCodeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EnterPassword"
          component={EnterPassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InitNameScreen"
          component={InitNameScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InitAgeScreen"
          component={InitAgeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InitIntroScreen"
          component={InitIntroScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InitHobbiesScreen"
          component={InitHobbiesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InitAvatarScreen"
          component={InitAvatarScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StaplerScreen"
          component={AppTab}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListIgnoreScreen"
          component={ListIgnoreScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListBlockScreen"
          component={ListBlockScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EmailScreen"
          component={EmailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ConnectedAccountScreen"
          component={ConnectedAccountScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EmailNotificationScreen"
          component={EmailNotificationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PushNotificationScreen"
          component={PushNotificationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditNameScreen"
          component={EditNameScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditAgeScreen"
          component={EditAgeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditGenderScreen"
          component={EditGenderScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditLookingForScreen"
          component={EditLookingForScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditLivingScreen"
          component={EditLivingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditHeightScreen"
          component={EditHeightScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditUniversityScreen"
          component={EditUniversityScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditHomeTownScreen"
          component={EditHomeTownScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditDrinkingScreen"
          component={EditDrinkingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditSmokingScreen"
          component={EditSmokingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditYourKidScreen"
          component={EditYourKidScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ConversationScreen"
          component={ConversationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PostScreen"
          component={PostScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailNewScreen"
          component={DetailNewScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VideoScreen"
          component={VideoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="IncomingCallScreen"
          component={IncomingCallScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
