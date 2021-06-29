import React, {useState} from 'react';
import {StyleSheet, View, Text, Platform, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Calender, HeaderCustom} from '../../../components';
import {color, spacing} from '../../../theme';
import {updateUser} from '../../../controller';
import {ROUTER} from '../../../constants/router';
import moment from 'moment';
import RNDateTimePicker from '@react-native-community/datetimepicker';

export const EditAgeScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    updateUser({birthday: moment(date).format('YYYY-MM-D').toString()});
    navigation.navigate(ROUTER.account, {flag: true});
  };

  return (
    <View style={styles.containerAll}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="Age"
        leftComponent={
          <Text
            onPress={handleCancel}
            style={[styles.title, {color: color.text}]}>
            Cancel
          </Text>
        }
        rightComponent={
          <Text
            onPress={handleDone}
            style={[styles.title, {color: color.blue}]}>
            Done
          </Text>
        }
      />
      {Platform.OS === 'android' ? (
        <View style={styles.container}>
          <Pressable style={styles.containerText} onPress={() => setShow(true)}>
            <Calender />
            <Text style={styles.textDate}>
              {moment(date).format('YYYY-MM-D')}
            </Text>
          </Pressable>
          {show && (
            <RNDateTimePicker
              testID="dateTimePicker"
              display="default"
              value={date}
              mode="date"
              onChange={onChange}
            />
          )}
        </View>
      ) : (
        <RNDateTimePicker
          testID="dateTimePicker"
          display="spinner"
          value={date}
          mode="date"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: spacing[4],
    alignItems: 'center',
  },
  containerText: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: color.light,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  textDate: {
    marginLeft: 5,
    fontSize: 16,
    color: color.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
  },
});
