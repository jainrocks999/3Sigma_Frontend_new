import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, PermissionsAndroid} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import GModal from '../wrapper/GModal';
import Button from '../common/ButtonGroup';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import SInfoTypeEnum from '../../models/common/sInfoType.enum';
import sInfoUtil from '../../utils/sInfo.util';
import PressableText from '../common/PressableText';
import CallerIDPermission from './CallerIDPermission';
import GAlert from '../common/GAlert';
import {enableCallerId, disableCallerId} from 'callerid-module';
interface CallerIdModalProps {
  isVisible: boolean;
  onModalHide: () => void;
}
const CallerIdModal = ({isVisible, onModalHide}: CallerIdModalProps) => {
  const [playing, setPlaying] = useState<boolean>(false);
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
    const storedStatus = await sInfoUtil.fetch(SInfoTypeEnum.CALLER_ID_STATUS);
    if (storedStatus === '1') {
      setStatus(true);
    }
  };
  const setCallerIdStatus = async () => {
    if (!status) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]).then(async result => {
        if (
          result['android.permission.CALL_PHONE'] &&
          result['android.permission.READ_CALL_LOG'] &&
          result['android.permission.READ_PHONE_STATE'] &&
          result['android.permission.READ_CONTACTS']
        ) {
          try {
            await sInfoUtil.save(SInfoTypeEnum.CALLER_ID_STATUS, '1');
            const token = await sInfoUtil.fetch(SInfoTypeEnum.JWT);
            console.log(token);
            enableCallerId(`Bearer ${token}`);

            setStatus(true);
          } catch (error) {
            console.log(error);
          }
        } else {
          GAlert('Required permission not granted');
        }
      });
    } else {
      disableCallerId();
      await sInfoUtil.save(SInfoTypeEnum.CALLER_ID_STATUS, '0');
      setStatus(false);
    }
  };
  return (
    <>
      <GModal isVisible={isVisible} onModalHide={onModalHide}>
        <View style={styles.container}>
          <View>
            <Text style={styles.headerText}>Caller ID</Text>
            <Text style={styles.descriptionText}>
              With Caller ID all your CRM leads and data is available to you on
              the call screen itself ,allowing you to create task , notes,
              activites ,share content without opening CRM.
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
            <Text style={styles.descriptionText}>
              We need Some permissions to run CallerID smoothly. You can view
              more details related to permission{' '}
              <PressableText
                style={styles.pressableText}
                onPress={() => setPermissionModal(true)}>
                here
              </PressableText>
            </Text>
          </View>
          <View>
            {/* <Button buttonStyle={styles.buttonStyle} label={'Comming soon'} /> */}
            <Button
              onPress={setCallerIdStatus}
              buttonStyle={styles.buttonStyle}
              label={status ? 'Disable CallerID' : 'Enable CallerID'}
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
export default CallerIdModal;
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
  pressableText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.themeCol2,
  },
});
