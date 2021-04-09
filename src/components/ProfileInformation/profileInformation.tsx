import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomIcon from '../CustomIcon/customIcon';

type propsInformation = {
  iconName: string;
  content?: any;
  onPress: any;
};

const ProfileInformation = ({iconName, content, onPress}: propsInformation) => {
  return (
    <View style={styles.container}>
      <CustomIcon
        name={iconName}
        color="#6A1616"
        size={20}
        style={{paddingTop: 16}}
      />
      {content ? (
        <Text style={styles.text} onPress={onPress}>
          {content}
        </Text>
      ) : (
        <Text style={styles.textPlaceHolder} onPress={onPress}>
          Add {iconName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingTop: 16,
    marginLeft: 16,
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#000000',
  },
  textPlaceHolder: {
    paddingTop: 16,
    marginLeft: 16,
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#ACACAC',
  },
});

export default ProfileInformation;
