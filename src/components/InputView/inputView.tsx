import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import CustomIcon from '../CustomIcon/customIcon';

type Props = {
  defaultValue?: string;
  iconName?: string;
  showIcon?: boolean;
  autoFocus?: boolean;
  placeHolder?: string;
  value?: string;
  onChangeText: any;
  setIsEmail?: any;
  checkEmail?: boolean;
  secureTextEntry?: boolean;
};

const validate = (text: string, onChangeText: any, setIsEmail: any) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  onChangeText(text);
  if (reg.test(text) === false) {
    setIsEmail(false);
    return false;
  } else {
    setIsEmail(true);
    return false;
  }
};

const InputView = ({
  iconName,
  showIcon,
  autoFocus,
  placeHolder,
  value,
  onChangeText,
  setIsEmail,
  checkEmail,
  secureTextEntry,
}: Props) => {
  return (
    <View style={styles.container}>
      {showIcon ? (
        <CustomIcon name={iconName} size={20} color="#6A1616" />
      ) : null}
      <TextInput
        style={[styles.input]}
        value={value}
        onChangeText={(text) => {
          checkEmail
            ? validate(text, onChangeText, setIsEmail)
            : onChangeText(text);
        }}
        autoFocus={autoFocus}
        placeholder={placeHolder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 40,
    fontSize: 17,
    fontWeight: '600',
    fontStyle: 'normal',
    marginTop: 5,
  },
});

export default InputView;
