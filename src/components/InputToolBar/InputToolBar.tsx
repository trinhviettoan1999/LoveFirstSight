import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Text,
} from 'react-native';
import {color} from '../../theme';
import {
  Mic,
  MicFill,
  Camera,
  CameraFill,
  Gallery,
  GalleryFill,
  BinFill,
  Send,
} from '../../components';
import {AudioRecorder} from 'react-native-audio';
import uuid from 'react-native-uuid';

interface PropsInputToolBar {
  onPressMic?: () => void;
  onPressBin?: () => void;
  onPressCamera?: () => void;
  onPressGallery?: () => void;
  onPressSendAudio?: () => void;
  onSendMessage?: () => void;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  setValueText: React.Dispatch<React.SetStateAction<string>>;
  currentTime: number;
  startAudio?: boolean;
  pressCamera?: boolean;
  pressPhotos?: boolean;
  valueText?: string;
  decibels?: {
    id: string;
    height: number;
  }[];
}

const getAudioTimeString = (seconds: any) => {
  const m = parseInt(((seconds % (60 * 60)) / 60).toString());
  const s = parseInt((seconds % 60).toString());
  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
};

export const InputToolBar = ({
  valueText,
  pressPhotos,
  startAudio,
  pressCamera,
  currentTime,
  onPressMic,
  onPressBin,
  onPressCamera,
  onPressGallery,
  onPressSendAudio,
  onSendMessage,
  setCurrentTime,
  setValueText,
  decibels,
}: PropsInputToolBar) => {
  const flatListWave = useRef(null);
  useEffect(() => {
    AudioRecorder.onProgress = (data: any) => {
      setCurrentTime(Math.floor(data.currentTime));
      let temp = Math.floor(data.currentMetering);
      if (temp > 0 && temp <= 500) {
        decibels.push({id: uuid.v4(), height: 5});
      }
      if (temp > 500 && temp <= 5000) {
        decibels.push({id: uuid.v4(), height: 8});
      }
      if (temp > 5000 && temp <= 10000) {
        decibels.push({id: uuid.v4(), height: 10});
      }
      if (temp > 10000 && temp <= 15000) {
        decibels.push({id: uuid.v4(), height: 13});
      }
      if (temp > 15000 && temp <= 17000) {
        decibels.push({id: uuid.v4(), height: 16});
      }
      if (temp > 17000) {
        decibels.push({id: uuid.v4(), height: 19});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAudio]);

  return (
    <View style={styles.inputToolbar}>
      {!startAudio ? (
        <TouchableOpacity
          style={styles.icon}
          activeOpacity={0.9}
          onPress={onPressMic}>
          {startAudio ? <MicFill /> : <Mic />}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.icon, {marginLeft: 10}]}
          activeOpacity={0.9}
          onPress={onPressBin}>
          <BinFill />
        </TouchableOpacity>
      )}
      {!startAudio && (
        <TouchableOpacity
          style={styles.icon}
          activeOpacity={0.9}
          onPress={onPressCamera}>
          {pressCamera ? <CameraFill /> : <Camera />}
        </TouchableOpacity>
      )}
      {!startAudio && (
        <TouchableOpacity
          style={styles.icon}
          activeOpacity={0.9}
          onPress={onPressGallery}>
          {pressPhotos ? <GalleryFill /> : <Gallery />}
        </TouchableOpacity>
      )}
      {!startAudio ? (
        <TextInput
          style={styles.textInput}
          value={valueText}
          onChangeText={(text) => {
            setValueText(text);
          }}
          multiline={true}
          placeholder="Type a message..."
        />
      ) : (
        <View style={styles.containerWaveSound}>
          <FlatList
            ref={flatListWave}
            data={decibels}
            renderItem={({item}) => (
              <View style={[styles.chilWave, {height: item.height}]} />
            )}
            horizontal
            keyExtractor={(item) => item.id}
            style={styles.wave}
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={() => {
              // @ts-ignore: Object is possibly 'null'.
              flatListWave.current.scrollToEnd({animated: true});
            }}
            onLayout={() => {
              // @ts-ignore: Object is possibly 'null'.
              flatListWave.current.scrollToEnd({animated: true});
            }}
          />
          <Text style={styles.textTime}>{getAudioTimeString(currentTime)}</Text>
        </View>
      )}
      {valueText ? (
        <TouchableOpacity
          style={[
            styles.icon,
            {
              marginRight: 16,
              width: 30,
              alignItems: 'flex-end',
            },
          ]}
          activeOpacity={0.9}
          onPress={onSendMessage}>
          <Send />
        </TouchableOpacity>
      ) : null}
      {startAudio && (
        <TouchableOpacity
          style={[styles.icon, {marginRight: 16}]}
          activeOpacity={0.9}
          onPress={onPressSendAudio}>
          <Send />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: color.textGray,
    backgroundColor: color.bgWhite,
  },
  containerWaveSound: {
    flex: 1,
    height: 35,
    backgroundColor: '#6A1616',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'center',
  },
  icon: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  textTime: {
    flex: 0.2,
    alignSelf: 'center',
    color: '#FFFFFF',
  },
  textInput: {
    marginLeft: 5,
    flex: 2,
    alignSelf: 'center',
    fontSize: 16,
  },
  wave: {
    flex: 4,
    marginLeft: 3,
    marginRight: 8,
    flexDirection: 'row',
  },
  chilWave: {
    alignSelf: 'center',
    width: 2,
    marginLeft: 1,
    backgroundColor: '#FFFFFF',
  },
});
