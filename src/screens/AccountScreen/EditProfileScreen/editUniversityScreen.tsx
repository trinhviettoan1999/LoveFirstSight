import React, {useState} from 'react';
import {StyleSheet, Text, FlatList, View} from 'react-native';
import {
  Header,
  CustomIcon,
  InputView,
  RouteStackParamList,
  StatusBarCustom,
} from '../../../components';
import {updateUser} from '../../../controller';

var DATA = require('../../../../assets/json/university.json');
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

export const EditUniversityScreen = ({
  navigation,
}: RouteStackParamList<'AccountScreen'>) => {
  const [selectedId, setSelectedId] = useState(null);
  const [university, setUniversity] = useState(null);
  const [value, onChangeText] = useState('');
  const renderItem = ({item}: any) => {
    const isCheck = item.id === selectedId ? true : false;
    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          setUniversity(item.name);
        }}
        isCheck={isCheck}
      />
    );
  };
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="University"
        showTextLeft={true}
        textLeft="Cancel"
        showTextRight={true}
        textRight="Done"
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => {
          updateUser({university: university});
          navigation.navigate('AccountScreen', {flag: true});
        }}
      />
      <View style={styles.container}>
        <View style={styles.search}>
          <InputView
            showIcon={true}
            iconName="search"
            defaultValue=""
            placeHolder="search"
            value={value}
            onChangeText={onChangeText}
          />
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
  },
});

export default EditUniversityScreen;
