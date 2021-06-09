import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {getHobbiesUser} from '../../controller/user';
import {spacing, color} from '../../theme';

interface props {
  data: Array<{
    id: number;
    value: string;
  }>;
}

export const Hobbies = ({data}: props) => {
  const [listHobbies, setListHobbies] = useState([
    {
      id: 0,
      value: '',
    },
  ]);

  const loadData = async () => {
    const list = await getHobbiesUser();
    setListHobbies(list);
  };

  const checkSameHobbie = (hobby: any) => {
    const listValueHobbies = listHobbies.map((item) => item.value);
    if (listValueHobbies.includes(hobby)) {
      return styles.containerSame;
    }
    return styles.containerText;
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.wrap}>
      {/* {listHobbies.map((item) => (
        <View style={styles.containerText}>
          <Text style={styles.text}>{item.value}</Text>
        </View>
      ))} */}
      {data.length > 0 ? (
        <>
          <View style={styles.container}>
            <View style={checkSameHobbie(data[0].value)}>
              <Text style={styles.text}>{data[0].value}</Text>
            </View>
            <View style={checkSameHobbie(data[1].value)}>
              <Text style={styles.text}>{data[1].value}</Text>
            </View>
            <View style={checkSameHobbie(data[2].value)}>
              <Text style={styles.text}>{data[2].value}</Text>
            </View>
          </View>
          <View style={[styles.container, {marginTop: spacing[2]}]}>
            <View style={checkSameHobbie(data[3].value)}>
              <Text style={styles.text}>{data[3].value}</Text>
            </View>
            <View style={checkSameHobbie(data[4].value)}>
              <Text style={styles.text}>{data[4].value}</Text>
            </View>
          </View>
        </>
      ) : null}
    </View>
    // <FlatList
    //   data={listHobbies}
    //   numColumns={2}
    //   columnWrapperStyle={{flex: 1}}
    //   keyExtractor={(item, index) => index.toString()}
    //   renderItem={({item}) => (
    //     <View style={styles.containerText}>
    //       <Text style={styles.text}>asdsdsdsdsdsds</Text>
    //     </View>
    //   )}
    // />
  );
};

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'flex-end',
  },
  container: {
    flexDirection: 'row',
  },
  containerText: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 20,
    marginRight: spacing[4],
  },
  text: {
    color: color.bgWhite,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
  },
  containerSame: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    backgroundColor: color.primary,
    borderRadius: 20,
    marginRight: spacing[4],
  },
});
