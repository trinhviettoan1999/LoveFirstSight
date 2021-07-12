import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  ButtonCustom,
  HeaderCustom,
  InputCustom,
  BackCircle,
  openNotification,
} from '../../components';
import {spacing, color} from '../../theme';
import {ROUTER} from '../../constants/router';

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

const background_image = require('../../../assets/images/background_default.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const EnterMailScreen = () => {
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
    } else if (!validateEmail(valueEmail)) {
      setRequired(true);
      setLoad(false);
      return;
    }
    getCode(valueEmail).then((data) => {
      if (data === 'that email address is already in use!') {
        setLoad(false);
        openNotification('danger', 'That email address is already in use!');
      } else {
        setLoad(false);
        navigation.navigate(ROUTER.enterCode, {
          user: {
            email: valueEmail,
          },
          code: data,
        });
      }
    });
  };

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const checkEmail = () => {
    if (required && !valueEmail) {
      return 'Email is required';
    } else if (required && !validateEmail(valueEmail)) {
      return 'Email not valid!';
    }
    return '';
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
          Don’t lose access to your account, verify your email.
        </Text>
        <InputCustom
          value={valueEmail}
          keyboardType="email-address"
          placeholder="Example@gmail.com"
          onChangeText={(text) => onChangeTextEmail(text)}
          errorMessage={checkEmail()}
        />
        <ButtonCustom
          loading={load}
          title="CONTINUE"
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
    paddingHorizontal: spacing[4],
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
    marginTop: 10,
    marginBottom: spacing[5],
  },
  containerButton: {
    alignSelf: 'center',
  },
});
