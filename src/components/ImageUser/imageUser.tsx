import React, {useState} from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import FastImage from 'react-native-fast-image';

type props = {
  urlImage: string;
};

const ImageUser = ({urlImage}: props) => {
  const [load, setLoad] = useState(false);
  return (
    <View style={styles.container}>
      {load ? (
        <ActivityIndicator
          color="#red"
          size="large"
          style={styles.activityIndicator}
        />
      ) : null}
      <FastImage
        style={styles.container}
        onLoadStart={() => {
          setLoad(true);
        }}
        source={{
          // @ts-ignore: Object is possibly 'null'.
          uri: urlImage,
          headers: {Authorization: 'staplerapp123456'},
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
        onLoadEnd={() => {
          setLoad(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  activityIndicator: {
    bottom: 200,
    top: 200,
    position: 'absolute',
  },
});

export default ImageUser;
