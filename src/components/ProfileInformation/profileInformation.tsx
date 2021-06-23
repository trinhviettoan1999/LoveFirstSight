import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomIcon from '../CustomIcon/customIcon';

type propsInformation = {
  iconName: string;
  content?: any;
  onPress?: any;
};

export const ProfileInformation = ({
  iconName,
  content,
  onPress,
}: propsInformation) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <CustomIcon
          name={iconName}
          color="#ADACAC"
          size={20}
          style={{paddingTop: 16}}
        />
      </View>
      <View style={{flex: 12}}>
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
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 10,
  },
  textPlaceHolder: {
    paddingTop: 16,
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#ACACAC',
    marginLeft: 10,
  },
});
