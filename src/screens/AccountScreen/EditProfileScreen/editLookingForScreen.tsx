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

export const EditLookingForScreen = ({
  route,
  navigation,
}: RouteStackParamList<'AccountScreen'>) => {
  const [selectedItems, setItemSelected] = useState(
    checkLookingFor(route.params.lookingFor),
  );
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Looking For"
        showTextLeft={true}
        textLeft="Cancel"
        showTextRight={true}
        textRight="Done"
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => {
          updateUser({lookingFor: selectedItems.value});
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
