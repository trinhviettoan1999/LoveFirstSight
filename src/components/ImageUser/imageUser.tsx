import React, {useState} from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {Image} from 'react-native-elements';
import {spacing} from '../../theme/spacing';

type props = {
  urlImage?: string;
};

export const ImageUser = ({urlImage}: props) => {
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
      <Image
        style={styles.container}
        onLoadStart={() => {
          setLoad(true);
        }}
        source={{
          // @ts-ignore: Object is possibly 'null'.
          uri: urlImage,
        }}
        resizeMode="cover"
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
    marginTop: spacing[1],
    marginBottom: spacing[1],
    alignItems: 'center',
  },
  activityIndicator: {
    bottom: 200,
    top: 200,
    position: 'absolute',
  },
});
