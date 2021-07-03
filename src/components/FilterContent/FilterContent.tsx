import React, {FC, useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {color, spacing} from '../../theme';
import SelectionGroup from 'react-native-selection-group';
import {SelectionHandler} from 'react-native-selection-group';

const renderButton = (
  data: any,
  index: number,
  isSelected: boolean,
  onPress: () => void,
) => {
  return (
    <Pressable
      onPress={onPress}
      key={index}
      style={[
        styles.button,
        {backgroundColor: isSelected ? color.primary : color.light},
      ]}>
      <Text
        style={[
          styles.text,
          {color: isSelected ? color.bgWhite : color.primary},
        ]}>
        {data.value}
      </Text>
    </Pressable>
  );
};

interface IProps {
  title: string;
  data: any;
  setItemSelected?: any;
  maxMultiSelect?: number;
  defaultSelection?: any;
}

export const FilterContent: FC<IProps> = ({
  title,
  data,
  setItemSelected,
  maxMultiSelect = 1,
  defaultSelection = 0,
}) => {
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

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {maxMultiSelect === 1 ? (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: color.bgWhite,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    marginTop: spacing[3],
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  containerButton: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: color.text,
  },
  button: {
    height: 30,
    borderRadius: 10,
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
