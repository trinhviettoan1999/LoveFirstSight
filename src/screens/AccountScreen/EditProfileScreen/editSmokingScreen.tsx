import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SelectionButtonGroup, HeaderCustom} from '../../../components';
import {updateUser} from '../../../controller';
import {color, spacing} from '../../../theme';
import {ROUTER} from '../../../constants/router';

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

export const EditSmokingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedItems, setItemSelected] = useState(
    checkSmoking(route.params.smoking),
  );

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    updateUser({smoking: selectedItems.value});
    navigation.navigate(ROUTER.account, {flag: true});
  };

  return (
    <View style={styles.containerAll}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="Smoking"
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
  title: {
    fontSize: 18,
    fontWeight: '400',
  },
});

export default EditSmokingScreen;
