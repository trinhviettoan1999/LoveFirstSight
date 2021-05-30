import React from 'react';
import {RadioButton} from 'react-native-paper';
import {StyleSheet, View, Text} from 'react-native';

type Props = {
  Data: any;
  gender: string;
  setGender: any;
};

export const SelectionRadioHorizontal = ({Data, gender, setGender}: Props) => {
  return (
    <View style={styles.containerAll}>
      <RadioButton.Group
        onValueChange={(gender) => setGender(gender)}
        value={gender}>
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
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  text: {
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
});
