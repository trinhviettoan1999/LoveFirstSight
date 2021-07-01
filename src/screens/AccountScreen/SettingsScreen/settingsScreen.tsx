import React from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {color} from '../../../theme';
import {CustomIcon, HeaderCustom, Back} from '../../../components';
import {ROUTER} from '../../../constants';

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

export const SettingsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="Settings"
        leftComponent={
          <Pressable onPress={() => navigation.goBack()}>
            <Back />
          </Pressable>
        }
      />
      <ScrollView style={styles.scrollView}>
        <Title content="LIST IGNORE" />
        <View style={styles.oneContainer}>
          <Item
            content="List Ignore User"
            onPress={() => {
              navigation.navigate(ROUTER.listIgnore);
            }}
          />
        </View>
        <Title content="LIST BLOCK" />
        <View style={styles.oneContainer}>
          <Item
            content="List Block User"
            onPress={() => {
              navigation.navigate(ROUTER.listBlock);
            }}
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
    marginVertical: 10,
  },
  content: {
    flex: 16,
    fontStyle: 'normal',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
  },
});
