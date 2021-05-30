import React from 'react';
import {RadioButton} from 'react-native-paper';
import {StyleSheet, View, Text} from 'react-native';

export const SelectionRadioGroup = ({Data, value, setValue}: any) => {
  return (
    <View style={styles.containerAll}>
      <RadioButton.Group
        onValueChange={(value) => setValue(value)}
        value={value}>
        {Data.Options.map((item: any, i: any) => (
          <View style={styles.container} key={i}>
            <Text style={styles.text}>{item.value}</Text>
            <RadioButton value={item.value} color="#6A1616" />
          </View>
        ))}
      </RadioButton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 16,
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  text: {
    flex: 1,
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
});
