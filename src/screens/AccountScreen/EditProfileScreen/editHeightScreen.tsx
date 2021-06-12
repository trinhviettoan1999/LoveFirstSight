import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {HeaderCustom, Tick} from '../../../components';
import {ROUTER} from '../../../constants';
import {updateUser} from '../../../controller';
import {color} from '../../../theme';

const Data = require('../../../../assets/json/height.json');

export const EditHeightScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(route.params.height);
  const [items, setItems] = useState(Data);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    updateUser({height: value});
    navigation.navigate(ROUTER.account, {flag: true});
  };

  return (
    <View style={styles.containerAll}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="Height"
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
        <DropDownPicker
          value={value}
          setValue={setValue}
          open={open}
          setOpen={setOpen}
          items={items}
          setItems={setItems}
          containerStyle={styles.containerHeight}
          style={styles.style}
          labelStyle={styles.text}
          textStyle={{fontSize: 16}}
          maxHeight={500}
          TickIconComponent={() => <Tick />}
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
  containerHeight: {
    height: 40,
    marginTop: 16,
  },
  style: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  item: {
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: '500',
    color: color.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
  },
});
