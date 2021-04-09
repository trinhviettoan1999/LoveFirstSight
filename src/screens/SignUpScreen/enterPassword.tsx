import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {
  Header,
  RouteStackParamList,
  InputView,
  StatusBarCustom,
} from '../../components';

const EnterPassword = ({
  route,
  navigation,
}: RouteStackParamList<'FirstScreen'>) => {
  const [valuePassword, onChangeTextPassword] = useState('');
  const {user} = route.params;
  user.password = valuePassword;
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text style={styles.textQuestion}>Type your password</Text>
        <Text style={styles.textReminder}>
          To access to your account, please type password.
        </Text>
        <View style={styles.inputContainer}>
          <InputView
            placeHolder="Enter password"
            value={valuePassword}
            onChangeText={onChangeTextPassword}
            autoFocus={true}
            secureTextEntry={true}
          />
        </View>
        {valuePassword.length >= 8 ? null : (
          <Text style={styles.textError}>
            Password must contain at least 8 characters
          </Text>
        )}
        <TouchableHighlight
          style={[
            styles.button,
            {
              backgroundColor:
                valuePassword.length >= 8 ? '#6A1616' : '#E1E1E1',
            },
          ]}
          disabled={valuePassword.length >= 8 ? false : true}
          onPress={() => {
            navigation.navigate('InitNameScreen', {
              user: user,
            });
          }}>
          <Text style={styles.textButton}>CONTINUE</Text>
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

export default EnterPassword;
