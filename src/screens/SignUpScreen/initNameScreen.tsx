import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {
  Header,
  RouteStackParamList,
  InputView,
  SelectionRadioHorizontal,
  StatusBarCustom,
} from '../../components';

const Data = {
  Options: [
    {
      optionText: 0,
      value: 'Man',
    },
    {
      optionText: 1,
      value: 'Woman',
    },
    {
      optionText: 2,
      value: 'Other',
    },
  ],
};

export const InitNameScreen = ({
  route,
  navigation,
}: RouteStackParamList<'FirstScreen'>) => {
  const [value, onChangeText] = useState('');
  const [gender, setGender] = useState('Man');
  const {user} = route.params;
  user.name = value;
  user.gender = gender;
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text style={styles.textQuestion}>Next up, what's your name?</Text>
        <View style={styles.inputContainer}>
          <InputView
            placeHolder="Enter your name"
            value={value}
            onChangeText={onChangeText}
            autoFocus={true}
          />
        </View>
        <Text style={styles.textNote}>
          This is how you’ll appear on Stapler
        </Text>
        <Text style={styles.textQuestion}>Your are a</Text>
        <View style={styles.genderContainer}>
          <SelectionRadioHorizontal
            Data={Data}
            gender={gender}
            setGender={setGender}
          />
        </View>
        <TouchableHighlight
          style={[
            styles.button,
            {backgroundColor: value.trim() !== '' ? '#6A1616' : '#E1E1E1'},
          ]}
          disabled={value.trim() !== '' ? false : true}
          onPress={() =>
            navigation.navigate('InitAgeScreen', {
              user: user,
            })
          }>
          <Text style={styles.textButton}>CONTINUE</Text>
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
  genderContainer: {
    height: 50,
    paddingHorizontal: 5,
  },
  textQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
    marginTop: 40,
  },
  textNote: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#ACACAC',
    marginTop: 10,
  },
  inputContainer: {
    height: 40,
    marginTop: 20,
    borderBottomWidth: 2,
  },
  button: {
    width: 190,
    height: 54,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    alignSelf: 'center',
  },
  textButton: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#FFFFFF',
  },
});
