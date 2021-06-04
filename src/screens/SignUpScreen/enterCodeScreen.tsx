import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TextInput,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  BackCircle,
  ButtonCustom,
  Header,
  HeaderCustom,
  StatusBarCustom,
} from '../../components';
import GetLocation from 'react-native-get-location';
import {color, spacing} from '../../theme';
import {ROUTER} from '../../constants/router';

const background_image = require('../../../assets/images/background_default.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const EnterCodeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [value1, onChangeText1] = useState('');
  const [value2, onChangeText2] = useState('');
  const [value3, onChangeText3] = useState('');
  const [value4, onChangeText4] = useState('');
  const [value5, onChangeText5] = useState('');
  const [value6, onChangeText6] = useState('');
  const [isCode, setIsCode] = useState(true);
  const [load, setLoad] = useState(false);
  const ref_input1 = useRef(null);
  const ref_input2 = useRef(null);
  const ref_input3 = useRef(null);
  const ref_input4 = useRef(null);
  const ref_input5 = useRef(null);
  const ref_input6 = useRef(null);
  const ref_button = useRef(null);
  const {user, code} = route.params;

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
    var value = value1 + value2 + value3 + value4 + value5 + value6;
    if (value === code) {
      setIsCode(true);
      setLoad(false);
      navigation.navigate(ROUTER.enterPassword, {user: user});
    } else {
      setLoad(false);
      setIsCode(false);
      onChangeText1('');
      onChangeText2('');
      onChangeText3('');
      onChangeText4('');
      onChangeText5('');
      onChangeText6('');
      // @ts-ignore: Object is possibly 'null'.
      ref_input1.current.focus();
    }
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
        <Text style={styles.textQuestion}>Your code is:</Text>
        <View style={styles.emailContainer}>
          <Text style={styles.textEmail}>{user.email}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            value={value1}
            onChangeText={(text) => {
              onChangeText1(text);
              if (text !== '') {
                // @ts-ignore: Object is possibly 'null'.
                ref_input2.current.focus();
              }
            }}
            keyboardType="numeric"
            autoFocus={true}
            ref={ref_input1}
          />
          <TextInput
            style={styles.inputText}
            value={value2}
            onChangeText={(text) => {
              onChangeText2(text);
              if (text !== '') {
                // @ts-ignore: Object is possibly 'null'.
                ref_input3.current.focus();
              }
            }}
            keyboardType="numeric"
            ref={ref_input2}
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.inputText}
            value={value3}
            onChangeText={(text) => {
              onChangeText3(text);
              if (text !== '') {
                // @ts-ignore: Object is possibly 'null'.
                ref_input4.current.focus();
              }
            }}
            keyboardType="numeric"
            ref={ref_input3}
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.inputText}
            value={value4}
            onChangeText={(text) => {
              onChangeText4(text);
              if (text !== '') {
                // @ts-ignore: Object is possibly 'null'.
                ref_input5.current.focus();
              }
            }}
            keyboardType="numeric"
            ref={ref_input4}
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.inputText}
            value={value5}
            onChangeText={(text) => {
              onChangeText5(text);
              if (text !== '') {
                // @ts-ignore: Object is possibly 'null'.
                ref_input6.current.focus();
              }
            }}
            keyboardType="numeric"
            ref={ref_input5}
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.inputText}
            value={value6}
            onChangeText={(text) => {
              onChangeText6(text);
            }}
            keyboardType="numeric"
            ref={ref_input6}
            blurOnSubmit={false}
          />
        </View>
        {isCode ? null : <Text style={styles.textError}>Invalid code</Text>}
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
    marginTop: spacing[6],
    alignSelf: 'center',
  },
  textQuestion: {
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: color.text,
    marginTop: 40,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textEmail: {
    flex: 2,
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#6E6E6E',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  inputText: {
    height: 50,
    width: 30,
    borderBottomWidth: 2,
    borderColor: color.primary,
    textAlign: 'center',
    fontSize: 36,
    paddingBottom: 0,
  },
  textError: {
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    color: 'red',
    marginTop: spacing[3],
  },
});
