import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  SelectionRadioHorizontal,
  HeaderCustom,
  ButtonCustom,
  InputCustom,
  BackCircle,
} from '../../components';
import {color, spacing} from '../../theme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Data = {
  Options: [
    {
      optionText: 0,
      value: 'Man',
    },
    {
      optionText: 1,
      value: 'Woman',
    },
    {
      optionText: 2,
      value: 'Other',
    },
  ],
};

const background_image = require('../../../assets/images/background_default.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const InitNameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [value, onChangeText] = useState('');
  const [gender, setGender] = useState('Man');
  const [required, setRequired] = useState(false);
  const [load, setLoad] = useState(false);
  const {user} = route.params;
  user.name = value;
  user.gender = gender;

  const handleContinue = () => {
    setLoad(true);
    if (!value) {
      setRequired(true);
      setLoad(false);
      return;
    }
    navigation.navigate('InitAgeScreen', {
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
          <Text style={styles.textQuestion}>Next up, what's your name?</Text>
          <Text style={styles.textNote}>
            This is how you’ll appear on Stapler
          </Text>
          <InputCustom
            value={value}
            placeholder="Your name"
            onChangeText={(text) => onChangeText(text)}
            errorMessage={required && !value ? 'Name is required' : ''}
          />
          <Text style={[styles.textQuestion, {marginTop: spacing[1]}]}>
            Your are a
          </Text>
          <SelectionRadioHorizontal
            Data={Data}
            gender={gender}
            setGender={setGender}
          />
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
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#919191',
    marginTop: spacing[2],
    marginBottom: spacing[5],
  },
});
