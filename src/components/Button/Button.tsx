import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Button, ButtonProps} from 'react-native-elements';
import {color, spacing} from '../../theme';

const WIDTH = Dimensions.get('screen').width;

export const ButtonCustom = (props: ButtonProps) => {
  return (
    <Button
      buttonStyle={styles.button}
      titleStyle={styles.textButton}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: spacing[5],
    width: WIDTH - 150,
    backgroundColor: color.primary,
    marginTop: spacing[4],
  },
  textButton: {
    fontSize: 17,
    color: color.bgWhite,
    lineHeight: 19,
    fontWeight: 'bold',
  },
});
