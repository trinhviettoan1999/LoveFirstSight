import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {HeaderCustom, InputCustom} from '../../../components';
import {updateUser} from '../../../controller';
import {color, spacing} from '../../../theme';
import {ROUTER} from '../../../constants/router';

export const EditBioScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [value, onchangeText] = useState(route.params.intro);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    updateUser({intro: value});
    navigation.navigate(ROUTER.account, {flag: true});
  };

  return (
    <View style={styles.containerAll}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="Bio"
        leftComponent={
          <Text
            onPress={handleCancel}
            style={[styles.title, {color: color.text}]}>
            Cancel
          </Text>
        }
        rightComponent={
          <Text
            onPress={handleDone}
            style={[styles.title, {color: color.blue}]}>
            Done
          </Text>
        }
      />
      <View style={styles.container}>
        <View style={{marginTop: spacing[4]}}>
          <InputCustom
            autoFocus
            label="Intro"
            value={value}
            onChangeText={onchangeText}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: color.bgWhite,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
  },
});
