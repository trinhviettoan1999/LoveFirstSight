import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, Pressable} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StatusBarCustom, CommentItem, Back, Send} from '../../components';
import {commentPost, getComments} from '../../controller';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import {color, spacing} from '../../theme';
import {Input, Image} from 'react-native-elements';

export const DetailNewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {listCollections, content, postId} = route.params;
  const [comment, setComment] = useState('');
  const [focused, setFocused] = useState(false);
  const [listComments, setListComments] = useState([
    {
      userId: '',
      comment: '',
      commentId: '',
      postId: '',
    },
  ]);

  const handleSend = () => {
    commentPost(comment, postId);
    setComment('');
  };

  useEffect(() => {
    const subscriber = getComments(postId, (result: any) => {
      setListComments(result);
    });
    return () => subscriber;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <View style={styles.newContainer}>
        {listCollections ? (
          <View style={styles.wrapper}>
            <Swiper
              loop={false}
              activeDotColor={color.primary}
              key={listCollections.length}>
              {listCollections.map((item: any) => {
                if (item.mediaType === 'image') {
                  return (
                    <Image
                      key={item.collectionId}
                      style={styles.collectionPost}
                      source={{
                        // @ts-ignore: Object is possibly 'null'.
                        uri: item.path,
                      }}
                      resizeMode="cover"
                    />
                  );
                } else {
                  return (
                    <Video
                      key={item.collectionId}
                      style={styles.collectionPost}
                      source={{uri: item.path}}
                    />
                  );
                }
              })}
            </Swiper>
          </View>
        ) : null}
        <Text style={styles.content}>{content}</Text>
        <Pressable
          style={styles.back}
          onPress={() => {
            navigation.goBack();
          }}>
          <Back color={color.bgWhite} />
        </Pressable>
      </View>
      <FlatList
        style={styles.flatlist}
        contentContainerStyle={{paddingTop: 10, paddingBottom: 16}}
        data={listComments}
        keyExtractor={(item, index) => index.toString()}
        removeClippedSubviews={false}
        ListFooterComponent={
          <Input
            placeholder="Type here..."
            inputContainerStyle={focused ? styles.inputFocused : styles.input}
            style={styles.textInput}
            containerStyle={styles.containerInput}
            placeholderTextColor={color.textGray}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            value={comment}
            onChangeText={setComment}
            rightIcon={
              <Pressable onPress={handleSend}>
                <Send />
              </Pressable>
            }
          />
        }
        renderItem={({item}) => (
          <CommentItem
            comment={item.comment}
            userId={item.userId}
            commentId={item.commentId}
            postId={postId}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  newContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
    paddingBottom: 10,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  wrapper: {
    width: '100%',
    height: 250,
  },
  collectionPost: {
    width: '100%',
    height: '100%',
  },
  content: {
    marginHorizontal: 16,
    marginTop: 10,
    fontSize: 16,
  },
  back: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    width: 30,
    height: 30,
    position: 'absolute',
    top: 10,
    left: 16,
  },
  flatlist: {
    paddingHorizontal: 16,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: color.light,
    borderRadius: spacing[2],
    paddingHorizontal: spacing[3],
    borderBottomWidth: 0,
  },
  inputFocused: {
    width: '100%',
    height: 40,
    backgroundColor: color.bgWhite,
    borderRadius: spacing[2],
    paddingHorizontal: spacing[3],
    borderWidth: 1,
    borderColor: color.primary,
  },
  textInput: {
    fontSize: 16,
    color: color.primary,
  },
  containerInput: {
    marginTop: spacing[4],
    paddingHorizontal: spacing[0],
  },
});
