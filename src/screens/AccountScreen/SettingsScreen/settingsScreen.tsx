import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {
  Header,
  RouteStackParamList,
  CustomIcon,
  StatusBarCustom,
} from '../../../components';

type Props = {
  content: string;
  onPress?: any;
};
const Title = ({content}: Props) => {
  return <Text style={styles.header}>{content}</Text>;
};

const Item = ({content, onPress}: Props) => {
  return (
    <View style={styles.item}>
      <Text style={styles.content} onPress={onPress}>
        {content}
      </Text>
      <CustomIcon
        name="next"
        color="#919191"
        size={15}
        style={{flex: 1}}
        onPress={onPress}
      />
    </View>
  );
};

const SettingsScreen = ({
  navigation,
}: RouteStackParamList<'SettingsScreen'>) => {
  return (
    <View style={styles.container}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Settings"
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollView}>
        {/* <Title content="ACCOUNT SETTINGS" />
        <View style={styles.twoContainer}>
          <Item
            content="Email"
            onPress={() => navigation.navigate('EmailScreen')}
          />
          <View style={styles.divider} />
          <Item
            content="Connected Accounts"
            onPress={() => navigation.navigate('ConnectedAccountScreen')}
          />
        </View> */}
        <Title content="LIST IGNORE" />
        <View style={styles.oneContainer}>
          <Item
            content="List Ignore User"
            onPress={() => {
              navigation.navigate('ListIgnoreScreen');
            }}
          />
        </View>
        <Title content="LIST BLOCK" />
        <View style={styles.oneContainer}>
          <Item
            content="List Block User"
            onPress={() => {
              navigation.navigate('ListBlockScreen');
            }}
          />
        </View>
        <Title content="ACTIVE STATUS" />
        <View style={styles.oneContainer}>
          <Item content="Recently Active Status" />
        </View>
        <Title content="COMMUNITY" />
        <View style={styles.twoContainer}>
          <Item content="Community Guidelines" />
          <View style={styles.divider} />
          <Item content="Safety Tips" />
        </View>
        <Title content="NOTIFICATIONS" />
        <View style={styles.twoContainer}>
          <Item
            content="Email"
            onPress={() => navigation.navigate('EmailNotificationScreen')}
          />
          <View style={styles.divider} />
          <Item
            content="Push Notifications"
            onPress={() => navigation.navigate('PushNotificationScreen')}
          />
        </View>
      </ScrollView>
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  oneContainer: {
    height: 45,
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  twoContainer: {
    height: 90,
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  threeContainer: {
    height: 135,
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
  },
  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#E1E1E1',
  },
  header: {
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0078D4',
    marginTop: 6,
    marginBottom: 6,
  },
  content: {
    flex: 16,
    fontStyle: 'normal',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default SettingsScreen;
