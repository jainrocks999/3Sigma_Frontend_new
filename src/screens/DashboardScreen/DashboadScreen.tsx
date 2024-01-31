/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {moderateScale} from 'resources/responsiveLayout';
import LeadCalculateWithTrends from './Components/LeadCalculateWithTrends';
import LeadChart from './Components/LeadChart';
import HeadingLebel from './Components/HeadingLebel';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectSubcriptionStatus,
  selectUserById,
  seletTeamById,
} from '../../store/slices/user.slice';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  getActivityCounts,
  getAllLeadCounts,
  getBySaleValue,
  initialFilterParams,
  toggleFilterStatus,
} from '../../store/slices/dashboard.slice';
import R from 'resources/R';
import ActivityCountSection from './Components/ActivityCountSection';
import CallsCountSection from './Components/CallsCountSection';
import GScreen from 'library/wrapper/GScreen';
import LeadBySource from './Components/LeadBySource';
import LeadFunnel from './Components/LeadsFunnel';
import LeadByLabels from './Components/LeadByLabels';
import CheckInLocation from './Components/CheckInLocation';
import {PaginationMetadata} from 'datalib/entity/paginatedResult';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import SubscriptionTrialModal from 'library/modals/SubscriptionTrialModal';
import LeadData from './Components/LeadData';
import Helper from '../../utils/helper';
import FilterModal from './Components/FilterModal';
import {IconButton} from 'library/common/ButtonGroup';
import {DashboardFilterParams} from 'datalib/entity/dashBoard';
import HoverButton from 'library/buttons/HoverButton';
import {Team, TeamMember} from 'datalib/entity/team';
import {Nillable} from '../../models/custom.types';
import {User} from 'datalib/entity/user';

enum SummeryTabEnum {
  LEADS = 'lead',
  TASK = 'task',
  ACTIVITY = 'activity',
  CALL = 'call',
  SALE = 'sales',
}
const DashboadScreen = (props: any) => {
  const dispatch = useDispatch<RootDispatch>();
  const childRef = useRef();

  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setCountTab] = useState(SummeryTabEnum.LEADS);

  const {
    activities,
    leads,
    totalSaleValue,
    paramsMetadata,
    fetchLeadsStatus,
    isFilterApplied,
  } = useSelector((state: RootState) => state.dashboard);
  const user: Nillable<TeamMember | User> = useSelector((state: RootState) =>
    selectUserById(state, paramsMetadata.userId),
  );
  const team: Nillable<Team> = useSelector((state: RootState) =>
    seletTeamById(state, (paramsMetadata?.teams || '') as string),
  );
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const [subscriptionStatus, setSubscriptionStatus] = useState(!isSubscribed);

  useEffect(() => {
    if (
      props.navigation.isFocused() &&
      fetchLeadsStatus.status === ThunkStatusEnum.IDLE &&
      isSubscribed
    ) {
      const params = {...paramsMetadata};
      if (isSubscribed) {
        dispatch(getActivityCounts(params));
        dispatch(getAllLeadCounts(params));
        dispatch(getBySaleValue(params));
      }
    }
  }, []);

  useEffect(() => {
    setSubscriptionStatus(!isSubscribed);
  }, [props.navigation.isFocused(), isSubscribed]);
  const fetchLeadCount = async (params: PaginationMetadata<number>) => {
    setRefreshing(true);
    dispatch(getActivityCounts(params));
    await dispatch(getAllLeadCounts(params));
    dispatch(getBySaleValue(params));
    setRefreshing(false);
  };

  const onRefresh = () => {
    if (isSubscribed) {
      const params = {...paramsMetadata};
      fetchLeadCount(params);
    } else {
      setSubscriptionStatus(true);
    }
  };
  const totalCalls = activities.callingCount.reduce(function (
    sum: number,
    item: any,
  ) {
    return sum + item.count;
  },
  0);
  const handleFilterSubmit = (filterParams: DashboardFilterParams) => {
    const params = {...paramsMetadata};
    if (filterParams.userId) {
      params.userId = filterParams.userId;
    } else {
      delete params.userId;
    }
    if (filterParams.teams && filterParams.teams !== 'organisation') {
      params.teams = filterParams.teams;
      delete params.isOrganization;
    } else if (filterParams.teams === 'organisation') {
      params.isOrganization = true;
      delete params.teams;
    } else {
      delete params.isOrganization;
      delete params.teams;
    }
    params.fromDate = filterParams.fromDate;
    params.toDate = filterParams.toDate;
    fetchLeadCount(params);
    dispatch(toggleFilterStatus(true));
  };
  const handleResetPress = () => {
    dispatch(toggleFilterStatus(false));
    const params = {...initialFilterParams};
    fetchLeadCount(params);
    let currentRef: any = childRef?.current;
    if (currentRef) {
      currentRef.onReset();
    }
    // childRef?.current?.onReset();
  };
  let nameText: any = 'My Stats';
  if (team && paramsMetadata.teams && !paramsMetadata.userId) {
    nameText = team.name;
  } else if (paramsMetadata.userId) {
    nameText = `${user?.firstName} ${user?.lastName || ''}`;
  }
  return (
    <GScreen>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Dashboard</Text>
            <View style={styles.titleWrapper}>
              <Text style={styles.filterText}>{nameText}</Text>
              <IconButton
                icon={'filter'}
                iconSize={25}
                btnStyle={{}}
                onPress={() => setFilterModal(true)}
              />
            </View>
          </View>
        </View>
        <ScrollView
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={
                fetchLeadsStatus.status === ThunkStatusEnum.LOADING ||
                refreshing
              }
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }>
          <View style={styles.leadBoxWrapper}>
            <View style={[styles.leadBox, {marginBottom: 20}]}>
              <LeadCalculateWithTrends
                boxTitle={'Total Leads'}
                numberText={leads || 0}
                selected={activeTab === SummeryTabEnum.LEADS}
                onPress={setCountTab}
                tabName={SummeryTabEnum.LEADS}
              />
              <LeadCalculateWithTrends
                boxTitle={'Total Calls'}
                numberText={totalCalls || 0}
                selected={activeTab === SummeryTabEnum.CALL}
                onPress={setCountTab}
                tabName={SummeryTabEnum.CALL}
              />
            </View>
            <View style={styles.leadBox}>
              <LeadCalculateWithTrends
                boxTitle={'Total Activities'}
                numberText={activities.totalActivity || 0}
                selected={activeTab === SummeryTabEnum.ACTIVITY}
                onPress={setCountTab}
                tabName={SummeryTabEnum.ACTIVITY}
              />
              <LeadCalculateWithTrends
                boxTitle={'Sales'}
                numberText={totalSaleValue || 0}
                selected={activeTab === SummeryTabEnum.SALE}
                onPress={setCountTab}
                tabName={SummeryTabEnum.SALE}
              />
            </View>
          </View>
          {activeTab === SummeryTabEnum.ACTIVITY ? (
            <ActivityCountSection />
          ) : null}
          {activeTab === SummeryTabEnum.CALL ? <CallsCountSection /> : null}
          {activeTab === SummeryTabEnum.SALE ? (
            <View style={styles.saleBlock}>
              <LeadData
                title={'Total Sales'}
                count={Helper.currencyFormate(totalSaleValue || 0)}
                suffix={'INR'}
              />
            </View>
          ) : null}
          <View>
            {activeTab !== SummeryTabEnum.SALE ? (
              <LeadChart tab={activeTab} refreshing={refreshing} />
            ) : null}
            <View style={styles.circleChartWrapper}>
              <HeadingLebel title={'Lead By Source'} />
              <LeadBySource refreshing={refreshing} />
            </View>
            <View style={styles.circleChartWrapper}>
              <HeadingLebel title={'Lead By Label'} />
              <LeadByLabels refreshing={refreshing} />
            </View>

            <View style={styles.circleChartWrapper}>
              <HeadingLebel title={'Leads Funnel'} />
              <LeadFunnel refreshing={refreshing} />
            </View>
            <View style={styles.circleChartWrapper}>
              <HeadingLebel title={'Checkins'} />
              <CheckInLocation refreshing={refreshing} />
            </View>
          </View>
        </ScrollView>
      </View>
      {subscriptionStatus && (
        <SubscriptionTrialModal
          screenTitle={'Dashboard'}
          isVisible={subscriptionStatus}
          onModalHide={setSubscriptionStatus}
        />
      )}
      <View style={styles.bottomFixedBtn}>
        {isFilterApplied ? (
          <HoverButton
            style={styles.hoverBtn}
            right
            type="refresh"
            onPress={handleResetPress}
          />
        ) : null}
      </View>

      <FilterModal
        ref={childRef}
        onSubmit={handleFilterSubmit}
        isVisible={filterModal}
        onModalClose={() => setFilterModal(false)}
      />
    </GScreen>
  );
};
export default DashboadScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
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
  headerWrapper: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  titleWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL3, FontWeightEnum.BOLD),
  },
  filterText: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    marginRight: 10,
    maxWidth: 140,
  },
  dropdownWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  leadBoxWrapper: {
    paddingHorizontal: moderateScale(20),
    backgroundColor: R.colors.white,
    paddingVertical: 20,
  },
  leadBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leadsInfoAndChartWrapper: {
    backgroundColor: R.colors.InputGrey3,
    alignItems: 'center',
    paddingTop: moderateScale(10),
  },
  horizontalScroll: {},
  leadItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleChartWrapper: {
    paddingHorizontal: moderateScale(20),
    marginBottom: 10,
  },
  saleBlock: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  hoverBtn: {
    opacity: 1,
    position: 'relative',
    marginBottom: 10,
  },
});
