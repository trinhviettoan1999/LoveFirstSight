import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableHighlight, Alert} from 'react-native';
import {
  Header,
  RouteStackParamList,
  InputView,
  StatusBarCustom,
} from '../../components';
import * as firebase from '../../firebase/firebase';

export const ForgotPasswordScreen = ({
  navigation,
}: RouteStackParamList<'FirstScreen'>) => {
  const [valueEmail, onChangeTextEmail] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text style={styles.textQuestion}>What's your email?</Text>
        <Text style={styles.textReminder}>
          Type email to reset password. Please check email after reset!!
        </Text>
        <View style={styles.inputContainer}>
          <InputView
            placeHolder="Enter email"
            value={valueEmail}
            onChangeText={onChangeTextEmail}
            autoFocus={true}
            checkEmail={true}
            setIsEmail={setIsEmail}
          />
        </View>
        {isEmail ? null : (
          <Text style={styles.textError}>Invalid email address</Text>
        )}
        <TouchableHighlight
          style={[
            styles.button,
            {backgroundColor: isEmail ? '#6A1616' : '#E1E1E1'},
          ]}
          disabled={!isEmail}
          onPress={() => {
            firebase.resetPassword(valueEmail).then(() => {
              Alert.alert(
                'Notification',
                'Please check email to reset password!!',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ],
                {cancelable: false},
              );
            });
          }}>
          <Text style={styles.textButton}>SUBMIT</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  textQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
    marginTop: 40,
  },
  textReminder: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#919191',
    marginTop: 10,
  },
  inputContainer: {
    height: 40,
    marginTop: 20,
    borderBottomWidth: 2,
  },
  button: {
    width: 190,
    height: 54,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    alignSelf: 'center',
  },
  textButton: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#FFFFFF',
  },
  textError: {
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#BB2424',
  },
});
