import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import {Header, RouteStackParamList, StatusBarCustom} from '../../components';
import GetLocation from 'react-native-get-location';

const EnterCodeScreen = ({
  route,
  navigation,
}: RouteStackParamList<'FirstScreen'>) => {
  const [value1, onChangeText1] = useState('');
  const [value2, onChangeText2] = useState('');
  const [value3, onChangeText3] = useState('');
  const [value4, onChangeText4] = useState('');
  const [value5, onChangeText5] = useState('');
  const [value6, onChangeText6] = useState('');
  const [isCode, setIsCode] = useState(true);
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

  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack('EnterMailScreen')}
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
        <TouchableHighlight
          ref={ref_button}
          style={[
            styles.button,
            {backgroundColor: value6 != '' ? '#6A1616' : '#E1E1E1'},
          ]}
          disabled={value6 != '' ? false : true}
          onPress={() => {
            var value = value1 + value2 + value3 + value4 + value5 + value6;
            if (value === code) {
              setIsCode(true);
              navigation.navigate('EnterPassword', {user: user});
            } else {
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
  textResend: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#ACACAC',
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
    textAlign: 'center',
    fontSize: 36,
    paddingBottom: 0,
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
    marginTop: 10,
  },
});

export default EnterCodeScreen;
