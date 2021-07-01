import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
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
import GetLocation from 'react-native-get-location';
import {ROUTER} from '../../constants/router';

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
  const [gender, setGender] = useState('Man');
  const [required, setRequired] = useState(false);
  const [load, setLoad] = useState(false);
  const {user} = route.params;
  const [value, onChangeText] = useState(user.name);
  user.name = value;
  user.gender = gender;

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    })
      .then((location) => {
        user.coordinates = {
          lat: location.latitude,
          long: location.longitude,
        };
      })
      .catch((error) => {
        const {code, message} = error;
        console.warn(code, message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    setLoad(true);
    if (!value) {
      setRequired(true);
      setLoad(false);
      return;
    }
    navigation.navigate(ROUTER.initAge, {
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
            <Pressable onPress={() => navigation.goBack()}>
              <BackCircle />
            </Pressable>
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
