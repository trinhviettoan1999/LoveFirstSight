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
} from 'react-native';
import {
  StatusBarCustom,
  CustomIcon,
  RouteStackParamList,
} from '../../components';
import Modal from 'react-native-modal';

import * as firebase from '../../firebase/firebase';

const SignInScreen = ({navigation}: RouteStackParamList<'FirstScreen'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const ref_input1 = useRef(null);
  const ref_input2 = useRef(null);
  const [textNotify, setTextNotify] = useState('LOG IN');
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <View style={styles.allContainer}>
      <StatusBarCustom backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.introductionContainer}>
        <Image
          style={{width: 270, height: 100}}
          source={{
            uri:
              'https://firebasestorage.googleapis.com/v0/b/stapler-cf434.appspot.com/o/logo%2FLogo.png?alt=media',
          }}
        />
      </View>
      <View style={styles.loginContainer}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
          <TextInput
            style={styles.inputText}
            value={email}
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={() => {
              // @ts-ignore: Object is possibly 'null'.
              ref_input2.current.focus();
            }}
            textContentType="emailAddress"
            placeholder="Example@gmail.com"
            blurOnSubmit={false}
            ref={ref_input1}
          />
          <TextInput
            style={styles.inputText}
            value={password}
            onChangeText={(text) => setPassWord(text)}
            secureTextEntry={true}
            placeholder="Password"
            ref={ref_input2}
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
            onPress={() => setIsModalVisible(true)}>
            Other Options
          </Text>
        </KeyboardAvoidingView>
      </View>
      <Modal
        swipeDirection="down"
        onSwipeComplete={() => setIsModalVisible(false)}
        hideModalContentWhileAnimating
        isVisible={isModalVisible}
        style={styles.modalOptions}
        onBackdropPress={() => setIsModalVisible(false)}
        backdropOpacity={0.5}>
        {/* <View style={styles.buttonModal}>
          <Image
            style={styles.iconModal}
            source={{
              uri:
                'https://firebasestorage.googleapis.com/v0/b/stapler-cf434.appspot.com/o/logo%2Ffacebook-icon.png?alt=media',
            }}
          />
          <Text style={styles.textButtonModal}>Log In With Facebook</Text>
        </View>
        <View style={styles.buttonModal}>
          <Image
            style={styles.iconModal}
            source={{
              uri:
                'https://firebasestorage.googleapis.com/v0/b/stapler-cf434.appspot.com/o/logo%2Fgoogle-icon.png?alt=media',
            }}
          />
          <Text style={styles.textButtonModal}>Log In With Google</Text>
        </View> */}
        <View style={styles.buttonModal}>
          <CustomIcon
            name="create-account"
            size={30}
            color="#212121"
            style={{marginRight: 20}}
          />
          <Text
            style={styles.textButtonModal}
            onPress={() => {
              navigation.navigate('EnterMailScreen');
              setIsModalVisible(false);
            }}>
            Create An Account
          </Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    marginTop: 10,
    fontSize: 18,
    fontWeight: '900',
    color: '#6A1616',
    textAlign: 'right',
  },
  textOptions: {
    marginTop: 60,
    fontSize: 18,
    fontWeight: '800',
    fontStyle: 'normal',
    color: '#6A1616',
    textAlign: 'center',
  },
  modalOptions: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonModal: {
    backgroundColor: '#F8F8F8',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  textButtonModal: {
    flex: 2,
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
  },
  iconModal: {
    width: 30,
    height: 30,
    marginRight: 20,
  },
});

export default SignInScreen;
