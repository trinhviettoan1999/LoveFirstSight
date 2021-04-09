import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  Header,
  InputView,
  RouteStackParamList,
  StatusBarCustom,
} from '../../../components';
import {updateUser} from '../../../controller/updateUser';

const EditNameScreen = ({
  navigation,
  route,
}: RouteStackParamList<'AccountScreen'>) => {
  const [value, onchangeText] = useState(route.params.name);
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Name"
        showTextLeft={true}
        textLeft="Cancel"
        showTextRight={true}
        textRight="Done"
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => {
          updateUser({name: value});
          navigation.navigate('AccountScreen', {flag: true});
        }}
      />
      <View style={styles.container}>
        <View style={styles.containerName}>
          <Text style={styles.title}>Name</Text>
          <InputView
            value={value}
            autoFocus={true}
            onChangeText={onchangeText}
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
  containerName: {
    height: 65,
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

export default EditNameScreen;
