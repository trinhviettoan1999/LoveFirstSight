import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import {
  InputCustom,
  ButtonCustom,
  Eye,
  EyeDisable,
  Google,
  Facebook,
  HeaderCustom,
} from '../../components';

import * as firebase from '../../firebase/firebase';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {spacing, color} from '../../theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ROUTER} from '../../constants/router';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const background_image = require('../../../assets/images/background_default.png');

export const SignInScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const ref_input2 = useRef(null);
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [required, setRequired] = useState(false);

  const handleLogin = () => {
    setLoad(true);
    if (!password || !email) {
      setRequired(true);
      setLoad(false);
      return;
    }
    firebase.loginAccount(
      email,
      password,
      () => {
        navigation.replace(ROUTER.home);
        setLoad(false);
      },
      (error: any) => {
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Invalid-email. Please again!');
        }
        if (
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found'
        ) {
          Alert.alert('Invalid Account. Please again!');
        }
        setLoad(false);
      },
    );
  };

  return (
    <KeyboardAwareScrollView>
      <ImageBackground style={styles.image} source={background_image}>
        <HeaderCustom
          backgroundStatusBar={color.transparent}
          removeBorderWidth
        />
        <Text style={styles.textWelcome}>Welcome</Text>
        <ButtonCustom
          loading={load}
          title="CONTINUE WITH FACEBOOK"
          titleStyle={styles.textFacebook}
          containerStyle={styles.containerButton}
          buttonStyle={styles.buttonFacebook}
          icon={<Facebook />}
        />
        <ButtonCustom
          loading={load}
          title="CONTINUE WITH GOOGLE"
          titleStyle={styles.textGoogle}
          containerStyle={styles.containerButton}
          buttonStyle={styles.buttonGoogle}
          icon={<Google />}
        />
        <Text style={styles.textOrEmail}>OR LOGIN WITH EMAIL</Text>
        <InputCustom
          value={email}
          keyboardType="email-address"
          placeholder="Example@gmail.com"
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing={() => {
            // @ts-ignore: Object is possibly 'null'.
            ref_input2.current.focus();
          }}
          errorMessage={required && !email ? 'Email is required' : ''}
        />
        <InputCustom
          ref={ref_input2}
          value={password}
          placeholder="Password"
          onChangeText={(text) => setPassWord(text)}
          secureTextEntry={!show}
          rightIcon={
            <TouchableOpacity onPress={() => setShow(!show)}>
              {!show ? <Eye /> : <EyeDisable />}
            </TouchableOpacity>
          }
          errorMessage={required && !password ? 'Password is required' : ''}
        />
        <Text
          style={styles.textForgot}
          onPress={() => navigation.navigate(ROUTER.forGotPassword)}>
          Forgot Password?
        </Text>
        <ButtonCustom
          loading={load}
          title="LOG IN"
          onPress={handleLogin}
          containerStyle={styles.containerButton}
          buttonStyle={styles.button}
        />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text
            style={styles.textOptions}
            onPress={() => {
              navigation.navigate(ROUTER.enterMail);
            }}>
            {'ALREADY HAVE AN ACCOUNT? '}
          </Text>
          <Text
            style={[styles.textOptions, {color: '#8E97FD'}]}
            onPress={() => {
              navigation.navigate(ROUTER.enterMail);
            }}>
            SIGN UP
          </Text>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: HEIGHT,
    width: WIDTH,
    paddingHorizontal: spacing[4],
  },
  containerButton: {
    marginTop: spacing[5],
  },
  textOrEmail: {
    marginVertical: spacing[6],
    fontSize: 16,
    color: '#A1A4B2',
    fontWeight: '700',
    textAlign: 'center',
  },
  button: {
    minHeight: 50,
    borderRadius: spacing[5],
    width: WIDTH - 32,
    backgroundColor: color.primary,
  },
  buttonGoogle: {
    minHeight: 50,
    borderRadius: spacing[5],
    width: WIDTH - 32,
    backgroundColor: color.bgWhite,
    borderWidth: 2,
    borderColor: '#EBEAEC',
  },
  textGoogle: {
    fontSize: 14,
    color: color.text,
    lineHeight: 19,
    fontWeight: '400',
    marginLeft: spacing[4],
  },
  buttonFacebook: {
    minHeight: 50,
    borderRadius: spacing[5],
    width: WIDTH - 32,
    backgroundColor: '#7583CA',
  },
  textFacebook: {
    fontSize: 14,
    color: '#F6F1FB',
    lineHeight: 19,
    fontWeight: '400',
    marginLeft: spacing[4],
  },
  textForgot: {
    fontSize: 14,
    fontWeight: '400',
    color: color.text,
    textAlign: 'right',
    marginTop: -10,
  },
  textOptions: {
    marginTop: spacing[5],
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 15,
    fontStyle: 'normal',
    color: '#A1A4B2',
  },
  textShow: {
    fontSize: 14,
    color: color.primary,
    fontWeight: '500',
  },
  textWelcome: {
    fontSize: 30,
    color: color.text,
    fontWeight: '700',
    lineHeight: 37,
    textAlign: 'center',
  },
});
