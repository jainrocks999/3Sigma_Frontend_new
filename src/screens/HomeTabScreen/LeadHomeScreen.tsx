/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import GScreen from 'library/wrapper/GScreen';
import LeadHeader from './Components/LeadHeader';
import HoverButton from 'library/buttons/HoverButton';
import ListModal from 'library/common/ListModal';
import {useNavigation} from '@react-navigation/native';
import LeadsSectionList from './Components/LeadsSectionList';
import {Linking, Platform, StyleSheet, View} from 'react-native';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import R from 'resources/R';
import PhoneBook from 'library/modals/PhoneBook';
import {
  getLeads,
  selectBulkMetadata,
  setCallLogs,
} from '../../store/slices/lead.slice';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {BulkSelectionMetadata} from 'datalib/entity/lead';
import CallLogsScreen from '../CallLogScreen/CallLogsScreen';
import ga from 'library/hooks/analytics';
import AppTourWrapper from 'library/wrapper/AppTourWrapper';
import {TourGuideProvider} from 'rn-tourguide';
import messaging from '@react-native-firebase/messaging';
import {APP_TOUR} from '../../configs/constants';
import PushNotification from 'react-native-push-notification';
const LeadHomeScreen = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const bulkMetadata: BulkSelectionMetadata = useSelector(selectBulkMetadata);
  const [isFilterApplied, setFilterApplied] = useState<boolean>(false);
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [showPhoneBookMenu, setShowPhoneBookMenu] = useState<boolean>(false);
  const {leadFilterMetadata, leadPaginationMetadata, displayCallLogs} =
    useSelector((state: RootState) => state.lead);

  useEffect(() => {
    Linking.getInitialURL()
      .then(url => {
        if (url) {
          console.log('props', props, url);
          Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async notification => {
      console.log('Message handled !', notification);
    });
    messaging().setBackgroundMessageHandler(async notification => {
      console.log('Message handled in the background!', notification);
      PushNotification.localNotification({
        allowWhileIdle: true,
        ignoreInForeground: false,
        title: notification?.title || '',
        message: notification?.message || '',
        soundName: 'notification.mp3',
        visibility: 'public',
        channelId: 'default',
        playSound: true,
      });
    });
    return unsubscribe;
  }, []);
  const handleMenuSelect = async (value: string) => {
    await ga.logEvent('Add_New_Lead', {action: value});
    setShowAddMenu(false);
    if (value === 'Open_phonebook') {
      setShowPhoneBookMenu(true);
    } else if (value === 'Enter_details') {
      navigation.navigate(ScreenNameEnum.CREATE_LEAD_SCREEN);
    } else if (value === 'Import_file') {
      navigation.navigate(ScreenNameEnum.UPLOAD_EXCEL_FILE_SCREEN);
    } else if (value === 'call-logs') {
      dispatch(setCallLogs(true));
    }
  };
  const handleResetFilter = () => {
    setFilterApplied(false);
    const payload = {...leadPaginationMetadata};
    if (leadFilterMetadata.list) {
      payload.list = leadFilterMetadata.list;
    }
    dispatch(getLeads(payload));
  };
  return displayCallLogs ? (
    <CallLogsScreen />
  ) : (
    <TourGuideProvider {...{borderRadius: 0}}>
      <GScreen>
        <AppTourWrapper screen={ScreenNameEnum.LEAD_HOME_SCREEN} />
        <LeadHeader setFilterApplied={setFilterApplied} />

        <View style={styles.backgroundContainer}>
          <LeadsSectionList />
        </View>
        <View style={styles.bottomFixedBtn}>
          {isFilterApplied && (
            <HoverButton
              style={styles.hoverBtn}
              right
              type="refresh"
              onPress={handleResetFilter}
            />
          )}
          {!isFilterApplied && !bulkMetadata.bulkSelectionStatus ? (
            <HoverButton
              {...APP_TOUR.HOME_SCREEN.addLead}
              style={styles.hoverBtn}
              right
              tourEnabled
              onPress={() => {
                setShowAddMenu(true);
              }}
            />
          ) : null}
        </View>

        <ListModal
          display={showAddMenu}
          onModalClose={() => setShowAddMenu(!showAddMenu)}
          data={[
            {
              name: 'Enter details',
              value: 'Enter_details',
              icon: 'form-select',
            },
            // {
            //   name: 'Open phonebook',
            //   value: 'Open_phonebook',
            //   icon: 'card-account-phone-outline',
            // },
            {name: 'Import file', value: 'Import_file', icon: 'file-import'},
            {
              name: 'Add from call logs',
              value: 'call-logs',
              icon: 'phone-log',
            },
          ]}
          onItemSelect={handleMenuSelect}
          title={'Create New Lead'}
        />
        <PhoneBook
          isVisible={showPhoneBookMenu}
          onModalHide={setShowPhoneBookMenu}
        />
      </GScreen>
    </TourGuideProvider>
  );
};

export default LeadHomeScreen;
const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
  },
  hoverBtn: {
    opacity: 1,
    position: 'relative',
    marginBottom: 10,
  },
  bottomFixedBtn: {
    position: 'absolute',
    zIndex: 999,
    right: 0,
    ...Platform.select({
      ios: {bottom: 45},
      android: {bottom: 25},
    }),
  },
});
