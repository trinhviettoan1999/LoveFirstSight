import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {color} from '../../theme';

export const Loading = () => {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={color.primary} size="large" />
      <Text style={styles.textLoad}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLoad: {
    marginTop: 10,
  },
});
