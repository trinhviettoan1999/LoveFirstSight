import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Header,
  CustomIcon,
  InputView,
  RouteStackParamList,
  StatusBarCustom,
} from '../../../components';
import {updateUser} from '../../../controller';
var DATA = require('../../../../assets/json/provice.json');
const Item = ({item, onPress, isCheck}: any) => {
  return (
    <View style={styles.itemContainer}>
      <Text
        onPress={onPress}
        style={[styles.text, {color: isCheck ? '#6A1616' : '#000000'}]}>
        {item.name}
      </Text>
      {isCheck ? <CustomIcon name="check" size={10} color="#6A1616" /> : null}
    </View>
  );
};

export const EditHomeTownScreen = ({
  route,
  navigation,
}: RouteStackParamList<'AccountScreen'>) => {
  const [selectedId, setSelectedId] = useState(route.params.province);
  const [value, onChangeText] = useState('');
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
      <Header
        title="Home Town"
        showTextLeft={true}
        textLeft="Cancel"
        showTextRight={true}
        textRight="Done"
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => {
          updateUser({province: selectedId});
          navigation.navigate('AccountScreen', {flag: true});
        }}
      />
      <View style={styles.container}>
        <View style={styles.search}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
            <InputView
              showIcon={true}
              iconName="search"
              defaultValue=""
              placeHolder="search"
              value={value}
              onChangeText={onChangeText}
            />
          </KeyboardAvoidingView>
        </View>
        <FlatList
          data={DATA.filter((item: any) =>
            item.name.toLowerCase().match(value.toLowerCase()),
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          style={styles.flatList}
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
  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 15,
  },
  flatList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
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
});
