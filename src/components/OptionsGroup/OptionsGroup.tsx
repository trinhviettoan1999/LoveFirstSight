import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {DisLike, Like, Star} from '..';
import {spacing} from '../../theme';

const WIDTH = Dimensions.get('window').width;

interface OptionsProps {
  onPressIgnore: () => void;
  onPressSupperLike: () => void;
  onPressLike: () => void;
}

export const OptionsGroup = ({
  onPressIgnore,
  onPressSupperLike,
  onPressLike,
}: OptionsProps) => {
  return (
    <View style={styles.containerButton}>
      <TouchableOpacity activeOpacity={0.6} onPress={onPressIgnore}>
        <DisLike />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.6} onPress={onPressSupperLike}>
        <Star />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.6} onPress={onPressLike}>
        <Like />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerButton: {
    width: WIDTH,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    bottom: spacing[2],
  },
});
