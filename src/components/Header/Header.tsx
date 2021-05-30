import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import CustomIcon from '../CustomIcon/customIcon';

type Props = {
  title: string;
  textLeft: string;
  textRight: string;
  iconNameLeft: string;
  iconNameRight: string;
  showIconRight: boolean;
  showTextRight: boolean;
  showIconLeft: boolean;
  showTextLeft: boolean;
  onPressRight: any;
  onPressLeft: any;
  showAvatar?: boolean;
  avatarUri?: string;
  onPressAvatar?: any;
};

export const Header = ({
  title,
  textLeft,
  textRight,
  iconNameLeft,
  iconNameRight,
  showIconLeft,
  showIconRight,
  showTextLeft,
  showTextRight,
  onPressLeft,
  onPressRight,
  showAvatar,
  avatarUri,
  onPressAvatar,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={onPressLeft}
          activeOpacity={0.9}>
          {showIconLeft ? (
            <CustomIcon name={iconNameLeft} size={20} color="#000000" />
          ) : null}
          {showTextLeft ? (
            <Text style={styles.textLeft}>{textLeft}</Text>
          ) : null}
        </TouchableOpacity>
        <View style={styles.headerTiltle}>
          {showAvatar ? (
            <TouchableOpacity
              style={styles.avatar}
              activeOpacity={0.5}
              onPress={onPressAvatar}>
              <Image style={styles.avatar} source={{uri: avatarUri}} />
            </TouchableOpacity>
          ) : null}
          <Text style={styles.textTitle}>{title}</Text>
        </View>
        <TouchableOpacity
          style={styles.headerRight}
          onPress={onPressRight}
          activeOpacity={0.9}>
          {showTextRight ? (
            <Text style={styles.textRight} onPress={onPressRight}>
              {textRight}
            </Text>
          ) : null}
          {showIconRight ? (
            <CustomIcon
              name={iconNameRight}
              size={25}
              color="#6A1616"
              onPress={onPressRight}
            />
          ) : null}
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
  },
  headerContainer: {
    width: '100%',
    height: 44,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginRight: 5,
  },
  headerTiltle: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#C8C8C8',
  },
  textTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#000000',
  },
  textRight: {
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#6A1616',
  },
  textLeft: {
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#ACACAC',
  },
});
