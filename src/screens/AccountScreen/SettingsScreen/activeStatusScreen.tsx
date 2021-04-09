import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SwitchValue, Header, StatusBarCustom} from '../../../components';

const ActiveStatusScreen = () => {
  return (
    <View style={styles.screen}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Active Status"
        showIconLeft={true}
        iconNameLeft="back"
        showTextLeft={true}
        textLeft="Settings"
      />
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <Text style={styles.text}>Show Activity Status</Text>
          <SwitchValue />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  itemContainer: {
    height: 45,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
  },
  text: {
    flex: 6,
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#212121',
  },
});

export default ActiveStatusScreen;
