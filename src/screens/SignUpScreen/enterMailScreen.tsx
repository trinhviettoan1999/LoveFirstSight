import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableHighlight, Alert} from 'react-native';
import {
  Header,
  RouteStackParamList,
  InputView,
  StatusBarCustom,
} from '../../components';

const getCode = (email: string) => {
  return fetch(
    'https://still-brushlands-96770.herokuapp.com/profile/send-code',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    },
  )
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.log(error);
    });
};

const EnterMailScreen = ({navigation}: RouteStackParamList<'FirstScreen'>) => {
  const [valueEmail, onChangeTextEmail] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [inotify, setInotify] = useState('CONTINUE');
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
          Don’t lose access to your account, verify your email.
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
            setInotify('SUBMITTING');
            getCode(valueEmail).then((data) => {
              console.log(data);
              if (data === 'that email address is already in use!') {
                Alert.alert('That email address is already in use!');
              } else {
                navigation.navigate('EnterCodeScreen', {
                  user: {
                    email: valueEmail,
                  },
                  code: data,
                });
              }
              setInotify('CONTINUE');
            });
          }}>
          <Text style={styles.textButton}>{inotify}</Text>
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

export default EnterMailScreen;
