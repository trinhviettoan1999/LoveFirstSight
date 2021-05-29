import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Header,
  SelectionButtonGroup,
  RouteStackParamList,
  StatusBarCustom,
} from '../../../components';
import {updateUser} from '../../../controller/updateUser';

const sampleAnswer = {
  options: [
    {
      optionText: 0,
      value: 'Never',
    },
    {
      optionText: 1,
      value: 'Occasionally',
    },
    {
      optionText: 2,
      value: 'Often',
    },
    {
      optionText: 3,
      value: 'Prefer Not To Say',
    },
  ],
};

const checkSmoking = (smoking: string) => {
  if (smoking === 'Never') {
    return {
      optionText: 0,
      value: 'Never',
    };
  } else if (smoking === 'Occasionally') {
    return {
      optionText: 1,
      value: 'Occasionally',
    };
  } else if (smoking === 'Often') {
    return {
      optionText: 2,
      value: 'Often',
    };
  } else {
    return {
      optionText: 3,
      value: 'Prefer Not To Say',
    };
  }
};

export const EditSmokingScreen = ({
  route,
  navigation,
}: RouteStackParamList<'AcountScreen'>) => {
  const [selectedItems, setItemSelected] = useState(
    checkSmoking(route.params.smoking),
  );
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Smoking"
        showTextLeft={true}
        textLeft="Cancel"
        showTextRight={true}
        textRight="Done"
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => {
          updateUser({smoking: selectedItems.value});
          navigation.navigate('AccountScreen', {flag: true});
        }}
      />
      <View style={styles.container}>
        <SelectionButtonGroup
          data={sampleAnswer.options}
          setItemSelected={setItemSelected}
          maxMultiSelect={1}
          defaultSelection={selectedItems.optionText}
        />
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

export default EditSmokingScreen;
