import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {HeaderCustom, SelectionButtonGroup} from '../../../components';
import {updateUser} from '../../../controller';
import {ROUTER} from '../../../constants';
import {color} from '../../../theme';

const sampleAnswer = {
  options: [
    {
      optionText: 0,
      value: 'Chatting',
    },
    {
      optionText: 1,
      value: 'Friendship',
    },
    {
      optionText: 2,
      value: 'Prefer Not To Say',
    },
    {
      optionText: 3,
      value: 'Something Casual',
    },
    {
      optionText: 4,
      value: 'Long-term Relationship',
    },
  ],
};

const checkLookingFor = (lookingFor: string) => {
  if (lookingFor === 'Chatting') {
    return {
      optionText: 0,
      value: 'Chatting',
    };
  } else if (lookingFor === 'Friendship') {
    return {
      optionText: 1,
      value: 'Friendship',
    };
  } else if (lookingFor === 'Something Casual') {
    return {
      optionText: 3,
      value: 'Something Casual',
    };
  } else if (lookingFor === 'Prefer Not To Say') {
    return {
      optionText: 2,
      value: 'Prefer Not To Say',
    };
  } else {
    return {
      optionText: 4,
      value: 'Long-term Relationship',
    };
  }
};

export const EditLookingForScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [selectedItems, setItemSelected] = useState(
    checkLookingFor(route.params.lookingFor),
  );

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    updateUser({lookingFor: selectedItems.value});
    navigation.navigate(ROUTER.account, {flag: true});
  };

  return (
    <View style={styles.containerAll}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="Looking For"
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
