import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Header,
  SelectionRadioGroup,
  RouteStackParamList,
  StatusBarCustom,
} from '../../../components';
import {updateUser} from '../../../controller/updateUser';

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

export const EditGenderScreen = ({
  route,
  navigation,
}: RouteStackParamList<'AccountScreen'>) => {
  const [value, setValue] = useState(checkValue(route.params.gender));
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Gender"
        showTextLeft={true}
        textLeft="Cancel"
        showTextRight={true}
        textRight="Done"
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          updateUser({gender: value});
          navigation.navigate('AccountScreen', {flag: true});
        }}
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
});
