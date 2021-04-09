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

const PushNotificationScreen = ({
  navigation,
}: RouteStackParamList<'SettingsScreen'>) => {
  return (
    <View style={styles.screen}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Notifications"
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack()}
      />
      <View style={styles.containerAll}>
        <View style={styles.container}>
          <ItemContainer content="New Matches" />
          <View style={styles.divider} />
          <ItemContainer content="Messages" />
          <View style={styles.divider} />
          <ItemContainer content="Super Likes" />
          <View style={styles.divider} />
          <ItemContainer content="Sound in App" />
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
    height: 180,
    borderRadius: 10,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  itemContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
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

export default PushNotificationScreen;
