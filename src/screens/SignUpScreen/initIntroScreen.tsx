import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {color, spacing} from '../../theme';
import {ROUTER} from '../../constants/router';
import {
  BackCircle,
  HeaderCustom,
  ButtonCustom,
  openNotification,
} from '../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const background_image = require('../../../assets/images/background_default.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const InitIntroScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [load, setLoad] = useState(false);
  const [value, setValue] = useState('');
  const {user} = route.params;
  user.intro = value;

  const handleContinue = () => {
    setLoad(true);
    if (!value) {
      openNotification('danger', 'You must type any intro!!');
      setLoad(false);
      return;
    }
    navigation.navigate(ROUTER.initHobbies, {
      user: user,
    });
    setLoad(false);
  };

  return (
    <KeyboardAwareScrollView>
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
          <Text style={styles.textQuestion}>Your intro?</Text>
          <View style={styles.introContainer}>
            <TextInput
              autoFocus={true}
              value={value}
              onChangeText={setValue}
              style={styles.textInput}
              multiline={true}
              maxLength={500}
            />
          </View>
          <View style={styles.lengthContainer}>
            <Text style={styles.textLength}>{value.length} / 500</Text>
          </View>
          <Text style={styles.textNote}>Visible on your Stapler profile</Text>
          <ButtonCustom
            loading={load}
            title="CONTINUE"
            containerStyle={styles.containerButton}
            onPress={handleContinue}
          />
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: HEIGHT,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  containerButton: {
    marginTop: spacing[2],
    alignSelf: 'center',
  },
  textQuestion: {
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: color.text,
    marginTop: 40,
  },
  textNote: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#ACACAC',
    marginTop: 10,
    alignSelf: 'center',
  },
  introContainer: {
    height: 100,
  },
  lengthContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#919191',
    paddingBottom: 5,
  },
  textInput: {
    fontSize: 17,
    fontWeight: '400',
    fontStyle: 'normal',
    color: color.primary,
  },
  textLength: {
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '500',
    color: '#919191',
  },
});
