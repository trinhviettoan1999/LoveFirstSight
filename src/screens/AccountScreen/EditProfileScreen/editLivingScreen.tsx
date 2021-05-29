import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  Header,
  InputView,
  RouteStackParamList,
  StatusBarCustom,
} from '../../../components';

export const EditLivingScreen = ({
  navigation,
}: RouteStackParamList<'AccountScreen'>) => {
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Living"
        showTextLeft={true}
        textLeft="Cancel"
        showTextRight={true}
        textRight="Done"
        onPressLeft={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={styles.containerAge}>
          <Text style={styles.title}>Living in</Text>
          <InputView
            value="Ho Chi Minh City"
            showIcon={true}
            iconName="location"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  containerAge: {
    height: 60,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginTop: 16,
    justifyContent: 'center',
    paddingTop: 5,
  },
  title: {
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '500',
    color: '#ACACAC',
  },
});
