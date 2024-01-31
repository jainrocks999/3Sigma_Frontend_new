import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import GModal from '../wrapper/GModal';
import Button from '../common/ButtonGroup';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import SInfoTypeEnum from '../../models/common/sInfoType.enum';
import sInfoUtil from '../../utils/sInfo.util';
import CallerIDPermission from './CallerIDPermission';
import SectionedTextInput from '../form-field/SectionedTextInput';
// import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlob from 'react-native-blob-util';
interface CallRecordingProps {
  isVisible: boolean;
  onModalHide: () => void;
}
const CallRecording = ({isVisible, onModalHide}: CallRecordingProps) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [recordingpath, setRecordingPath] = useState<string>('');
  const [permissionModal, setPermissionModal] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);
  useEffect(() => {
    initCallerIdStatus();
  }, []);
  const initCallerIdStatus = async () => {
    const storedStatus = await sInfoUtil.fetch(
      SInfoTypeEnum.CALL_RECORDING_STATUS,
    );
    if (storedStatus === '1') {
      setStatus(true);
    }
  };
  const setCallerIdStatus = async () => {
    if (status) {
      await sInfoUtil.save(SInfoTypeEnum.CALL_RECORDING_STATUS, 0);
      setStatus(false);
    } else {
      await sInfoUtil.save(SInfoTypeEnum.CALL_RECORDING_STATUS, 1);
      setStatus(true);
    }
  };
  return (
    <>
      <GModal isVisible={isVisible} onModalHide={onModalHide}>
        <View style={styles.container}>
          <View>
            <Text style={styles.headerText}>Upload Call Recording</Text>
            <Text style={styles.descriptionText}>
              With this feature you can upload call recording along with
              activity
            </Text>
          </View>
          <View>
            <YoutubePlayer
              height={300}
              play={playing}
              videoId={'iee2TATGMyI'}
              onChangeState={onStateChange}
            />
          </View>
          <View>
            <SectionedTextInput
              label={'Call Recording path'}
              placeholder={'Enter path'}
              isRequired={true}
              multiline
              defaultValue={`${recordingpath || ''}`}
              onChangeText={(notes: string) => {
                setRecordingPath(notes);
              }}
              containerStyle={styles.inputContainer}
            />
            <Text style={styles.exampleText}>
              Ex. {RNFetchBlob.fs.dirs.DownloadDir}
            </Text>
          </View>
          <View>
            <Button
              onPress={setCallerIdStatus}
              buttonStyle={styles.buttonStyle}
              label={
                status ? 'Disable Upload Recording' : 'Enable Upload Recording'
              }
            />
          </View>
        </View>
      </GModal>
      <CallerIDPermission
        isVisible={permissionModal}
        onModalHide={() => setPermissionModal(true)}
      />
    </>
  );
};
export default CallRecording;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonStyle: {
    backgroundColor: R.colors.themeCol2,
    borderRadius: 10,
  },
  headerText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    marginBottom: 10,
  },
  descriptionText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.themeCol1,
    marginBottom: 10,
  },
  exampleText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.lightgray,
    marginBottom: 10,
  },
  inputContainer: {borderWidth: 0.5, borderColor: R.colors.lightGray},
});
