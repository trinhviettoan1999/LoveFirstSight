import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  StatusBarCustom,
  RouteStackParamList,
  CustomIcon,
} from '../../components';
import {
  commentPost,
  getComments,
  deleteComment,
  editComment,
} from '../../controller';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import auth from '@react-native-firebase/auth';

type commentProps = {
  avatar?: string;
  comment: string;
  name?: string;
  userId: string;
  commentId: string;
  postId: string;
};

const ItemComment = ({
  name,
  comment,
  userId,
  commentId,
  postId,
}: commentProps) => {
  const [showOption, setShowOption] = useState(false);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState('');
  useEffect(() => {
    setText(comment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  return (
    <View style={styles.commentContainer}>
      <FastImage
        style={styles.avatar}
        source={{
          uri:
            'https://media-cdn.laodong.vn/Storage/NewsPortal/2020/8/21/829850/Bat-Cuoi-Truoc-Nhung-07.jpg',
        }}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {!edit && <Text>{comment}</Text>}
        {edit && (
          <View>
            <TextInput
              value={text}
              onChangeText={setText}
              autoFocus
              style={{height: 40}}
            />
            <View style={styles.containerSave}>
              <Text
                style={{color: '#6A1616'}}
                onPress={() => {
                  editComment(postId, commentId, text, userId);
                  setEdit(false);
                }}>
                Save
              </Text>
              <Text
                style={{marginLeft: 10}}
                onPress={() => {
                  setEdit(false);
                }}>
                Cancel
              </Text>
            </View>
          </View>
        )}
      </View>
      {userId === auth().currentUser?.uid && !edit ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowOption(!showOption)}>
          <CustomIcon
            name="option"
            size={18}
            color="#6A1616"
            style={{alignSelf: 'flex-end'}}
          />
        </TouchableOpacity>
      ) : null}
      {showOption && (
        <View style={styles.option}>
          <TouchableOpacity
            style={styles.textOption}
            onPress={() => {
              deleteComment(postId, commentId, comment, userId),
                setShowOption(false);
            }}>
            <Text>Delete comment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.textOption}
            onPress={() => {
              setEdit(true);
              setShowOption(false);
            }}>
            <Text>Edit comment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const DetailNewScreen = ({
  navigation,
  route,
}: RouteStackParamList<'InitScreen'>) => {
  const [comment, setComment] = useState('');
  const [listComments, setListComments] = useState([
    {
      userId: '',
      comment: '',
      commentId: '',
      postId: '',
    },
  ]);
  const {listCollections, content, postId} = route.params;
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
              activeDotColor="#6A1616"
              key={listCollections.length}>
              {listCollections.map((item: any) => {
                if (item.mediaType === 'image') {
                  return (
                    <FastImage
                      key={item.collectionId}
                      style={styles.collectionPost}
                      source={{
                        // @ts-ignore: Object is possibly 'null'.
                        uri: item.path,
                        headers: {Authorization: 'staplerapp123456'},
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
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
            <TouchableOpacity
              style={styles.back}
              onPress={() => navigation.goBack()}>
              <CustomIcon name="cancel" color="#6A1616" size={20} />
            </TouchableOpacity>
          </View>
        ) : null}
        <Text style={styles.content}>{content}</Text>
      </View>
      <FlatList
        style={styles.flatlist}
        contentContainerStyle={{paddingTop: 10, paddingBottom: 16}}
        data={listComments}
        keyExtractor={(item, index) => index.toString()}
        removeClippedSubviews={false}
        ListFooterComponent={
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type here..."
              style={styles.input}
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity
              style={styles.send}
              onPress={() => {
                commentPost(comment, postId);
                setComment('');
              }}>
              <CustomIcon
                name="send"
                color="#6A1616"
                size={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </View>
        }
        renderItem={({item}) => (
          <ItemComment
            name="Toàn"
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
    backgroundColor: '#F8F8F8',
  },
  newContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    elevation: 7,
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
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
    position: 'absolute',
    top: 10,
    right: 16,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlist: {
    paddingHorizontal: 16,
  },
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 20,
    borderColor: '#6A1616',
  },
  send: {
    flex: 2,
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  input: {
    flex: 15,
    paddingHorizontal: 10,
  },
  option: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
    right: 20,
    top: -10,
  },
  textOption: {
    margin: 5,
  },
  containerSave: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});
