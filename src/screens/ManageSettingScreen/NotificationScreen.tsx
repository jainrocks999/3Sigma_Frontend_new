import BackButton from 'library/common/BackButton';
import GAlert, {MessageType} from 'library/common/GAlert';
import GSwitch from 'library/common/GSwitch';
import GScreen from 'library/wrapper/GScreen';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  selectPrefrence,
  updateUserPrefrence,
} from '../../store/slices/user.slice';

const NotificationScreen = () => {
  const dispatch = useDispatch<RootDispatch>();
  const actNoti: boolean = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.ACTIVITY_NOTIFICATION_FLAG),
  );
  const leadNoti: boolean = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.NEWLEAD_NOTIFICATION_FLAG),
  );
  const recentActNoti: boolean = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.RECENT_NOTIFICATION_FLAG),
  );
  const [activityNotification, setActivityNotification] =
    useState<boolean>(actNoti);
  const [newLeadNotification, setNewLeadNotification] =
    useState<boolean>(leadNoti);
  const [recentActivityNotification, setRecentActivityNotification] =
    useState<boolean>(recentActNoti);

  const handleUpdatePref = async (key: string, value: boolean) => {
    const response = await dispatch(
      updateUserPrefrence({key: key, value: value}),
    );
    if (response.meta.requestStatus === 'fulfilled') {
      GAlert('Update Success', MessageType.SUCCESS);
    }
  };
  return (
    <GScreen loading={false}>
      <View style={styles.contianer}>
        <BackButton title="Manage Notification" />
        <Text style={styles.tagline}>
          Manage your leads and activity notification
        </Text>

        <View style={styles.settingContainer}>
          <Text style={styles.headingText}>
            Instant real time alerts whenever a new lead is received
          </Text>
          <View style={styles.itemContaienr}>
            <Text style={styles.itemText}>New Leads Notification</Text>
            <GSwitch
              isEnabled={newLeadNotification}
              toggleSwitch={() => {
                handleUpdatePref('newLeadNotification', !newLeadNotification);
                setNewLeadNotification(!newLeadNotification);
              }}
            />
          </View>
          <Text style={styles.headingText}>
            Immediate alert every time a client opens one of my files or pages
          </Text>
          <View style={styles.itemContaienr}>
            <Text style={styles.itemText}>Activity Notification</Text>
            <GSwitch
              isEnabled={activityNotification}
              toggleSwitch={() => {
                handleUpdatePref('activityNotification', !activityNotification);
                setActivityNotification(!activityNotification);
              }}
            />
          </View>
          <Text style={styles.headingText}>
            Daily summary of all clients that opened my link in past 24 hours
          </Text>
          <View style={styles.itemContaienr}>
            <Text style={styles.itemText}>Recent Activity Notification</Text>
            <GSwitch
              isEnabled={recentActivityNotification}
              toggleSwitch={() => {
                handleUpdatePref(
                  'recentActivityNotification',
                  !recentActivityNotification,
                );
                setRecentActivityNotification(!recentActivityNotification);
              }}
            />
          </View>
        </View>
      </View>
    </GScreen>
  );
};
export default NotificationScreen;
const styles = StyleSheet.create({
  tagline: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    marginTop: 10,
  },
  itemText: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
  },
  headingText: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    width: '80%',
    marginBottom: 5,
  },
  contianer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: R.colors.bgCol,
    height: '100%',
  },
  itemContaienr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: R.colors.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
  },
  settingContainer: {
    marginTop: 20,
    borderRadius: 10,
  },
});
