import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import LeadData from './LeadData';
import {RootState} from '../../../store/app.store';
import {useSelector} from 'react-redux';
import Helper from '../../../utils/helper';

const CallsCountSection = () => {
  const callDetails = useSelector(
    (state: RootState) => state.dashboard.activities.callingDetails,
  );
  const callingCount = useSelector(
    (state: RootState) => state.dashboard.activities.callingCount,
  );
  const totalCalls = callingCount.reduce(function (sum: number, item: any) {
    return sum + item.count;
  }, 0);
  const getByEvent = (type: any) => {
    const call = callingCount.find(_item => _item.type === type);
    if (call) {
      return call.count;
    } else {
      return 0;
    }
  };
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.callBlockContainer}>
      <LeadData title={'All'} count={totalCalls || 0} suffix={'Calls'} />

      <LeadData
        title={'Incoming'}
        count={getByEvent('incoming')}
        suffix={'Calls'}
      />
      <LeadData
        title={'Outgoing'}
        count={getByEvent('outgoing')}
        suffix={'Calls'}
      />
      <LeadData
        title={'Total Answered'}
        count={callDetails?.totalCallAnswered || 0}
        suffix={'Calls'}
      />
      <LeadData
        title={'Total Outgoing Talktime'}
        count={Helper.formateTime(callDetails?.totalOutgoingDuration || 0)}
        suffix={'min:sec'}
      />
      <LeadData
        title={'Total Incoming Talktime'}
        count={Helper.formateTime(callDetails?.totalIncomingDuration || 0)}
        suffix={'min:sec'}
      />
      <LeadData
        title={'Total Talktime'}
        count={Helper.formateTime(callDetails?.totalTalkTime || 0)}
        suffix={'min:sec'}
      />
      <LeadData
        title={'Average Talktime'}
        count={Helper.formateTime(callDetails?.averageTalkTime || 0)}
        suffix={'min:sec'}
      />
    </ScrollView>
  );
};
export default CallsCountSection;
const styles = StyleSheet.create({
  callBlockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingLeft: 20,
  },
});
