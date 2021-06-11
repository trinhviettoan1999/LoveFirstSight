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
  onPress?: () => void;
}

export const ProfileContainer = ({user, coordinate, onPress}: ProfileProps) => {
  return (
    <View style={styles.infoContainer}>
      <ProfileInformation iconName="gender" content={user.gender} onPress />
      {user.lookingFor ? (
        <ProfileInformation iconName="lookingfor" content={user.lookingFor} />
      ) : null}
      <ProfileInformation
        onPress
        iconName="location"
        content="Located in Ho Chi Minh City, Viet Nam"
      />
      <ProfileInformation
        onPress
        iconName="scope"
        content={
          `${calculateDistance(user.coordinates, coordinate)
            .toFixed(1)
            .toString()}` + ' km'
        }
      />
      {user.height ? (
        <ProfileInformation
          onPress
          iconName="height"
          content={user.height + ' cm'}
        />
      ) : null}
      {user.university ? (
        <ProfileInformation
          onPress
          iconName="university"
          content={user.university}
        />
      ) : null}
      {user.province ? (
        <ProfileInformation
          onPress
          iconName="province"
          content={user.province}
        />
      ) : null}
      {user.drinking ? (
        <ProfileInformation
          onPress
          iconName="drinking"
          content={user.drinking}
        />
      ) : null}
      {user.smoking ? (
        <ProfileInformation onPress iconName="smoking" content={user.smoking} />
      ) : null}
      {user.kids ? (
        <ProfileInformation onPress iconName="child" content={user.kids} />
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
  },
});
