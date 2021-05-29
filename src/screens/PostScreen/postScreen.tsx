import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import {
  StatusBarCustom,
  Header,
  RouteStackParamList,
  CustomIcon,
} from '../../components';
import FastImage from 'react-native-fast-image';
import uuid from 'react-native-uuid';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import {addPost} from '../../controller';
import auth from '@react-native-firebase/auth';

var videoIcon = require('../../../assets/images/video-icon.png');
var galleryIcon = require('../../../assets/images/gallery-icon.png');

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
        <CustomIcon name="cancel" size={20} color="#6A1616" />
      </TouchableOpacity>
    </View>
  );
};

export const PostScreen = ({navigation}: RouteStackParamList<'InitScreen'>) => {
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
  return (
    <View style={styles.container}>
      <StatusBarCustom backgroundColor="#F8F8F8" barStyle="dark-content" />
      <Header
        title="Create post"
        showIconLeft={true}
        iconNameLeft="back"
        showTextRight={content || listCollection.length > 0 ? true : false}
        textRight="Post"
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          // @ts-ignore: Object is possibly 'null'.
          addPost(auth().currentUser.uid, content, listCollection, () =>
            navigation.goBack(),
          );
        }}
      />
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
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() =>
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
            })
          }
          activeOpacity={0.8}>
          <Image style={{width: 30, height: 30}} source={galleryIcon} />
          <Text style={styles.textSelection}>Add images to your post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() =>
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
            })
          }
          activeOpacity={0.8}>
          <Image style={{width: 30, height: 30}} source={videoIcon} />
          <Text style={styles.textSelection}>Add video to your post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  bottomButtonContainer: {
    flex: 1,
    paddingHorizontal: 16,
    borderTopWidth: 0.2,
    flexDirection: 'row',
  },
  content: {
    flex: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  bottomButton: {
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
