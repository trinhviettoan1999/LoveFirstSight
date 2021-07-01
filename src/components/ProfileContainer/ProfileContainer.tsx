import React from 'react';
import {View, StyleSheet, Pressable, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {calculateDistance, sendMessageRequest} from '../../controller';
import {ProfileInformation, MessageIcon} from '../';
import {color, spacing} from '../../theme';
import {ROUTER} from '../../constants';

interface ProfileProps {
  user: {
    userId: string;
    name: string;
    birthday: string;
    gender: string;
    avatar: string;
    email: string;
    intro: string;
    lookingFor: string;
    height: string;
    university: string;
    drinking: string;
    smoking: string;
    kids: string;
    province: string;
    coordinates: string;
    images: Array<string>;
    hobbies: Array<{id: number; value: string}>;
  };
  coordinate: {
    lat: number;
    long: number;
  };
}

export const ProfileContainer = ({user, coordinate}: ProfileProps) => {
  const navigation = useNavigation();

  const handleYesAlert = () => {
    sendMessageRequest(user.userId).then((conversationId) => {
      navigation.navigate(ROUTER.chat, {
        name: user.name,
        avatar: user.avatar,
        conversationId: conversationId,
        ownerId: user.userId,
        state: true,
      });
    });
  };

  const handleMessage = () => {
    Alert.alert(
      'Notification',
      `Do you want to send message to ${user.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: handleYesAlert,
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.infoContainer}>
      <ProfileInformation iconName="gender" content={user.gender} />
      {user.lookingFor ? (
        <ProfileInformation iconName="lookingfor" content={user.lookingFor} />
      ) : null}
      <ProfileInformation
        iconName="location"
        content="Located in Ho Chi Minh City, Viet Nam"
      />
      <ProfileInformation
        iconName="scope"
        content={
          `${calculateDistance(user.coordinates, coordinate)
            .toFixed(1)
            .toString()}` + ' km'
        }
      />
      {user.height ? (
        <ProfileInformation iconName="height" content={user.height + ' cm'} />
      ) : null}
      {user.university ? (
        <ProfileInformation iconName="university" content={user.university} />
      ) : null}
      {user.province ? (
        <ProfileInformation iconName="province" content={user.province} />
      ) : null}
      {user.drinking ? (
        <ProfileInformation iconName="drinking" content={user.drinking} />
      ) : null}
      {user.smoking ? (
        <ProfileInformation iconName="smoking" content={user.smoking} />
      ) : null}
      {user.kids ? (
        <ProfileInformation iconName="child" content={user.kids} />
      ) : null}
      <Pressable style={styles.messageIcon} onPress={handleMessage}>
        <MessageIcon />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: color.bgWhite,
    borderRadius: spacing[2],
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  messageIcon: {
    position: 'absolute',
    top: 15,
    right: 16,
  },
});
