import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import GModal from '../wrapper/GModal';
import R from 'resources/R';
interface YoutubePlayerProps {
  isVisible: boolean;
  videoId: string;
  onModalHide: () => void;
}
const YoutubePlayerModal = ({
  isVisible,
  onModalHide,
  videoId,
}: YoutubePlayerProps) => {
  const [playing, setPlaying] = useState<boolean>(false);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  return (
    <GModal isVisible={isVisible} onModalHide={onModalHide} position={'center'}>
      <View style={styles.container}>
        <View style={styles.playerContainer}>
          <YoutubePlayer
            height={200}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
          />
        </View>
      </View>
    </GModal>
  );
};
export default YoutubePlayerModal;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  playerContainer: {
    backgroundColor: R.colors.lightgray,
  },
});
