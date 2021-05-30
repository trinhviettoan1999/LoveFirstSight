import React, {useState, useRef} from 'react';
import {StyleSheet, View, Text, Image, Dimensions, Alert} from 'react-native';
import {
  InputCustom,
  ButtonCustom,
  Eye,
  EyeDisable,
  HeaderCustom,
} from '../../components';

import * as firebase from '../../firebase/firebase';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {spacing, color} from '../../theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ROUTER} from '../../constants/router';

const HEIGHT = Dimensions.get('screen').height;
const logo = require('../../../assets/images/Logo.png');

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
      <View style={styles.allContainer}>
        <HeaderCustom backgroundStatusBar={color.bgWhite} removeBorderWidth />
        <View style={styles.introductionContainer}>
          <Image style={{width: 270, height: 100}} source={logo} />
        </View>
        <View style={styles.loginContainer}>
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
          <View style={{alignItems: 'center'}}>
            <ButtonCustom
              loading={load}
              title="LOG IN"
              onPress={handleLogin}
              containerStyle={styles.button}
            />
          </View>
          <Text
            style={styles.textOptions}
            onPress={() => {
              navigation.navigate(ROUTER.enterMail);
            }}>
            Create an account
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    width: '100%',
    height: HEIGHT,
    backgroundColor: color.bgWhite,
  },
  loginContainer: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: spacing[8],
  },
  introductionContainer: {
    height: '20%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  introductionText: {
    marginLeft: 16,
    color: '#6A1616',
    fontSize: 56,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  button: {
    marginTop: spacing[5],
  },
  textForgot: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6A1616',
    textAlign: 'right',
    marginTop: -10,
  },
  textOptions: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#6A1616',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  textShow: {
    fontSize: 14,
    color: color.primary,
    fontWeight: '500',
  },
});
