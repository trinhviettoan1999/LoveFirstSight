import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {CustomIcon, SelectionButtonGroup, FlatListItem} from '../../components';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Slider} from 'react-native-elements';
import Modal from 'react-native-modal';

var dataHeight = require('../../../assets/json/height.json');
var dataProvince = require('../../../assets/json/provice.json');
var dataUniversity = require('../../../assets/json/university.json');
var genderData = require('../../../assets/json/gender.json');
var lookingForData = require('../../../assets/json/lookingFor.json');
var drinkingData = require('../../../assets/json/drinking.json');
var childData = require('../../../assets/json/child.json');

const checkGender = (gender: string) => {
  if (gender === 'Man') {
    return {
      optionText: 0,
      value: 'Man',
    };
  } else if (gender === 'Woman') {
    return {
      optionText: 1,
      value: 'Woman',
    };
  } else if (gender === 'Other') {
    return {
      optionText: 2,
      value: 'Other',
    };
  } else {
    return {
      optionText: 3,
      value: '',
    };
  }
};

const checkDrinking = (drinking: string) => {
  if (drinking === 'Never') {
    return {
      optionText: 0,
      value: 'Never',
    };
  } else if (drinking === 'Often') {
    return {
      optionText: 1,
      value: 'Often',
    };
  } else if (drinking === 'Occasionaly') {
    return {
      optionText: 2,
      value: 'Occasionaly',
    };
  } else if (drinking === 'Prefer Not To Say') {
    return {
      optionText: 3,
      value: 'Prefer Not To Say',
    };
  } else {
    return {
      optionText: 4,
      value: '',
    };
  }
};

const checkLookingFor = (lookingFor: string) => {
  if (lookingFor === 'Chatting') {
    return {
      optionText: 0,
      value: 'Chatting',
    };
  } else if (lookingFor === 'Prefer Not To Say') {
    return {
      optionText: 1,
      value: 'Prefer Not To Say',
    };
  } else if (lookingFor === 'FriendShip') {
    return {
      optionText: 2,
      value: 'FriendShip',
    };
  } else if (lookingFor === 'Something Casual') {
    return {
      optionText: 3,
      value: 'Something Casual',
    };
  } else if (lookingFor === 'Long-term Relationship') {
    return {
      optionText: 4,
      value: 'Long-term Relationship',
    };
  } else {
    return {
      optionText: 5,
      value: '',
    };
  }
};

const checkChild = (child: string) => {
  if (child === 'Have kids') {
    return {
      optionText: 0,
      value: 'Have Kids',
    };
  } else if (child === "Don't have kids") {
    return {
      optionText: 1,
      value: "Don't Have Kids",
    };
  } else if (child === 'Prefer Not To Say') {
    return {
      optionText: 2,
      value: 'Prefer Not To Say',
    };
  } else {
    return {
      optionText: 3,
      value: '',
    };
  }
};

type SelectionGroupProps = {
  setItemSelected: any;
  title: string;
  iconName: string;
  data: any;
  defaultSelection?: number;
};
const SelectionGroup = ({
  setItemSelected,
  title,
  iconName,
  data,
  defaultSelection,
}: SelectionGroupProps) => {
  return (
    <View style={styles.selectionContainer}>
      <View style={styles.titleContainer}>
        <CustomIcon
          name={iconName}
          size={20}
          color="#6A1616"
          style={{marginRight: 10}}
        />
        <Text style={styles.textTitle}>{title}</Text>
      </View>
      <View>
        <SelectionButtonGroup
          defaultSelection={defaultSelection}
          data={data}
          setItemSelected={setItemSelected}
          maxMultiSelect={1}
        />
      </View>
    </View>
  );
};

type SliderProps = {
  title: string;
  iconName: string;
  max?: any;
  min?: any;
  isTwoSlider?: boolean;
  setDistance?: any;
  setAge?: any;
  age?: any;
  distance?: any;
};
const SliderView = ({
  title,
  iconName,
  isTwoSlider,
  min,
  max,
  distance,
  age,
  setDistance,
  setAge,
}: SliderProps) => {
  return (
    <View style={styles.selectionContainer}>
      <View style={styles.titleContainer}>
        <CustomIcon
          name={iconName}
          size={20}
          color="#6A1616"
          style={{marginRight: 10}}
        />
        <Text style={styles.textTitle}>{title}</Text>
      </View>
      <View style={styles.sliderContainer}>
        {isTwoSlider ? (
          <Text style={[styles.textContent, {width: 50}]}>
            {age[0]}-{age[1]}
          </Text>
        ) : (
          <Text style={[styles.textContent, {width: 50}]}>{distance} km</Text>
        )}
        <MultiSlider
          containerStyle={{marginLeft: 16}}
          min={min}
          max={max}
          selectedStyle={{backgroundColor: '#6A1616'}}
          markerStyle={{backgroundColor: '#6A1616', width: 15, height: 15}}
          values={isTwoSlider ? age : distance}
          sliderLength={220}
          onValuesChangeFinish={(result) => {
            if (isTwoSlider) {
              setAge(result);
            } else {
              setDistance(result);
            }
          }}
          snapped
        />
      </View>
    </View>
  );
};

const ContentView = ({title, iconName, content, onPress}: any) => {
  return (
    <View style={styles.selectionContainer}>
      <View style={styles.titleContainer}>
        <CustomIcon
          name={iconName}
          size={20}
          color="#6A1616"
          style={{marginRight: 10}}
        />
        <Text style={styles.textTitle}>{title}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.textContent} onPress={onPress}>
          {content}
        </Text>
      </View>
    </View>
  );
};

const FilterScreen = ({
  setIsModalVisible,
  setFilter,
  filter,
  setLoad,
  load,
}: any) => {
  const [isModalVisibleHeight, setIsModalVisibleHeight] = useState(false);
  const [isModalVisibleProvince, setIsModalVisibleProvince] = useState(false);
  const [isModalVisibleUniversity, setIsModalVisibleUniversity] = useState(
    false,
  );
  const [gender, setGender] = useState(checkGender(filter.gender));
  const [lookingFor, setLookingFor] = useState(
    checkLookingFor(filter.lookingFor),
  );
  const [drinking, setDrinking] = useState(checkDrinking(filter.drinking));
  const [smoking, setSmoking] = useState(checkDrinking(filter.smoking));
  const [child, setChild] = useState(checkChild(filter.kids));
  const [height, setHeight] = useState(filter.height);
  const [province, setProvince] = useState(filter.province);
  const [university, setUniversity] = useState(filter.university);
  const [age, setAge] = useState([filter.age.from, filter.age.to]);
  const [distance, setDistance] = useState(filter.distance);
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textTitle}>Filter</Text>
        </View>
        <SelectionGroup
          setItemSelected={setGender}
          title="Who do you want to date?"
          iconName="gender"
          data={genderData}
          defaultSelection={gender.optionText}
        />
        <View style={styles.selectionContainer}>
          <View style={styles.titleContainer}>
            <CustomIcon
              name="scope"
              size={20}
              color="#6A1616"
              style={{marginRight: 10}}
            />
            <Text style={styles.textTitle}>Distance from you</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Text style={[styles.textContent, {width: 50}]}>{distance} km</Text>
            <Slider
              style={{marginLeft: 16, flex: 1}}
              value={distance}
              step={1}
              maximumValue={100}
              minimumValue={1}
              onSlidingComplete={setDistance}
              trackStyle={{
                width: '100%',
                height: 2,
              }}
              maximumTrackTintColor="#C8C8C8"
              minimumTrackTintColor="#6A1616"
              thumbStyle={{
                height: 15,
                width: 15,
                backgroundColor: '#6A1616',
              }}
            />
          </View>
        </View>
        <SliderView
          title="Age range"
          iconName="scope"
          min={18}
          max={60}
          isTwoSlider={true}
          age={age}
          setAge={setAge}
        />
        <ContentView
          title="Height range"
          iconName="height"
          content={height ? height + ' cm' : 'Select to...'}
          onPress={() => {
            setIsModalVisibleHeight(true);
          }}
        />
        <SelectionGroup
          setItemSelected={setLookingFor}
          title="Looking for..."
          iconName="lookingfor"
          data={lookingForData}
          defaultSelection={lookingFor.optionText}
        />
        <SelectionGroup
          setItemSelected={setDrinking}
          title="Drinking"
          iconName="drinking"
          data={drinkingData}
          defaultSelection={drinking.optionText}
        />
        <SelectionGroup
          setItemSelected={setSmoking}
          title="Smoking"
          iconName="smoking"
          data={drinkingData}
          defaultSelection={smoking.optionText}
        />
        <SelectionGroup
          setItemSelected={setChild}
          title="Kids"
          iconName="child"
          data={childData}
          defaultSelection={child.optionText}
        />
        <ContentView
          title="From"
          iconName="province"
          content={province ? province : 'Select to...'}
          onPress={() => {
            setIsModalVisibleProvince(true);
          }}
        />
        <ContentView
          title="University"
          iconName="university"
          content={university ? university : 'Select to...'}
          onPress={() => {
            setIsModalVisibleUniversity(true);
          }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.button, {backgroundColor: '#E1E1E1'}]}
            onPress={() => {
              setChild({
                optionText: 3,
                value: '',
              });
              setDrinking({
                optionText: 4,
                value: '',
              });
              setGender({
                optionText: 3,
                value: '',
              });
              setSmoking({
                optionText: 4,
                value: '',
              });
              setLookingFor({
                optionText: 5,
                value: '',
              });
              setHeight('');
              setUniversity('');
              setProvince('');
            }}>
            <Text style={[styles.textContent, {color: '#ACACAC'}]}>
              Clear All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
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
            }}
            style={[styles.button, {backgroundColor: '#6A1616'}]}>
            <Text style={[styles.textContent, {color: '#FFFFFF'}]}>
              Apply changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={isModalVisibleHeight}
        style={styles.modal}
        onBackdropPress={() => setIsModalVisibleHeight(false)}
        backdropOpacity={0.5}>
        <FlatListItem
          data={dataHeight}
          setValue={setHeight}
          setIsModalVisible={setIsModalVisibleHeight}
        />
      </Modal>
      <Modal
        isVisible={isModalVisibleProvince}
        style={styles.modal}
        onBackdropPress={() => setIsModalVisibleProvince(false)}
        backdropOpacity={0.5}>
        <FlatListItem
          data={dataProvince}
          setValue={setProvince}
          setIsModalVisible={setIsModalVisibleProvince}
        />
      </Modal>
      <Modal
        isVisible={isModalVisibleUniversity}
        style={styles.modal}
        onBackdropPress={() => setIsModalVisibleUniversity(false)}
        backdropOpacity={0.5}>
        <FlatListItem
          data={dataUniversity}
          setValue={setUniversity}
          setIsModalVisible={setIsModalVisibleUniversity}
        />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modal: {
    flex: 1,
  },
  header: {
    height: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  scrollView: {
    flex: 1,
  },
  selectionContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    marginTop: 10,
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  textContent: {
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '700',
  },
  buttonContainer: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 5,
  },
});

export default FilterScreen;
