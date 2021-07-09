import React, {FC, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import FastImage from 'react-native-fast-image';
import {deleteComment, getUser} from '../../controller';
import auth from '@react-native-firebase/auth';
import {Bin} from '../AllSvgIcon/AllSvgIcon';

interface IProps {
  comment: string;
  userId: string;
  commentId: string;
  postId: string;
}

export const CommentItem: FC<IProps> = ({
  comment,
  userId,
  commentId,
  postId,
}) => {
  const [user, setUser] = useState({
    avatar: '',
    name: '',
  });

  const handleDelete = () => {
    Alert.alert(
      'Notification',
      'Do you want to delete this comment??',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => deleteComment(postId, commentId, comment, userId),
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    if (userId) {
      getUser(userId).then((result) => {
        setUser(result);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <View style={styles.commentContainer}>
      <FastImage
        style={styles.avatar}
        source={{
          uri: user?.avatar,
        }}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text>{comment}</Text>
      </View>
      {userId === auth().currentUser?.uid && (
        <Pressable onPress={handleDelete}>
          <Bin />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  info: {
    marginLeft: 10,
    flex: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
