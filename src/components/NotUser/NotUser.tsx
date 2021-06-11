import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

const not_result_image = require('../../../assets/images/not_result.png');

export const NotUser = () => {
  return (
    <View style={styles.wrap}>
      <Image
        source={not_result_image}
        style={styles.imageResult}
        resizeMode="contain"
      />
      <Text style={{fontSize: 16}}>Don't have Users with your filter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageResult: {
    width: 250,
    height: 250,
  },
});
