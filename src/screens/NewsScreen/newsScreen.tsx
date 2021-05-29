import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import {
  StatusBarCustom,
  RouteStackParamList,
  CustomIcon,
} from '../../components';
import {getAllPosts, unVotePost, votePost} from '../../controller';
import auth from '@react-native-firebase/auth';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>News</Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

type ItemPostProps = {
  userName: string;
  avatar: string;
  listCollections: any;
  content: string;
  postId: string;
  votes?: any;
  comments?: any;
  onPressComment?: any;
};

const ItemPost = ({
  userName,
  avatar,
  content,
  listCollections,
  postId,
  votes,
  comments,
  onPressComment,
}: ItemPostProps) => {
  return (
    <View style={styles.itemPost}>
      <View style={styles.topContainerPost}>
        <FastImage
          style={styles.avatar}
          source={{
            // @ts-ignore: Object is possibly 'null'.
            uri: avatar,
            headers: {Authorization: 'staplerapp123456'},
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text style={styles.textName}>{userName}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.textContent,
            {marginBottom: 10, paddingHorizontal: 16},
          ]}>
          {content}
        </Text>
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
                      resizeMode={FastImage.resizeMode.cover}
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
      </View>
      <View style={styles.bottomContainerPost}>
        <View style={styles.countView}>
          <Text style={styles.textContent}>{votes.length}</Text>
          <CustomIcon
            name="lookingfor"
            size={15}
            color="#6A1616"
            style={{marginLeft: 5, marginRight: 5}}
          />
          <Text style={styles.textContent}>, {comments.length}</Text>
          <CustomIcon
            name="comment"
            size={15}
            color="#6A1616"
            style={{marginLeft: 5}}
          />
        </View>
        {votes.indexOf(auth().currentUser?.uid) >= 0 ? (
          <TouchableOpacity
            style={styles.buttonVote}
            onPress={() => unVotePost(postId)}>
            <CustomIcon
              name="lookingfor"
              size={20}
              color="#6A1616"
              style={{marginRight: 5}}
            />
            <Text style={styles.textContent}>Vote</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.buttonVote}
            onPress={() => votePost(postId)}>
            <CustomIcon
              name="outline-heart"
              size={20}
              color="#6A1616"
              style={{marginRight: 5}}
            />
            <Text style={styles.textContent}>Vote</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.buttonComment} onPress={onPressComment}>
          <CustomIcon
            name="comment"
            size={20}
            color="#6A1616"
            style={{marginRight: 5}}
          />
          <Text style={styles.textContent}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const NewsScreen = ({navigation}: RouteStackParamList<'InitScreen'>) => {
  const [news, setNews] = useState(null);
  const FlatListHeader = () => {
    //View to set in Header
    return (
      <TouchableOpacity
        style={styles.createPostView}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('PostScreen');
        }}>
        <FastImage
          style={styles.avatar}
          source={{
            // @ts-ignore: Object is possibly 'null'.
            uri:
              'https://i.pinimg.com/originals/d5/5e/fc/d55efcc94b469ad21115c1d7fb9f0631.jpg',
            headers: {Authorization: 'staplerapp123456'},
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <TextInput
          placeholder="Create your new post!!"
          placeholderTextColor="#000000"
          editable={false}
          style={styles.textCreatePost}
        />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    // @ts-ignore: Object is possibly 'null'.
    const subscriber = getAllPosts(auth().currentUser?.uid, (result: any) =>
      setNews(result),
    );
    return () => subscriber;
  }, []);

  return (
    <View style={styles.container}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header />
      <View style={styles.scrollview}>
        {news ? (
          <FlatList
            data={news}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={FlatListHeader}
            renderItem={({item}) => (
              <ItemPost
                avatar="https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-9/147494558_2804481423101029_1797349764597040543_o.jpg?_nc_cat=109&ccb=3&_nc_sid=09cbfe&_nc_ohc=dt2LUudNHn8AX-6psKP&_nc_ht=scontent.fdad2-1.fna&oh=40ce37e9119b61f901ad45a564399c8e&oe=605B5BDD"
                userName="toan"
                postId={item.id}
                content={item.data().content}
                listCollections={item.data().collections}
                votes={item.data().votes ?? []}
                comments={item.data().comments ?? []}
                onPressComment={() =>
                  navigation.navigate('DetailNewScreen', {
                    postId: item.id,
                    listCollections: item.data().collections,
                    content: item.data().content,
                  })
                }
              />
            )}
            contentContainerStyle={styles.contentContainerFlat}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollview: {
    flex: 1,
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
  itemPost: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
    elevation: 7,
  },
  headerContainer: {
    width: '100%',
    height: 45,
    backgroundColor: '#F8F8F8',
  },
  header: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#C8C8C8',
  },
  textHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#6A1616',
    flex: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginRight: 10,
  },
  textCreatePost: {
    flex: 2,
    borderWidth: 0.3,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#F8F8F8',
  },
  contentContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  topContainerPost: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bottomContainerPost: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.2,
    paddingHorizontal: 16,
  },
  countView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonVote: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonComment: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    fontSize: 16,
    fontWeight: '300',
  },
  textName: {
    fontSize: 16,
    fontWeight: '700',
  },
  collectionPost: {
    width: '100%',
    height: 350,
  },
  wrapper: {width: '100%', height: 350},
  contentContainerFlat: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 10,
  },
});
