import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {
  Header,
  RouteStackParamList,
  SelectionButtonGroup,
  StatusBarCustom,
} from '../../components';

var DATA = require('../../../assets/json/hobbies.json');

const InitHobbiesScreen = ({
  route,
  navigation,
}: RouteStackParamList<'FirstScreen'>) => {
  const [selectedItems, setItemSelected] = useState([]);
  const {user} = route.params;
  user.hobbies = selectedItems;

  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack()}
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
                Object.keys(selectedItems).length == 5 ? '#6A1616' : '#E1E1E1',
            },
          ]}
          disabled={Object.keys(selectedItems).length === 5 ? false : true}
          onPress={() =>
            navigation.navigate('InitAvatarScreen', {
              user: user,
            })
          }>
          <Text style={styles.textButton}>
            CONTINUE {Object.keys(selectedItems).length}/5
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
    marginTop: 40,
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

export default InitHobbiesScreen;
