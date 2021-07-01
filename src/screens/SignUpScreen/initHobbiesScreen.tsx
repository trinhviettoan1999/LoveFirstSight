import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  Pressable,
  ImageBackground,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {color, spacing} from '../../theme';
import {ROUTER} from '../../constants/router';
import {SelectionButtonGroup, BackCircle, HeaderCustom} from '../../components';

var DATA = require('../../../assets/json/hobbies.json');
const background_image = require('../../../assets/images/background_default.png');
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const InitHobbiesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedItems, setItemSelected] = useState([]);
  const {user} = route.params;
  user.hobbies = selectedItems;

  const handleContinue = () => {
    navigation.navigate(ROUTER.initAvatar, {
      user: user,
    });
  };

  return (
    <ImageBackground style={styles.image} source={background_image}>
      <HeaderCustom
        backgroundStatusBar={color.transparent}
        removeBorderWidth
        leftComponent={
          <Pressable onPress={() => navigation.goBack()}>
            <BackCircle />
          </Pressable>
        }
      />
      <View style={styles.container}>
        <Text style={styles.textQuestion}>Hobbies</Text>
        <Text style={styles.textNote}>
          Let everyone know what you’re passionate about by adding it to your
          profile.
        </Text>
        <ScrollView style={styles.hobbiesContainer}>
          <SelectionButtonGroup
            data={DATA}
            setItemSelected={setItemSelected}
            maxMultiSelect={5}
          />
          <View style={{height: 80}} />
        </ScrollView>
        <TouchableHighlight
          style={[
            styles.button,
            {
              backgroundColor:
                Object.keys(selectedItems).length == 5
                  ? color.primary
                  : '#E1E1E1',
            },
          ]}
          disabled={Object.keys(selectedItems).length === 5 ? false : true}
          onPress={handleContinue}>
          <Text style={styles.textButton}>
            CONTINUE {Object.keys(selectedItems).length}/5
          </Text>
        </TouchableHighlight>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: HEIGHT,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  hobbiesContainer: {
    height: 350,
    marginTop: 10,
    borderRadius: 10,
  },
  textQuestion: {
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: color.text,
    marginTop: spacing[4],
  },
  textNote: {
    fontSize: 17,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#ACACAC',
    marginTop: 10,
  },
  button: {
    width: 190,
    height: 54,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
  textButton: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#FFFFFF',
  },
});
