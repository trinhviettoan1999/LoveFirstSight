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

var genderData = require('../../../assets/json/gender.json');
var lookingForData = require('../../../assets/json/lookingFor.json');
var drinkingData = require('../../../assets/json/drinking.json');
var childData = require('../../../assets/json/child.json');

export const FilterScreen = ({
  setIsModalVisible,
  setFilter,
  setLoad,
  load,
}: any) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [gender, setGender] = useState(
    checkGender(route.params?.filter.gender),
  );
  const [lookingFor, setLookingFor] = useState(
    checkLookingFor(route.params?.filter.lookingFor),
  );
  const [drinking, setDrinking] = useState(
    checkDrinking(route.params?.filter.drinking),
  );
  const [smoking, setSmoking] = useState(
    checkDrinking(route.params?.filter.smoking),
  );
  const [child, setChild] = useState(checkChild(route.params?.filter.kids));
  const [height, setHeight] = useState(route.params?.filter.height);
  const [province, setProvince] = useState(route.params?.filter.province);
  const [university, setUniversity] = useState(route.params?.filter.university);
  const [age, setAge] = useState([
    route.params?.filter.age.from,
    route.params?.filter.age.to,
  ]);
  const [distance, setDistance] = useState(route.params?.filter.distance);

  const handleFilter = async () => {
    await setFilter({
      gender: gender.value,
      lookingFor: lookingFor.value,
      drinking: drinking.value,
      smoking: smoking.value,
      kids: child.value,
      province: province,
      university: university,
      height: height,
      age: {
        from: age[0],
        to: age[1],
      },
      distance: distance,
    });
    await setIsModalVisible(false);
    setLoad(!load);
    navigation.goBack();
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
            setItemSelected={setGender}
            defaultSelection={gender.optionText}
            title="Who do you want to date?"
          />
          <FilterSlider value={distance} setValue={setDistance} />
          <FilterMultiSlider age={age} setAge={setAge} />
          <FilterContent
            data={lookingForData}
            setItemSelected={setLookingFor}
            defaultSelection={lookingFor.optionText}
            title="Looking for..."
          />
          <FilterContent
            data={drinkingData}
            setItemSelected={setDrinking}
            defaultSelection={drinking.optionText}
            title="Drinking"
          />
          <FilterContent
            data={drinkingData}
            setItemSelected={setSmoking}
            defaultSelection={smoking.optionText}
            title="Smoking"
          />
          <FilterContent
            data={childData}
            setItemSelected={setChild}
            defaultSelection={child.optionText}
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
