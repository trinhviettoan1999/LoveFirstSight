import React, {useState} from 'react';
import {StyleSheet, Text, FlatList, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HeaderCustom, InputCustom, Search, Tick} from '../../../components';
import {updateUser} from '../../../controller';
import {color, spacing} from '../../../theme';
import {ROUTER} from '../../../constants';

var DATA = require('../../../../assets/json/university.json');

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

export const EditUniversityScreen = () => {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const [university, setUniversity] = useState(null);
  const [value, onChangeText] = useState('');

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    updateUser({university: university});
    navigation.navigate(ROUTER.account, {flag: true});
  };

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
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="University"
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
          contentContainerStyle={{paddingVertical: spacing[2]}}
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
    marginTop: -10,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
  },
});

export default EditUniversityScreen;
