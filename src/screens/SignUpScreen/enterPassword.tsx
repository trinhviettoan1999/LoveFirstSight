import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  HeaderCustom,
  ButtonCustom,
  BackCircle,
  InputCustom,
} from '../../components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {color, spacing} from '../../theme';
import {ROUTER} from '../../constants/router';

const background_image = require('../../../assets/images/background_default.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const EnterPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [valuePassword, onChangeTextPassword] = useState('');
  const [required, setRequired] = useState(false);
  const [load, setLoad] = useState(false);
  const {user} = route.params;
  user.password = valuePassword;

  const handleContinue = () => {
    setLoad(true);
    if (!valuePassword) {
      setLoad(false);
      setRequired(true);
      return;
    }
    navigation.navigate(ROUTER.initName, {
      user: user,
    });
    setLoad(false);
  };

  return (
    <ImageBackground style={styles.image} source={background_image}>
      <HeaderCustom
        backgroundStatusBar={color.transparent}
        removeBorderWidth
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackCircle />
          </TouchableOpacity>
        }
      />
      <View style={styles.container}>
        <Text style={styles.textQuestion}>Type your password</Text>
        <Text style={styles.textReminder}>
          To access to your account, please type password.
        </Text>
        <InputCustom
          value={valuePassword}
          placeholder="Password must least 8 characters"
          onChangeText={(text) => onChangeTextPassword(text)}
          errorMessage={
            required && !valuePassword ? 'Password is required' : ''
          }
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
    marginTop: spacing[2],
    marginBottom: spacing[5],
  },
});
