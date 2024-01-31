import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import R from 'resources/R';
import {useNavigation} from '@react-navigation/native';
import {Activity} from 'datalib/entity/activity';
import {activityFormat} from '../../../utils/formatter';
import ScreenNameEnum from '../../../models/routes/screenName.enum';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import Helper from '../../../utils/helper';
import moment from 'moment';

const ActivityItem = (activity: Activity) => {
  const navigation = useNavigation();
  const format = activityFormat(activity.type, activity.extraDetails);
  return (
    <View style={styles.activityConainer}>
      <Pressable
        android_ripple={R.darkTheme.grayRipple}
        onPress={() =>
          navigation.navigate(ScreenNameEnum.UPDATE_ACTIVITY_SCREEN, {
            ...activity,
          })
        }>
        <View style={styles.activityItemWrapper}>
          <View
            style={{
              backgroundColor: format?.ltCntColor,
              ...styles.iconWrapper,
            }}>
            {format?.ltCntIcon}
          </View>
          <View>
            <Text style={styles.activityTypeText} numberOfLines={5}>
              {activity?.label || format?.seenText}
            </Text>
            {activity?.notes ? (
              <Text numberOfLines={5} style={styles.activityNotesText}>
                {activity?.notes}
              </Text>
            ) : null}
            {activity?.note ? (
              <Text numberOfLines={5} style={styles.activityNotesText}>
                {activity?.note}
              </Text>
            ) : null}
            {activity.extraDetails && activity.extraDetails.duration ? (
              <Text style={styles.activityNotesText}>
                Duration :{' '}
                {Helper.formateTime(activity.extraDetails.duration || 0)}
              </Text>
            ) : null}
            <Text style={styles.detailText}>
              Created By : {activity?.createdBy}
            </Text>
            <View>
              {activity?.lead && (
                <Text style={styles.detailText}>
                  Lead Name : {activity?.lead?.name || ''}
                </Text>
              )}
              <Text style={styles.detailText}>
                {moment(activity?.performedAt).format('DD MMM YYYY HH:mm a')}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ActivityItem;
const styles = StyleSheet.create({
  activityConainer: {
    backgroundColor: R.colors.activityBackground,
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(10),
    borderRadius: moderateScale(9),
  },
  activityItemWrapper: {
    padding: moderateScale(10),
    backgroundColor: R.colors.activityBackground,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(9),
  },
  activityTypeText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.themeCol1,
    maxWidth: '90%',
  },
  activityNotesText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.themeCol1,
    maxWidth: '90%',
  },
  detailText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.MEDIUM),
    color: R.colors.textCol1,
  },
  iconWrapper: {
    padding: moderateScale(8),
    borderRadius: moderateScale(7),
    marginRight: moderateScale(15),
  },
});
