import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  CustomIcon,
  HeaderCustom,
  Back,
  VideoOn,
  GalleryFill,
} from '../../components';
import FastImage from 'react-native-fast-image';
import uuid from 'react-native-uuid';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import {addPost} from '../../controller';
import auth from '@react-native-firebase/auth';
import {color, spacing} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ItemImage = ({item, onPressRemove}: any) => {
  return (
    <View>
      {item.mediaType === 'image' ? (
        <FastImage
          style={styles.image}
          source={{
            // @ts-ignore: Object is possibly 'null'.
            uri: item.path,
            headers: {Authorization: 'staplerapp123456'},
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <Video style={styles.image} source={{uri: item.path}} />
      )}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPressRemove}
        style={{position: 'absolute', bottom: 100, left: 100}}>
        <CustomIcon name="cancel" size={20} color="#E10000" />
      </TouchableOpacity>
    </View>
  );
};

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const PostScreen = () => {
  const navigation = useNavigation();
  const [content, onChangeContent] = useState('');
  const [listCollection, setListCollection] = useState([]);
  const removeItem = (items: any, valueId: string) => {
    const itemsFilter = items.filter(
      (item: any) => item.collectionId !== valueId,
    );
    setListCollection(itemsFilter);
  };

  const renderItemImage = ({item}: any) => {
    return (
      <ItemImage
        item={item}
        onPressRemove={() => {
          removeItem(listCollection, item.collectionId);
        }}
      />
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePost = () => {
    // @ts-ignore: Object is possibly 'null'.
    addPost(auth().currentUser.uid, content, listCollection, () =>
      navigation.goBack(),
    );
  };

  const handleAddImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: true,
    }).then((images) => {
      // @ts-ignore: Object is possibly 'null'.
      let arrayResult = [];
      images.forEach((image) => {
        let obj = {collectionId: uuid.v4(), mediaType: 'image'};
        Object.assign(obj, image);
        arrayResult.push(obj);
      });
      //@ts-ignore: Object is possibly 'null'.
      setListCollection(listCollection.concat(arrayResult));
    });
  };

  const handleAddVideo = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
      multiple: true,
    }).then((videos) => {
      // @ts-ignore: Object is possibly 'null'.
      let arrayResult = [];
      videos.forEach((video) => {
        let obj = {collectionId: uuid.v4(), mediaType: 'video'};
        Object.assign(obj, video);
        arrayResult.push(obj);
      });
      //@ts-ignore: Object is possibly 'null'.
      setListCollection(listCollection.concat(arrayResult));
    });
  };

  return (
    <View style={styles.container}>
      <HeaderCustom
        backgroundStatusBar={color.bgWhite}
        title="Create post"
        leftComponent={
          <TouchableOpacity onPress={handleBack}>
            <Back />
          </TouchableOpacity>
        }
        rightComponent={
          content || listCollection.length > 0 ? (
            <Text style={styles.post} onPress={handlePost}>
              Post
            </Text>
          ) : (
            <View />
          )
        }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{width: WIDTH, height: HEIGHT - 65}}>
        <View style={styles.content}>
          <View style={styles.containerInput}>
            <TextInput
              multiline
              onChangeText={(text) => onChangeContent(text)}
              placeholder="Type content..."
              value={content}
              style={styles.textContent}
            />
          </View>
          {listCollection ? (
            <View>
              <FlatList
                horizontal
                data={listCollection}
                renderItem={renderItemImage}
                keyExtractor={(item) =>
                  // @ts-ignore: Object is possibly 'null'.
                  item.path
                }
              />
            </View>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={handleAddImage}
          activeOpacity={0.8}>
          <GalleryFill />
          <Text style={styles.textSelection}>Add images to your post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={handleAddVideo}
          activeOpacity={0.8}>
          <VideoOn />
          <Text style={styles.textSelection}>Add video to your post</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    height: HEIGHT - 150,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: color.light,
  },
  post: {
    fontSize: 18,
    fontWeight: '400',
    color: color.blue,
  },
  bottomButton: {
    maxHeight: 50,
    backgroundColor: color.bgWhite,
    borderTopWidth: 0.5,
    borderColor: color.textGray,
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textSelection: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
  containerInput: {
    flex: 1,
    marginBottom: 16,
  },
  textContent: {
    fontSize: 16,
    fontWeight: '500',
  },
  image: {
    height: 120,
    width: 120,
    marginRight: 10,
  },
});
