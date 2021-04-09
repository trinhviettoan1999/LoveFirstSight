import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import SelectionGroup from 'react-native-selection-group';
import {SelectionHandler} from 'react-native-selection-group';
const renderButton = (
  data: any,
  index: number,
  isSelected: boolean,
  onPress: any,
) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      key={index}
      style={[
        styles.button,
        {backgroundColor: isSelected ? '#6A1616' : '#FFEBEB'},
      ]}>
      <Text style={[styles.text, {color: isSelected ? '#FFFFFF' : '#BB2424'}]}>
        {data.value}
      </Text>
    </TouchableOpacity>
  );
};

type Props = {
  data: any;
  selectionHandler: any;
  setItemSelected?: any;
  maxMultiSelect: number;
  defaultSelection?: any;
};

const SelectionButtonGroup = ({
  data,
  setItemSelected,
  defaultSelection,
  maxMultiSelect,
}: Props) => {
  const [selectionHandler, setSelectionHandler] = useState(
    new SelectionHandler({
      maxMultiSelect: maxMultiSelect,
      allowDeselect: maxMultiSelect >= 2 ? true : false,
      defaultSelection: defaultSelection,
    }),
  );
  useEffect(() => {
    setSelectionHandler(
      new SelectionHandler({
        maxMultiSelect: maxMultiSelect,
        allowDeselect: maxMultiSelect >= 2 ? true : false,
        defaultSelection: defaultSelection,
      }),
    );
  }, [maxMultiSelect, defaultSelection]);
  return maxMultiSelect === 1 ? (
    <SelectionGroup
      renderContent={renderButton}
      items={data}
      onPress={selectionHandler.selectionHandler}
      isSelected={selectionHandler.isSelected}
      containerStyle={styles.containerButton}
      onItemSelected={(item: any) => {
        setItemSelected(item);
      }}
    />
  ) : (
    <SelectionGroup
      renderContent={renderButton}
      items={data}
      onPress={selectionHandler.selectionHandler}
      isSelected={selectionHandler.isSelected}
      containerStyle={styles.containerButton}
      getAllSelectedItemIndexes={selectionHandler.getAllSelectedItemIndexes}
      onItemSelected={(item: any, allSelectedItems: any) => {
        setItemSelected(allSelectedItems);
      }}
      onItemDeselected={(item: any, allSelectedItems: any) => {
        setItemSelected(allSelectedItems);
      }}
    />
  );
};

const styles = StyleSheet.create({
  containerButton: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  button: {
    height: 30,
    borderRadius: 20,
    paddingHorizontal: 10,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
  },
});

export default SelectionButtonGroup;
