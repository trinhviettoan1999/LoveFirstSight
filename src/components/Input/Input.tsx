import React, {Ref, useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Input, InputProps} from 'react-native-elements';
import {color, spacing} from '../../theme';

export const InputCustom = React.forwardRef(
  (props: InputProps, ref: Ref<TextInput>) => {
    const [focused, setFocused] = useState(false);
    return (
      <Input
        ref={ref}
        inputContainerStyle={focused ? styles.inputFocused : styles.input}
        labelStyle={styles.label}
        style={styles.textInput}
        containerStyle={styles.containerInput}
        placeholderTextColor={color.textGray}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    );
  },
);

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: color.light,
    borderRadius: spacing[4],
    paddingHorizontal: spacing[3],
    borderBottomWidth: 0,
  },
  inputFocused: {
    width: '100%',
    height: 50,
    backgroundColor: color.bgWhite,
    borderRadius: spacing[4],
    paddingHorizontal: spacing[3],
    borderWidth: 1,
    borderColor: color.primary,
  },
  label: {
    color: color.text,
    lineHeight: 22,
    fontSize: 18,
    fontWeight: '500',
  },
  textInput: {
    fontSize: 16,
    color: color.primary,
  },
  containerInput: {
    paddingHorizontal: spacing[0],
  },
});
