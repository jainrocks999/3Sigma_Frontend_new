/* eslint-disable react-hooks/exhaustive-deps */
import {RefreshControl, View} from 'react-native';
import React, {useEffect} from 'react';
import {styles} from '../styles';
import ActivityItem from './ActivityItem';
import AddActivityButton from '../../../library/common/AddActivityButton';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../../models/routes/screenName.enum';
import GFlatList from 'library/common/GFlatList';
import {RootDispatch, RootState} from '../../../store/app.store';
import {Activity} from 'datalib/entity/activity';
import {
  initialActivityPaginationMetaData,
  getAllActivity,
  selectActivitiesByLead,
} from '../../../store/slices/activity.slice';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
import R from 'resources/R';
import ga from 'library/hooks/analytics';

const ActivityTimeLine = (props: any) => {
  const leadId: string = props.route.params?.leadId;
  const dispatch = useDispatch<RootDispatch>();
  const {updateLeadStatus} = useSelector((state: RootState) => state.lead);
  const {findActivitysStatus, updateActivitysStatus} = useSelector(
    (state: RootState) => state.activity,
  );
  const navigation = useNavigation();
  const activities: Array<Activity> = useSelector((state: RootState) =>
    selectActivitiesByLead(state, leadId),
  );
  useEffect(() => {
    if (
      (leadId && updateLeadStatus.status !== ThunkStatusEnum.IDLE) ||
      updateActivitysStatus.status === ThunkStatusEnum.LOADED
    ) {
      reloadActivities();
    }
  }, [updateLeadStatus, updateActivitysStatus]);
  const reloadActivities = () => {
    const params = {...initialActivityPaginationMetaData};
    params.leadId = leadId || '';
    dispatch(getAllActivity(params));
  };
  useEffect(() => {
    if (leadId) {
      console.log('On component load', updateLeadStatus);
      reloadActivities();
    }
  }, []);
  const renderItem = ({item, index}: any) => {
    return <ActivityItem key={index} {...item} />;
  };
  const handleOnRefresh = () => {
    const params = {...initialActivityPaginationMetaData};
    params.leadId = leadId || '';
    dispatch(getAllActivity(params));
  };
  return (
    <View style={styles.actiVityContainer}>
      <View>
        <AddActivityButton
          title={'Add an Activity'}
          onPress={async () => {
            await ga.logEvent('Add_New_Activity');
            navigation.navigate(ScreenNameEnum.CREATE_ACTIVITY_SCREEN, {
              leadIds: [leadId],
            });
          }}
        />
      </View>
      <GFlatList
        data={activities}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={findActivitysStatus.status === ThunkStatusEnum.LOADING}
            onRefresh={handleOnRefresh}
            title="Pull down to refresh"
            tintColor={R.colors.white}
            titleColor={R.colors.white}
            colors={['red', 'green', 'blue']}
          />
        }
      />
    </View>
  );
};

export default ActivityTimeLine;
