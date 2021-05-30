import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export const DropDownPickerCustom = ({Data}: any) => {
  const [value, setValue] = useState(150);
  return (
    <View style={styles.container}>
      <DropDownPicker
        items={Data}
        defaultValue={value}
        containerStyle={styles.containerHeight}
        style={styles.style}
        itemStyle={styles.item}
        dropDownStyle={styles.dropDown}
        onChangeItem={(item: any) => setValue(item.value)}
        labelStyle={styles.text}
        activeLabelStyle={{color: '#6A1616'}}
        dropDownMaxHeight={300}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  dropDown: {
    height: 'auto',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
  },
  text: {
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: '500',
    color: '#000000',
  },
});
