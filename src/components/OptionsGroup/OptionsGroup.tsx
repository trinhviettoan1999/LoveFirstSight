import React from 'react';
import {View, StyleSheet, Dimensions, Pressable} from 'react-native';
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
      <Pressable onPress={onPressIgnore}>
        <DisLike />
      </Pressable>
      <Pressable onPress={onPressSupperLike}>
        <Star />
      </Pressable>
      <Pressable onPress={onPressLike}>
        <Like />
      </Pressable>
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
