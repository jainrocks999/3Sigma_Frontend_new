import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  AppState,
  PermissionsAndroid,
} from 'react-native';
import {IconButton} from './ButtonGroup';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import AutoDialerSettingModal from '../modals/AutoDialerSettingModal';
import {RootDispatch, RootState} from '../../store/app.store';
import {useDispatch, useSelector} from 'react-redux';
import GCountDown from './GCountDown';
import {iosCall, andCall} from 'rn-direct-phone-call';
import {
  selectAllLeads,
  setAutoDialerStatus,
  setCallStatus,
  setDialerIndex,
} from '../../store/slices/lead.slice';
import GAlert, {MessageType} from './GAlert';
import CallDetectorManager from 'react-native-call-detection';

export default function AutoDialer() {
  const dispatch = useDispatch<RootDispatch>();
  const leads = useSelector(selectAllLeads);
  const appState = useRef(AppState.currentState);
  const [callingName, setCallignName] = useState('');
  const {countDownTimer, currentIndex, dialerStatus, isCallAlive} = useSelector(
    (state: RootState) => state.lead.autoDialingMetaData,
  );
  const {totalLeads} = useSelector((state: RootState) => state.lead);
  const [settingsModal, setSetting] = useState<boolean>(false);
  const startNewCall = (phone: string) => {
    if (Platform.OS === 'ios') {
      iosCall(phone);
    } else {
      andCall(phone, 0);
    }
  };
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;

      if (appState.current === 'active') {
        handleCallEnd();
      }
    });

    return () => {
      try {
        subscription.remove();
      } catch (error) {}
    };
  }, []);
  useEffect(() => {
    let callDetector = null;
    try {
      const permission = PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);

      permission.then(response => {
        console.log(response);
        if (
          response['android.permission.CALL_PHONE'] === 'granted' &&
          response['android.permission.PROCESS_OUTGOING_CALLS'] === 'granted' &&
          response['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
          response['android.permission.READ_PHONE_STATE'] === 'granted'
        ) {
          callDetector = new CallDetectorManager(
            (event: string, phoneNumber: string) => {
              if (event === 'Disconnected') {
                handleCallEnd();
                // Do something call got disconnected
              } else if (event === 'Connected') {
                // Do something call got connected
                // This clause will only be executed for iOS
              } else if (event === 'Incoming') {
                // Do something call got incoming
              } else if (event === 'Dialing') {
                // Do something call got dialing
                // This clause will only be executed for iOS
              } else if (event === 'Offhook') {
                //Device call state: Off-hook.
                // At least one call exists that is dialing,
                // active, or on hold,
                // and no calls are ringing or waiting.
                // This clause will only be executed for Android
              } else if (event === 'Missed') {
                handleCallEnd();
                // Do something call got missed
                // This clause will only be executed for Android
              }
            },
            false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
            () => {}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
            {
              title: 'Phone State Permission',
              message:
                'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
            }, // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
          );
        } else {
          console.log('Permission not granted');
        }
      });

      return callDetector ? callDetector?.dispose() : () => {};
    } catch (error) {
      console.log('error', error);
    }
    return;
  }, []);

  const handleTimerEnd = () => {
    if (leads.length > currentIndex) {
      const lead = leads[currentIndex];
      GAlert('Dialing ' + lead.phone, MessageType.SUCCESS);
      dispatch(setDialerIndex(currentIndex + 1));
      dispatch(setCallStatus(true));
      setCallignName(lead.name || lead.phone || '');
      //Start the Call
      startNewCall(lead.phone || '');
    } else {
      GAlert('End of list reached ');
    }
  };
  const handleCallEnd = () => {
    dispatch(setCallStatus(false));
  };
  const handleNextClick = () => {
    dispatch(setDialerIndex(currentIndex + 1));
    dispatch(setCallStatus(true));
  };
  const handlePause = () => {
    dispatch(setAutoDialerStatus(false));
  };
  const handleStopDialer = () => {
    dispatch(setAutoDialerStatus(false));
    dispatch(setDialerIndex(0));
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerText}>
              {dialerStatus ? 'Auto Dialling...' : 'Start auto dialer'}
            </Text>
            <Text style={styles.summeryText}>
              {dialerStatus
                ? `Calling ${currentIndex + 1} out of ${totalLeads}`
                : `Total ${totalLeads} leads for call`}
            </Text>
            {isCallAlive && (
              <Text style={styles.descriptionText}>
                Calling to . {callingName}
              </Text>
            )}
            {!isCallAlive && dialerStatus && (
              <Text style={styles.descriptionText}>
                Starting in{' '}
                <GCountDown
                  until={countDownTimer}
                  onFinish={() => {
                    handleTimerEnd();
                  }}
                  digitStyle={styles.digitStyle}
                  labelStyle={styles.labelStyle}
                />{' '}
                seconds
              </Text>
            )}
          </View>
          <IconButton
            iconSize={20}
            icon={'cog'}
            onPress={() => setSetting(true)}
          />
        </View>
        <View style={styles.controller}>
          <IconButton
            iconSize={20}
            icon={dialerStatus ? 'pause' : 'play'}
            btnStyle={styles.btnStyle}
            onPress={() =>
              !dialerStatus
                ? dispatch(setAutoDialerStatus(true))
                : handlePause()
            }
          />
          <IconButton
            iconSize={20}
            icon={'stop'}
            btnStyle={styles.btnStyle}
            iconColor={'red'}
            onPress={handleStopDialer}
          />
          <IconButton
            iconSize={20}
            icon={'skip-next'}
            btnStyle={styles.btnStyle}
            onPress={() => handleNextClick()}
          />
        </View>
      </View>
      <AutoDialerSettingModal
        isVisible={settingsModal}
        onModalHide={() => setSetting(false)}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  descriptionText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.gray,
  },
  summeryText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.REGULAR),
    color: R.colors.themeCol1,
  },
  controller: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btnStyle: {
    marginLeft: 5,
  },
  stopBtnStyle: {
    marginLeft: 5,
  },
  digitStyle: {
    backgroundColor: 'transparent',
    height: 20,
    width: 20,
    padding: 0,
    margin: -5,
  },
  labelStyle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.gray,
  },
});
