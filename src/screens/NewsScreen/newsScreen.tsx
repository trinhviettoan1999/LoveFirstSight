import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Pressable, Text, FlatList} from 'react-native';
import {Image} from 'react-native-elements';
import {
  Bin,
  Edit,
  HeaderCustom,
  openNotification,
  PostItem,
} from '../../components';
import {deletePost, getAllPosts, getUser} from '../../controller';
import auth from '@react-native-firebase/auth';
import {color, spacing} from '../../theme';
import {ROUTER} from '../../constants/router';
import Modal from 'react-native-modal';

export const NewsScreen = () => {
  const navigation = useNavigation();
  const [news, setNews] = useState(null);
  const [isModalVisibleMenu, setIsModalVisibleMenu] = useState(false);
  const [idSelected, setIdSelected] = useState('');
  const [user, setUser] = useState({
    avatar: '',
  });

  const FlatListHeader = () => {
    //View to set in Header
    return (
      <Pressable
        style={styles.createPostView}
        onPress={() => {
          navigation.navigate(ROUTER.post);
        }}>
        <Image
          style={styles.avatar}
          source={{
            // @ts-ignore: Object is possibly 'null'.
            uri: user.avatar,
          }}
          resizeMode="cover"
        />
        <Text style={styles.textCreatePost}>Create your new post!!</Text>
      </Pressable>
    );
  };

  const handleMore = (postId: string) => {
    setIsModalVisibleMenu(true);
    setIdSelected(postId);
  };

  const handleDeletePost = () => {
    setIsModalVisibleMenu(false);
    deletePost(idSelected).then(() =>
      openNotification('success', 'Deleted success!'),
    );
  };

  useEffect(() => {
    getUser(auth().currentUser?.uid || '').then((result) => setUser(result));
    return () => {
      getUser(auth().currentUser?.uid || '').then((result) => setUser(result));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // @ts-ignore: Object is possibly 'null'.
    const subscriber = getAllPosts(auth().currentUser?.uid, (result: any) => {
      setNews(result);
    });
    return () => subscriber;
  }, []);

  return (
    <View style={styles.scrollView}>
      <HeaderCustom
        leftComponent={<Text style={styles.title}>News</Text>}
        backgroundStatusBar={color.bgWhite}
      />
      {news ? (
        <FlatList
          data={news}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={FlatListHeader}
          renderItem={({item}) => (
            <PostItem
              userId={item.data().userId}
              postId={item.id}
              content={item.data().content}
              listCollections={item.data().collections}
              votes={item.data().votes ?? []}
              comments={item.data().comments ?? []}
              onPressComment={() =>
                navigation.navigate(ROUTER.detailNew, {
                  postId: item.id,
                  listCollections: item.data().collections,
                  content: item.data().content,
                })
              }
              onPressMore={() => handleMore(item.id)}
            />
          )}
          contentContainerStyle={styles.contentContainerFlat}
        />
      ) : null}
      <Modal
        backdropTransitionOutTiming={0}
        swipeDirection="down"
        onSwipeComplete={() => setIsModalVisibleMenu(false)}
        hideModalContentWhileAnimating
        isVisible={isModalVisibleMenu}
        style={styles.modalMenu}
        onBackdropPress={() => setIsModalVisibleMenu(false)}
        backdropOpacity={0.5}>
        <View style={[styles.buttonModal, {backgroundColor: color.primary}]}>
          <Edit />
          <Text
            style={[styles.textButtonModal, {color: color.bgWhite}]}
            onPress={() => {
              setIsModalVisibleMenu(false);
            }}>
            Edit post
          </Text>
        </View>
        <View style={[styles.buttonModal, {backgroundColor: color.light}]}>
          <Bin />
          <Text
            style={[styles.textButtonModal, {color: color.primary}]}
            onPress={handleDeletePost}>
            Delete post
          </Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 20,
    color: color.primary,
    fontWeight: 'bold',
  },
  createPostView: {
    width: '100%',
    height: 70,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 7,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginRight: 10,
  },
  textCreatePost: {
    flex: 1,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: spacing[1],
    borderWidth: 1,
    borderColor: color.textGray,
    color: color.text,
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  contentContainerFlat: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 10,
  },
  modalMenu: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonModal: {
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  textButtonModal: {
    fontSize: 17,
    fontWeight: '500',
    fontStyle: 'normal',
    marginLeft: spacing[2],
  },
});
