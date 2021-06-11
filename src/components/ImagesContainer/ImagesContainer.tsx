import React from 'react';
import {View} from 'react-native';
import {ImageUser} from '../';
import {spacing} from '../../theme';

interface ImagesProps {
  images: Array<string>;
}

export const ImagesContainer = ({images}: ImagesProps) => {
  return (
    <View style={{paddingHorizontal: spacing[4]}}>
      {images[0] ? <ImageUser urlImage={images[0] || ''} /> : null}
      {images[1] ? <ImageUser urlImage={images[1] || ''} /> : null}
      {images[2] ? <ImageUser urlImage={images[2] || ''} /> : null}
      {images[3] ? <ImageUser urlImage={images[3] || ''} /> : null}
      {images[4] ? <ImageUser urlImage={images[4] || ''} /> : null}
      {images[5] ? <ImageUser urlImage={images[5] || ''} /> : null}
      {images[6] ? <ImageUser urlImage={images[6] || ''} /> : null}
      {images[7] ? <ImageUser urlImage={images[7] || ''} /> : null}
    </View>
  );
};
