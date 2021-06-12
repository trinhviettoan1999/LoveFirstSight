import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {HeaderCustom, SelectionButtonGroup} from '../../../components';
import {updateUser} from '../../../controller';
import {color} from '../../../theme';
import {ROUTER} from '../../../constants/router';

const sampleAnswer = {
  options: [
    {
      optionText: 0,
      value: "Don't Have Kids",
    },
    {
      optionText: 1,
      value: 'Have Kids',
    },
    {
      optionText: 2,
      value: 'Prefer Not To Say',
    },
  ],
};

const checkKids = (kids: string) => {
  if (kids === "Don't Have Kids") {
    return {
      optionText: 0,
      value: "Don't Have Kids",
    };
  } else if (kids === 'Have Kids') {
    return {
      optionText: 1,
      value: 'Have Kids',
    };
  } else {
    return {
      optionText: 2,
      value: 'Prefer Not To Say',
    };
  }
};

export const EditYourKidScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedItems, setItemSelected] = useState(
    checkKids(route.params.kids),
  );

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    updateUser({kids: selectedItems.value});
    navigation.navigate(ROUTER.account, {flag: true});
  };

  return (
    <View style={styles.containerAll}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="Kids"
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

export default EditYourKidScreen;
