import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {spacing, color} from '../../theme';
import {Slider} from 'react-native-elements';

interface IProps {
  value: number;
  setValue: (result: number) => void;
}

export const FilterSlider: FC<IProps> = ({value, setValue}) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.wrapText}>
        <Text style={styles.title}>Distance (km)</Text>
        <Text style={styles.textSub}>0 - {value}</Text>
      </View>
      <Slider
        style={{marginHorizontal: spacing[2]}}
        value={value}
        step={1}
        maximumValue={100}
        minimumValue={1}
        onValueChange={(result) => setValue(result)}
        trackStyle={styles.track}
        maximumTrackTintColor="#e6e6e6"
        minimumTrackTintColor={color.primary}
        thumbStyle={styles.thumb}
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
    width: '100%',
    height: 4,
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: color.primary,
  },
});
