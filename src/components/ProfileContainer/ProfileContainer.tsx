import React from 'react';
import {View, StyleSheet} from 'react-native';
import {calculateDistance} from '../../controller';
import {ProfileInformation} from '../';
import {color, spacing} from '../../theme';

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
});
