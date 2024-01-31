/* Libraries */
import React, {useState, useEffect} from 'react';
import {
  View,
  Platform,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import Helper from '../../../utils/helper';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/app.store';

const activityTypes: any = {
  checkin: 'Checkins',
  email: 'Email',
  label_update: 'Label Update',
  meeting: 'Meeting',
  message: 'Message',
  share: 'Share',
  status_update: 'Status Update',
  task_assign_update: 'Task Assign',
  task_create: 'Task Create',
  note_create: 'Note Create',
  task_delete: 'Task Delete',
  task_due_date_update: 'Task updated',
  task_is_complete_update: 'Task Completed',
  transfer_lead: 'Lead Assign',
  delete_lead: 'Lead Delete',
};
const activity_types: Array<string> = [
  'checkin',
  'email',
  'label_update',
  'meeting',
  'message',
  'share',
  'status_update',
  'task_assign_update',
  'task_create',
  'task_delete',
  'task_due_date_update',
  'task_is_complete_update',
  'transfer_lead',
  'delete_lead',
];
const ActivityCountSection = () => {
  const activities = useSelector(
    (state: RootState) => state.dashboard.activities.activityTypes,
  );

  const hasCount = activities.map((item: any) => item.type);
  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.callBlockContainer}
      showsHorizontalScrollIndicator={false}>
      {activities.map((item: {count: number; type: string}, index: number) => (
        <Pressable
          style={[styles.smallBlock, styles.shadowLow]}
          key={`types_2${index}`}>
          <View style={styles.blockInner}>
            <Text style={[styles.smHeader, styles.textColor]}>
              {activityTypes[item.type]
                ? activityTypes[item.type]
                : item.type.replace(/_/g, ' ')}
            </Text>
          </View>
          <Text style={[styles.smCount, styles.textColor]}>
            {Helper.kFormatter(item?.count)}
          </Text>
        </Pressable>
      ))}
      {activity_types.map((item, index) =>
        !hasCount.includes(item) ? (
          <Pressable
            style={[styles.smallBlock, styles.shadowLow]}
            key={`types_${index}`}>
            <View style={styles.blockInner}>
              <Text style={[styles.smHeader, styles.textColor]}>
                {activityTypes[item]}
              </Text>
            </View>
            <Text style={[styles.smCount, styles.textColor]}>0</Text>
          </Pressable>
        ) : null,
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  shadowLow: {
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  invertColor: {
    color: 'white',
  },
  block: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '44%',
    marginBottom: 20,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  activeBlock: {
    backgroundColor: R.colors.themeCol2,
  },
  callBlockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingLeft: 20,
  },
  smallBlock: {
    marginHorizontal: 5,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  smHeader: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.SEMI_BOLD),
    textTransform: 'capitalize',
  },
  smCount: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.EXTRA_BOLD),
  },
  blockInner: {
    flexDirection: 'row',
  },
  textColor: {
    color: R.colors.black,
  },
  noDataText: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
});
export default ActivityCountSection;
