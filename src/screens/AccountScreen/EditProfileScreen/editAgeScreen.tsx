import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import DatePicker from 'react-native-date-picker';
import {HeaderCustom} from '../../../components';
import {color, spacing} from '../../../theme';
import {updateUser} from '../../../controller';
import {ROUTER} from '../../../constants/router';
import moment from 'moment';

export const EditAgeScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
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
      <View style={styles.container}>
        {/* <DatePicker date={date} onDateChange={setDate} mode="date" /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: spacing[4],
    alignItems: 'center',
  },
  containerAge: {
    height: 60,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginTop: 16,
    justifyContent: 'center',
    paddingTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
  },
});
