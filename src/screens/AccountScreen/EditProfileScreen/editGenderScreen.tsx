import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SelectionRadioGroup, HeaderCustom} from '../../../components';
import {ROUTER} from '../../../constants';
import {updateUser} from '../../../controller';
import {color} from '../../../theme';

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

const checkValue = (gender: string) => {
  if (gender === 'Man') {
    return 'Man';
  } else if (gender === 'Woman') {
    return 'Woman';
  } else {
    return 'Other';
  }
};

export const EditGenderScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [value, setValue] = useState(checkValue(route.params.gender));

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    updateUser({gender: value});
    navigation.navigate(ROUTER.account, {flag: true});
  };

  return (
    <View style={styles.containerAll}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="Gender"
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
        <SelectionRadioGroup Data={Data} value={value} setValue={setValue} />
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
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
  },
});
