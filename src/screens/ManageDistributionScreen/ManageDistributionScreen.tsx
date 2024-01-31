/* eslint-disable react-hooks/exhaustive-deps */
import BackButton from 'library/common/BackButton';
import GTopTabViewer from 'library/common/GTopTabViewer';
import GScreen from 'library/wrapper/GScreen';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import R from 'resources/R';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {RootState} from '../../store/app.store';
import RoundRobin from './SubScreen/RoundRobin';
import RuleList from './SubScreen/RuleList';
import SubscriptionTrialModal from 'library/modals/SubscriptionTrialModal';
import {selectSubcriptionStatus} from '../../store/slices/user.slice';

export default function ManageDistributionScreen() {
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const [isSubscriptionModal, setSubscriptionModal] = useState<boolean>(false);

  const {
    updateDistributionConfigStatus,
    updateDistributionRuleStatus,
    fetchDistributionRuleStatus,
    fetchDistributionConfig,
  } = useSelector((state: RootState) => state.list);
  const routes = [
    {
      name: 'round_robin',
      label: 'Lead Distribution',
      component: RoundRobin,
    },
    {
      name: 'rules',
      label: 'Rules',
      component: RuleList,
    },
  ];
  useEffect(() => {
    if (!isSubscribed) {
      setSubscriptionModal(true);
    }
  }, []);
  return (
    <GScreen
      loading={
        updateDistributionConfigStatus.status === ThunkStatusEnum.LOADING ||
        updateDistributionRuleStatus.status === ThunkStatusEnum.LOADING ||
        fetchDistributionRuleStatus.status === ThunkStatusEnum.LOADING ||
        fetchDistributionConfig.status === ThunkStatusEnum.LOADING
      }>
      <View style={styles.container}>
        <View style={styles.backBtnContainer}>
          <BackButton title="Manage Distribution" />
        </View>
        <GTopTabViewer routes={routes} initialRouteName={'round_robin'} />
      </View>
      {isSubscriptionModal && (
        <SubscriptionTrialModal
          screenTitle={'Lead distribution'}
          isVisible={isSubscriptionModal}
          onModalHide={setSubscriptionModal}
        />
      )}
    </GScreen>
  );
}
const styles = StyleSheet.create({
  container: {backgroundColor: R.colors.bgCol, flex: 1},
  backBtnContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
