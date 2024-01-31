/* eslint-disable react-hooks/exhaustive-deps */
import Header from 'library/common/Header';
import GScreen from 'library/wrapper/GScreen';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SectionList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {RootDispatch, RootState} from '../../store/app.store';
import FilterModal from './FilterModal';
import LeadListModal from 'library/modals/LeadListModal';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import Feather from 'react-native-vector-icons/Feather';
import {
  getAllActivity,
  getSectionActivities,
  initialActivityPaginationMetaData,
  selectActivityById,
} from '../../store/slices/activity.slice';
import ActivityItem from '../LeadDetailsScreen/Component/ActivityItem';
import BackButton from 'library/common/BackButton';
import {Activity} from 'datalib/entity/activity';
import {Nillable} from '../../models/custom.types';
import YouTubeLinkIcon from 'library/common/YouTubeLinkIcon';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import NoData from 'library/common/NoData';

export default function ActivityScreen() {
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [showListModal, setShowListModal] = useState(false);

  const dispatch = useDispatch<RootDispatch>();
  const {paginationMetadata, total, findActivitysStatus} = useSelector(
    (state: RootState) => state.activity,
  );
  const logIds = useSelector(getSectionActivities);

  useEffect(() => {
    dispatch(getAllActivity(paginationMetadata));
  }, []);

  const handleFilterSelect = (_filter: any) => {
    console.log('_filterF', _filter);
    const queryPaylaod = {...paginationMetadata};
    if (_filter.fromDate) {
      queryPaylaod.startedAt = _filter.fromDate;
    } else {
      delete queryPaylaod.startedAt;
    }
    if (_filter.toDate) {
      queryPaylaod.endedAt = _filter.toDate;
    } else {
      delete queryPaylaod.endedAt;
    }
    if (_filter.teams) {
      if (_filter.teams === 'organisation') {
        queryPaylaod.byOrganization = true;
      } else {
        queryPaylaod.teams = [_filter.teams];
      }
    } else {
      delete queryPaylaod.teams;
    }
    if (_filter.userId) {
      queryPaylaod.userIds = [_filter.userId];
    } else {
      delete queryPaylaod.userIds;
    }
    if (_filter.type) {
      queryPaylaod.type = _filter.type;
    } else {
      delete queryPaylaod.type;
    }
    dispatch(getAllActivity(queryPaylaod));
  };
  const handleEndReached = ({distanceFromEnd}: any) => {
    if (
      distanceFromEnd > 0 &&
      findActivitysStatus.status !== ThunkStatusEnum.LOADING
    ) {
      const page = paginationMetadata.page || 1;

      const maxPages = Math.ceil(total / 50);
      if (maxPages >= page + 1) {
        const metadata = {...paginationMetadata};
        metadata.page = page + 1;
        dispatch(getAllActivity(metadata));
      }
    }
  };
  const handleRefreshLeads = () => {
    dispatch(getAllActivity(initialActivityPaginationMetaData));
  };
  return (
    <GScreen style={styles.screenStyle}>
      <Header
        left={<BackButton title={'Activities'} />}
        right={
          <View style={styles.searchConatiner}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => setFilterModal(true)}>
              <Feather name={'filter'} size={25} color={R.colors.themeCol1} />
            </TouchableOpacity>
            <YouTubeLinkIcon
              screenName={ScreenNameEnum.FOLLOW_UP_HOME_SCREEN}
            />
          </View>
        }
      />
      <SectionList
        sections={logIds}
        renderItem={({item, index}) => (
          <ActivityPureItem item={item.toString()} key={index.toString()} />
        )}
        ListEmptyComponent={() => (
          <NoData
            loading={false}
            heading={
              findActivitysStatus.status === ThunkStatusEnum.LOADING
                ? 'Loading Activity'
                : 'No Activity found'
            }
            subheading={''}
            backgroundColor={R.colors.bgCol}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <View>
            <Text style={styles.header}>{title}</Text>
          </View>
        )}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl
            refreshing={findActivitysStatus.status === ThunkStatusEnum.LOADING}
            onRefresh={handleRefreshLeads}
            title="Pull down to refresh"
            tintColor={R.colors.white}
            titleColor={R.colors.white}
            colors={['red', 'green', 'blue']}
          />
        }
      />
      <FilterModal
        onSubmit={handleFilterSelect}
        isVisible={filterModal}
        onModalClose={() => setFilterModal(false)}
      />
      <LeadListModal isVisible={showListModal} onModalHide={setShowListModal} />
    </GScreen>
  );
}
const ActivityPureItem = ({item}: {item: string}) => {
  const activity: Nillable<Activity> = useSelector((state: RootState) =>
    selectActivityById(state, item),
  );
  return activity ? <ActivityItem {...activity} /> : null;
};
const styles = StyleSheet.create({
  screenStyle: {
    backgroundColor: R.colors.bgCol,
  },
  justifyContainer: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleSub: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.BOLD),
  },
  headerTitle: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.BOLD),
  },
  searchConatiner: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  headerIcon: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: -5,
    borderWidth: 1,
    height: 40,
    width: 40,
    padding: 5,
  },
  closeIcon: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: -5,
    height: 40,
    width: 40,
    padding: 5,
  },
  animatedStyle: {
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'absolute',
    right: 10,
    top: -10,
  },
  searchContainer: {zIndex: 999},
  logItem: {
    backgroundColor: R.colors.white,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  logItemPressable: {},
  logItemInner: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logItemLeft: {
    flexDirection: 'row',
  },
  iconContainer: {
    justifyContent: 'center',
  },
  description: {
    marginLeft: 10,
  },
  logName: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.BOLD),
  },
  mobileNumber: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
  },
  callTimeText: {
    color: R.colors.gray,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
  },
  logItemRight: {
    justifyContent: 'center',
    marginRight: 10,
  },
  callDuration: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
  },
  iconView: {
    height: 40,
    width: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.white,
    marginHorizontal: 20,
    marginBottom: 5,
    backgroundColor: R.colors.themeCol2,
    textAlign: 'center',
    borderRadius: 10,
  },
});
