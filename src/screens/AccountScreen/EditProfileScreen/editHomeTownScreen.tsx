import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Header,
  CustomIcon,
  InputView,
  RouteStackParamList,
  StatusBarCustom,
  HeaderCustom,
  InputCustom,
  Search,
  Tick,
} from '../../../components';
import {updateUser} from '../../../controller';
import {ROUTER} from '../../../constants';
import {color, spacing} from '../../../theme';

var DATA = require('../../../../assets/json/provice.json');

const Item = ({item, onPress, isCheck}: any) => {
  return (
    <View style={styles.itemContainer}>
      <Text
        onPress={onPress}
        style={[styles.text, {color: isCheck ? color.primary : '#000000'}]}>
        {item.name}
      </Text>
      {isCheck ? <Tick /> : null}
    </View>
  );
};

export const EditHomeTownScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedId, setSelectedId] = useState(route.params.province);
  const [value, onChangeText] = useState('');

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    updateUser({province: selectedId});
    navigation.navigate(ROUTER.account, {flag: true});
  };

  const renderItem = ({item}: any) => {
    const isCheck = item.id === selectedId ? true : false;
    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        isCheck={isCheck}
      />
    );
  };

  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="Home Town"
        leftComponent={
          <Text
            onPress={handleCancel}
            style={[styles.title, {color: color.text}]}>
            Cancel
          </Text>
        }
        rightComponent={
          <Text
            onPress={handleDone}
            style={[styles.title, {color: color.blue}]}>
            Done
          </Text>
        }
      />
      <View style={styles.container}>
        <InputCustom
          placeholder="search"
          leftIcon={<Search />}
          value={value}
          onChangeText={onChangeText}
        />
        <FlatList
          data={DATA.filter((item: any) =>
            item.name.toLowerCase().match(value.toLowerCase()),
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          style={styles.flatList}
          contentContainerStyle={{paddingVertical: spacing[4]}}
        />
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
    paddingVertical: 16,
  },
  flatList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: -10,
  },
  itemContainer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    fontStyle: 'normal',
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
  },
});
