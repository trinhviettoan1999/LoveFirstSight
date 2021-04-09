import React, {useState} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import CustomIcon from '../CustomIcon/customIcon';
import InputView from '../InputView/inputView';

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

type Props = {
  data: any;
  setValue: any;
  onPress: any;
  setIsModalVisible?: any;
};

const FlatListItem = ({data, setValue, setIsModalVisible}: any) => {
  const [selectedId, setSelectedId] = useState(null);
  const [value, onChangeText] = useState('');
  const renderItem = ({item}: any) => {
    const isCheck = item.id === selectedId ? true : false;

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          setValue(item.name);
          setIsModalVisible(false);
        }}
        isCheck={isCheck}
      />
    );
  };
  return (
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
        data={data.filter((item: any) =>
          item.name.toLowerCase().match(value.toLowerCase()),
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 17,
    fontWeight: '500',
    fontStyle: 'normal',
  },
  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 15,
  },
});

export default FlatListItem;
