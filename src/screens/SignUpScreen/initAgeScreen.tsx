import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Header,
  RouteStackParamList,
  CustomIcon,
  StatusBarCustom,
} from '../../components';

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

const InitAgeScreen = ({
  route,
  navigation,
}: RouteStackParamList<'FirstScreen'>) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setAge(calculateAge(currentDate));
  };
  const [age, setAge] = useState(0);
  const {user} = route.params;
  user.birthday = getParsedDate(date);
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text style={styles.textQuestion}>
          Hey, {user.name}, when’s your bithday?
        </Text>
        <View style={styles.dateContainer}>
          <Text style={styles.textDate} onPress={() => setShow(true)}>
            {getParsedDate(date)}
          </Text>
          <CustomIcon
            name="calendar"
            size={20}
            color="#6A1616"
            onPress={() => setShow(true)}
          />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="calendar"
              onChange={onChange}
            />
          )}
        </View>
        <Text style={styles.textNote}>
          We need this to make sure you’ve over 18
        </Text>
        <TouchableHighlight
          style={[
            styles.button,
            {backgroundColor: age >= 18 ? '#6A1616' : '#E1E1E1'},
          ]}
          disabled={age >= 18 ? false : true}
          onPress={() =>
            navigation.navigate('InitIntroScreen', {
              user: user,
            })
          }>
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
  textNote: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#ACACAC',
    marginTop: 10,
    alignSelf: 'center',
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
  textDate: {
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginRight: 10,
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

export default InitAgeScreen;
