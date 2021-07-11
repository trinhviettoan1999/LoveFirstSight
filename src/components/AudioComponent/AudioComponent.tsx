import {color} from '../../theme';
import React, {FC} from 'react';
import {View, StyleSheet, Alert, Pressable} from 'react-native';
import {Slider} from 'react-native-elements';
import Sound from 'react-native-sound';
import {PauseIcon, PlayIcon} from '../AllSvgIcon/AllSvgIcon';
import {LinearProgress} from 'react-native-elements';

interface IProps {
  props: any;
  currentPlayedMessage: string;
  setCurrentPlayedMessage: (value: string) => void;
  setPlayAudio: (value: boolean) => void;
  setValueSlider: (value: number) => void;
  valueSlider: number;
  setTimeAudio: (value: number) => void;
  timeAudio: number;
}

export const AudioComponent: FC<IProps> = ({
  props,
  currentPlayedMessage,
  setCurrentPlayedMessage,
  setPlayAudio,
  setValueSlider,
  valueSlider,
  setTimeAudio,
  timeAudio,
}) => {
  const handlePlay = () => {
    setPlayAudio(true);
    setCurrentPlayedMessage(props.currentMessage._id);
    let audio = new Sound(props.currentMessage.audioV, '', (error) => {
      setTimeAudio(audio.getDuration());
      let valueChangeInterval = setInterval(() => {
        audio.getCurrentTime((seconds, isPlaying) => {
          if (isPlaying) {
            setValueSlider(seconds);
          }
          if (seconds >= audio.getDuration()) {
            clearInterval(valueChangeInterval);
          }
        });
      }, 50);
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // @ts-ignore: Object is possibly 'null'.
      audio.play((success) => {
        if (success) {
          setCurrentPlayedMessage('');
          setPlayAudio(false);
          setValueSlider(0);
          console.log(success, 'success play');
        } else {
          Alert.alert('There was an error playing this audio');
        }
      });
    });
  };

  return !props.currentMessage.audioV ? null : (
    <View>
      {props.currentMessage._id === currentPlayedMessage ? (
        <View
          style={[
            styles.containerAudio,
            {
              backgroundColor:
                props.position === 'left' ? color.bgWhite : color.primary,
            },
          ]}>
          <Pressable style={styles.iconAudio}>
            <PauseIcon />
          </Pressable>

          <LinearProgress
            style={{width: 110, marginLeft: 5}}
            color="primary"
            variant="determinate"
            value={valueSlider / timeAudio}
            trackColor="#C8C8C8"
          />
        </View>
      ) : (
        <View
          style={[
            styles.containerAudio,
            {
              backgroundColor:
                props.position === 'left' ? '#FFFFFF' : color.primary,
            },
          ]}>
          <Pressable style={styles.iconAudio} onPress={handlePlay}>
            <PlayIcon />
          </Pressable>
          <Slider
            style={{width: 110, marginLeft: 5}}
            maximumTrackTintColor="#C8C8C8"
            trackStyle={{height: 3}}
            thumbStyle={{
              height: 0,
              width: 0,
              backgroundColor: '#FFFFFF',
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerAudio: {
    height: 30,
    width: 150,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconAudio: {
    marginLeft: 5,
  },
});

export default AudioComponent;
