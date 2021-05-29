import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  SwitchValue,
  Header,
  RouteStackParamList,
  StatusBarCustom,
} from '../../../components';

type Props = {
  content: string;
};

const ItemContainer = ({content}: Props) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>{content}</Text>
      <SwitchValue />
    </View>
  );
};

export const ConnectedAccountScreen = ({
  navigation,
}: RouteStackParamList<'SettingsScreen'>) => {
  return (
    <View style={styles.screen}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Connected"
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack()}
      />
      <View style={styles.containerAll}>
        <Text style={styles.itemHeader}>LINKING WITH MY ACCOUNT</Text>
        <View style={styles.container}>
          <ItemContainer content="Connect to Google" />
          <View style={styles.divider} />
          <ItemContainer content="Connect to Facebook" />
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
  containerAll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  container: {
    height: 90,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  itemContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHeader: {
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '600',
    color: '#0078D4',
    marginTop: 16,
  },
  text: {
    flex: 6,
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#212121',
  },
  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#E1E1E1',
  },
});
