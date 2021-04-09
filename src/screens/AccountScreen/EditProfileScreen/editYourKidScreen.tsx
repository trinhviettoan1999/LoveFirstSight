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

const EditYourKidScreen = ({
  route,
  navigation,
}: RouteStackParamList<'AccountScreen'>) => {
  const [selectedItems, setItemSelected] = useState(
    checkKids(route.params.kids),
  );
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Your Kids"
        showTextLeft={true}
        textLeft="Cancel"
        showTextRight={true}
        textRight="Done"
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => {
          updateUser({kids: selectedItems.value});
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

export default EditYourKidScreen;
