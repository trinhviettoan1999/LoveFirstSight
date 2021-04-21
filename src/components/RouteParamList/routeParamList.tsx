import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type RouteParamList = {
  InitialScreen: undefined;
  LoadingScreen: undefined;
  ForgotPasswordScreen: undefined;
  EnterMailScreen: {
    user: Object;
    code: string;
  };
  EnterCodeScreen: {
    user: Object;
  };
  EnterPassword: {
    user: Object;
  };
  InitNameScreen: {
    user: Object;
  };
  InitAgeScreen: {
    user: Object;
  };
  InitIntroScreen: {
    user: Object;
  };
  InitHobbiesScreen: {
    user: Object;
  };
  InitAvatarScreen: {
    user: Object;
  };
  StaplerScreen: undefined;
  AccountScreen: undefined;
  SettingsScreen: undefined;
  EmailScreen: undefined;
  ConnectedAccountScreen: undefined;
  EmailNotificationScreen: undefined;
  PushNotificationScreen: undefined;
  EditNameScreen: undefined;
  EditAgeScreen: undefined;
  EditGenderScreen: {
    flag: boolean;
  };
  EditLookingForScreen: {
    flag: boolean;
  };
  EditLivingScreen: {
    flag: boolean;
  };
  EditHeightScreen: {
    flag: boolean;
  };
  EditUniversityScreen: {
    flag: boolean;
  };
  EditHomeTownScreen: {
    flag: boolean;
  };
  EditDrinkingScreen: {
    flag: boolean;
  };
  EditSmokingScreen: {
    flag: boolean;
  };
  EditYourKidScreen: {
    flag: boolean;
  };
  SignInScreen: undefined;
  Chat: undefined;
  ConversationScreen: {
    name: string;
    avatar: string;
    ownerId: string;
  };
  ProfileScreen: {
    userId: string;
  };
  ListBlockScreen: undefined;
  ListIgnoreScreen: undefined;
  PostScreen: undefined;
  DetailNewScreen: {
    postId: string;
    listCollections: any;
    content: string;
  };
  NewsScreen: undefined;
  VideoScreen: undefined;
  IncomingCallScreen: undefined;
};

export type RouteStackParamList<T extends keyof RouteParamList> = {
  navigation: StackNavigationProp<RouteParamList, T>;
  route: RouteProp<RouteParamList, T>;
};
