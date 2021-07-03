import {color, spacing} from '../../theme';
import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface IProps {
  age: number[];
  setAge: (value: number[]) => void;
}

export const FilterMultiSlider: FC<IProps> = ({age, setAge}) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.wrapText}>
        <Text style={styles.title}>Age range</Text>
        <Text style={styles.textSub}>
          {age[0]} - {age[1]}
        </Text>
      </View>
      <MultiSlider
        containerStyle={{marginHorizontal: spacing[4]}}
        min={18}
        max={50}
        selectedStyle={{backgroundColor: color.primary}}
        markerStyle={styles.marker}
        trackStyle={styles.track}
        values={age}
        onValuesChange={(result) => {
          setAge(result);
        }}
        snapped
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: color.bgWhite,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    marginTop: spacing[3],
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  wrapText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: color.text,
  },
  textSub: {
    fontSize: 18,
    fontWeight: '500',
    color: color.text,
  },
  track: {
    height: 4,
    backgroundColor: '#e6e6e6',
  },
  marker: {
    height: 20,
    width: 20,
    backgroundColor: color.primary,
  },
});
