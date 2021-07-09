import React, {useState, useRef, FC} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import Video from 'react-native-video';
import {color} from '../../theme/';

interface IProps {
  video: string;
}

export const VideoPlayer: FC<IProps> = ({video}) => {
  // The video we will play on the player.
  //   const video = require('../assets/video.mp4');

  const videoPlayer = useRef(null);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);

  const [currentTime, setCurrentTime] = useState(0);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
  const [isLoading, setIsLoading] = useState(true);

  const onSeek = (seek: any) => {
    // @ts-ignore: Object is possibly 'null'.
    videoPlayer?.current.seek(seek);
  };

  const onSeeking = (currentVideoTime: any) => setCurrentTime(currentVideoTime);

  const onPaused = (newState: any) => {
    setPaused(!paused);
    setPlayerState(newState);
  };

  const onReplay = () => {
    // @ts-ignore: Object is possibly 'null'.

    videoPlayer?.current.seek(0);
    setCurrentTime(0);
    if (Platform.OS === 'android') {
      setPlayerState(PLAYER_STATES.PAUSED);
      setPaused(true);
    } else {
      setPlayerState(PLAYER_STATES.PLAYING);
      setPaused(false);
    }
  };

  const onProgress = (data: any) => {
    if (!isLoading) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data: any) => {
    setDuration(Math.round(data.duration));
    setIsLoading(false);
  };

  const onLoadStart = () => setIsLoading(true);

  const onEnd = () => {
    setPlayerState(PLAYER_STATES.ENDED);
    setCurrentTime(duration);
  };

  return (
    <View>
      <Video
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        posterResizeMode={'cover'}
        onProgress={onProgress}
        paused={paused}
        ref={(ref: any) => (videoPlayer.current = ref)}
        resizeMode={'cover'}
        source={{uri: video}}
        style={styles.backgroundVideo}
      />
      <MediaControls
        children={<View />}
        containerStyle={styles.mediaControls}
        isFullScreen={false}
        duration={duration}
        isLoading={isLoading}
        progress={currentTime}
        onPaused={onPaused}
        onReplay={onReplay}
        onSeek={onSeek}
        onSeeking={onSeeking}
        mainColor={color.primary}
        playerState={playerState}
        sliderStyle={{
          containerStyle: {},
          thumbStyle: {},
          trackStyle: {},
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    height: 350,
    width: '100%',
  },
  mediaControls: {
    height: 350,
    flex: 1,
    alignSelf: 'center',
  },
});
