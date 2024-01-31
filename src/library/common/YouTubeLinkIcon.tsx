import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {YOUTUBE_LINK} from '../../configs/constants';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import YoutubePlayerModal from '../modals/YoutubePlayerModal';

const YouTubeLinkIcon = ({screenName}: {screenName: ScreenNameEnum}) => {
  const [openVideoPlayer, setOpen] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <MaterialCommunityIcons name={'youtube'} size={30} color={'red'} />
      </TouchableOpacity>
      <YoutubePlayerModal
        isVisible={openVideoPlayer}
        onModalHide={() => setOpen(false)}
        videoId={YOUTUBE_LINK[screenName]}
      />
    </>
  );
};
export default YouTubeLinkIcon;
