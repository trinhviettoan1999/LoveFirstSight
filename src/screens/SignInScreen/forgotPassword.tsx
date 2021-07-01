import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ImageBackground,
  Dimensions,
  Pressable,
} from 'react-native';
import {
  ButtonCustom,
  HeaderCustom,
  InputCustom,
  BackCircle,
} from '../../components';
import {useNavigation} from '@react-navigation/native';
import * as firebase from '../../firebase/firebase';
import {color, spacing} from '../../theme';

const background_image = require('../../../assets/images/background_default.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [valueEmail, onChangeTextEmail] = useState('');
  const [load, setLoad] = useState(false);
  const [required, setRequired] = useState(false);

  const handleContinue = () => {
    setLoad(true);
    if (!valueEmail) {
      setRequired(true);
      setLoad(false);
      return;
    }
    firebase.resetPassword(valueEmail).then(() => {
      Alert.alert(
        'Notification',
        'Please check email to reset password!!',
        [
          {
            text: 'OK',
            onPress: () => {
              setLoad(false);
              navigation.goBack();
            },
          },
        ],
        {cancelable: false},
      );
    });
  };

  return (
    <ImageBackground style={styles.image} source={background_image}>
      <HeaderCustom
        backgroundStatusBar={color.transparent}
        removeBorderWidth
        leftComponent={
          <Pressable onPress={() => navigation.goBack()}>
            <BackCircle />
          </Pressable>
        }
      />
      <View style={styles.container}>
        <Text style={styles.textQuestion}>What's your email?</Text>
        <Text style={styles.textReminder}>
          Type email to reset password. Please check email after reset!!
        </Text>
        <InputCustom
          value={valueEmail}
          keyboardType="email-address"
          placeholder="Example@gmail.com"
          onChangeText={(text) => onChangeTextEmail(text)}
          errorMessage={required && !valueEmail ? 'Email is required' : ''}
        />
        <ButtonCustom
          loading={load}
          title="SUBMIT"
          containerStyle={styles.containerButton}
          onPress={handleContinue}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    height: HEIGHT,
    width: WIDTH,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  containerButton: {
    alignSelf: 'center',
  },
  textQuestion: {
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: color.text,
    marginTop: 40,
  },
  textReminder: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#919191',
    marginTop: spacing[1],
    marginBottom: spacing[5],
  },
});
