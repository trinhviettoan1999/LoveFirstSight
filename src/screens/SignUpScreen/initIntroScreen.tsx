import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import {Header, RouteStackParamList, StatusBarCustom} from '../../components';

const InitIntroScreen = ({
  route,
  navigation,
}: RouteStackParamList<'FirstScreen'>) => {
  const [value, setValue] = useState('');
  const {user} = route.params;
  user.intro = value;
  return (
    <View style={styles.containerAll}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        showIconLeft={true}
        iconNameLeft="back"
        onPressLeft={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text style={styles.textQuestion}>Your intro?</Text>
        <View style={styles.introContainer}>
          <TextInput
            autoFocus={true}
            value={value}
            onChangeText={setValue}
            style={styles.textInput}
            multiline={true}
            maxLength={500}
          />
        </View>
        <View style={styles.lengthContainer}>
          <Text style={styles.textLength}>{value.length} / 500</Text>
        </View>
        <Text style={styles.textNote}>Visible on your Stapler profile</Text>
        <TouchableHighlight
          style={[
            styles.button,
            {backgroundColor: value.trim() ? '#6A1616' : '#E1E1E1'},
          ]}
          disabled={value.trim() ? false : true}
          onPress={() =>
            navigation.navigate('InitHobbiesScreen', {
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
    alignSelf: 'center',
  },
  button: {
    width: 190,
    height: 54,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    alignSelf: 'center',
  },
  introContainer: {
    height: 100,
  },
  lengthContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#919191',
    paddingBottom: 5,
  },
  textInput: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#919191',
  },
  textButton: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#FFFFFF',
  },
  textLength: {
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '500',
    color: '#919191',
  },
});

export default InitIntroScreen;
