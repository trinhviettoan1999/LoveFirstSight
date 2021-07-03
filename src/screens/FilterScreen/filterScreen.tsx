import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Pressable} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  HeaderCustom,
  Back,
  FilterContent,
  FilterSlider,
  FilterMultiSlider,
  Filter,
} from '../../components';
import {
  checkGender,
  checkDrinking,
  checkLookingFor,
  checkChild,
} from '../../controller';
import {spacing, color} from '../../theme/';
import {ROUTER} from '../../constants';

var genderData = require('../../../assets/json/gender.json');
var lookingForData = require('../../../assets/json/lookingFor.json');
var drinkingData = require('../../../assets/json/drinking.json');
var childData = require('../../../assets/json/child.json');

interface PropsFilter {
  gender: string;
  lookingFor: string;
  drinking: string;
  smoking: string;
  kids: string;
  distance: number;
  age: number[];
}

export const FilterScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [filter, setFilter] = useState<PropsFilter>({
    gender: route.params?.filter.gender,
    lookingFor: route.params?.filter.lookingFor,
    drinking: route.params?.filter.drinking,
    smoking: route.params?.filter.smoking,
    kids: route.params?.filter.kids,
    distance: route.params?.filter.distance,
    age: [route.params?.filter.age.from, route.params?.filter.age.to],
  });

  const handleFilter = () => {
    navigation.navigate(ROUTER.tab, {
      screen: ROUTER.home,
      params: {
        filter: {
          gender: checkGender(filter.gender).value,
          lookingFor: checkLookingFor(filter.lookingFor).value,
          drinking: checkDrinking(filter.drinking).value,
          smoking: checkDrinking(filter.smoking).value,
          kids: checkChild(filter.kids).value,
          distance: filter.distance,
          age: {
            from: filter.age[0],
            to: filter.age[1],
          },
        },
      },
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: color.bgWhiteLight}}>
      <HeaderCustom
        title="Filter"
        backgroundStatusBar={color.bgWhite}
        removeBorderWidth
        leftComponent={
          <Pressable onPress={() => navigation.goBack()}>
            <Back />
          </Pressable>
        }
        rightComponent={
          <Pressable onPress={handleFilter}>
            <Filter />
          </Pressable>
        }
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <FilterContent
            data={genderData}
            setItemSelected={(value: string) =>
              setFilter({...filter, gender: value})
            }
            defaultSelection={checkGender(filter.gender).optionText}
            title="Who do you want to date?"
          />
          <FilterSlider
            value={filter.distance}
            setValue={(value) => setFilter({...filter, distance: value})}
          />
          <FilterMultiSlider
            age={filter.age}
            setAge={(value) => setFilter({...filter, age: value})}
          />
          <FilterContent
            data={lookingForData}
            setItemSelected={(value: string) =>
              setFilter({...filter, lookingFor: value})
            }
            defaultSelection={checkLookingFor(filter.lookingFor).optionText}
            title="Looking for..."
          />
          <FilterContent
            data={drinkingData}
            setItemSelected={(value: string) =>
              setFilter({...filter, drinking: value})
            }
            defaultSelection={checkDrinking(filter.drinking).optionText}
            title="Drinking"
          />
          <FilterContent
            data={drinkingData}
            setItemSelected={(value: string) =>
              setFilter({...filter, smoking: value})
            }
            defaultSelection={checkDrinking(filter.smoking).optionText}
            title="Smoking"
          />
          <FilterContent
            data={childData}
            setItemSelected={(value: string) =>
              setFilter({...filter, kids: value})
            }
            defaultSelection={checkChild(filter.kids).optionText}
            title="Kids"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing[4],
    backgroundColor: color.bgWhite,
    paddingBottom: spacing[4],
  },
  scrollView: {
    flex: 1,
  },
});
