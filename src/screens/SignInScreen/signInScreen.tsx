import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  Image,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  StatusBarCustom,
  RouteStackParamList,
  InputCustom,
} from '../../components';

import * as firebase from '../../firebase/firebase';

export const SignInScreen = ({
  navigation,
}: RouteStackParamList<'FirstScreen'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const ref_input1 = useRef(null);
  const ref_input2 = useRef(null);
  const [textNotify, setTextNotify] = useState('LOG IN');
  return (
    <ScrollView
      style={styles.allContainer}
      contentContainerStyle={styles.scroll}>
      <StatusBarCustom backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.introductionContainer}>
        <Image
          style={{width: 270, height: 100}}
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/stapler-cf434.appspot.com/o/logo%2FLogo.png?alt=media',
          }}
        />
      </View>
      <View style={styles.loginContainer}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
          <InputCustom
            value={email}
            keyboardType="email-address"
            placeholder="Example@gmail.com"
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={() => {
              // @ts-ignore: Object is possibly 'null'.
              ref_input2.current.focus();
            }}
          />
          <InputCustom
            ref={ref_input2}
            value={password}
            placeholder="Password"
            onChangeText={(text) => setPassWord(text)}
            secureTextEntry={true}
          />
          <Text
            style={styles.textForgot}
            onPress={() => navigation.navigate('ForgotPasswordScreen')}>
            Forgot Password?
          </Text>
          <TouchableHighlight
            disabled={email && password ? false : true}
            style={styles.button}
            onPress={() => {
              setTextNotify('SUBMITING');
              firebase.loginAccount(
                email,
                password,
                () => {
                  navigation.replace('StaplerScreen');
                },
                setTextNotify,
              );
            }}
            underlayColor="#FFEBEB">
            <Text style={styles.textButton}>{textNotify}</Text>
          </TouchableHighlight>
          <Text
            style={styles.textOptions}
            onPress={() => {
              navigation.navigate('EnterMailScreen');
            }}>
            Create an account
          </Text>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
  },
  loginContainer: {
    flex: 2,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  introductionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introductionText: {
    marginLeft: 16,
    color: '#6A1616',
    fontSize: 56,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  inputText: {
    width: '100%',
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    fontSize: 17,
    color: '#2b2731',
  },
  button: {
    width: 232,
    height: 54,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    alignSelf: 'center',
    backgroundColor: '#6A1616',
  },
  textButton: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#FFFFFF',
  },
  textForgot: {
    fontSize: 16,
    fontWeight: '900',
    color: '#6A1616',
    textAlign: 'right',
  },
  textOptions: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '800',
    fontStyle: 'normal',
    color: '#6A1616',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
