import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  Pressable,
  ImageBackground,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {color, spacing} from '../../theme';
import {
  BackCircle,
  HeaderCustom,
  ButtonCustom,
  openNotification,
  Calender,
} from '../../components';
import {ROUTER} from '../../constants/router';

//format date
function getParsedDate(strDate: Date) {
  var date = new Date(strDate);
  var dateFormat = '';
  var dd = date.getDate().toString();
  var mm = (date.getMonth() + 1).toString();
  var yyyy = date.getFullYear();
  if (parseInt(dd) < 10) {
    dd = '0' + dd;
  }
  if (parseInt(mm) < 10) {
    mm = '0' + mm;
  }
  dateFormat = yyyy + '-' + mm + '-' + dd;
  return dateFormat;
}
//calculate age
function calculateAge(strDate: Date) {
  var today = new Date();
  var birthDate = new Date(strDate);
  var age_now = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--;
  }
  return age_now;
}

const background_image = require('../../../assets/images/background_default.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const InitAgeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setAge(calculateAge(currentDate));
  };
  const [age, setAge] = useState(0);
  const {user} = route.params;
  user.birthday = getParsedDate(date);

  const handleContinue = () => {
    setLoad(true);
    if (age < 18) {
      setLoad(false);
      openNotification('danger', "You haven't enough age to use app!!");
      return;
    }
    navigation.navigate(ROUTER.initIntro, {
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
          <Pressable onPress={() => navigation.goBack()}>
            <BackCircle />
          </Pressable>
        }
      />
      <View style={styles.container}>
        <Text style={styles.textQuestion}>
          Hey, {user.name}, when’s your bithday?
        </Text>
        {Platform.OS === 'ios' && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="spinner"
            onChange={onChange}
          />
        )}
        {Platform.OS === 'android' && (
          <View style={styles.dateContainer}>
            <Calender />
            <Text style={styles.textDate} onPress={() => setShow(true)}>
              {getParsedDate(date)}
            </Text>
            {show && Platform.OS === 'android' && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>
        )}
        <Text style={styles.textNote}>
          We need this to make sure you’ve over 18
        </Text>
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
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#ACACAC',
    marginTop: 10,
    alignSelf: 'center',
  },
  textDate: {
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 5,
  },
  dateContainer: {
    marginTop: 30,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
