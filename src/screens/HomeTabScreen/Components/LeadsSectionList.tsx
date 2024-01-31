/* eslint-disable react-hooks/exhaustive-deps */
import {
  Text,
  SectionList,
  RefreshControl,
  Platform,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import LeadItem from './LeadItem';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToBulkSelection,
  bulkSelectAll,
  getFilterLeads,
  getLeads,
  getSectionLeads,
  resetBulkSelection,
  selectBulkMetadata,
  selectLeadIds,
} from '../../../store/slices/lead.slice';
import {RootDispatch, RootState} from '../../../store/app.store';
import R from 'resources/R';
import {
  LeadListEnum,
  ThunkStatusEnum,
} from '../../../models/common/thunkStatus.enum';
import Feather from 'react-native-vector-icons/Feather';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';

import {EntityId} from 'datalib/entity/entity';
import BulkSelectionOptions from 'library/common/BulkSelectionOptions';
import BulkLeadActions from './BulkLeadActions';
import NoData from 'library/common/NoData';
import {BulkSelectionMetadata} from 'datalib/entity/lead';
import {FooterLoader} from 'library/common/GFlatList';
interface LeadListItem {
  item: EntityId;
  index: number;
}
const LeadsSectionList = () => {
  const dispatch = useDispatch<RootDispatch>();
  const bulkMetadata: BulkSelectionMetadata = useSelector(selectBulkMetadata);
  const listRef = useRef<any>();
  const [scrollTopBtn, setScrollTopBtn] = useState(false);
  const sectionLeads: Array<any> = useSelector(getSectionLeads);
  const allleadIds: Array<EntityId> = useSelector(selectLeadIds);
  const {
    totalLeads,
    leadFilterMetadata,
    leadListType,
    findLeadsStatus,
    filterLeadsStatus,
    leadPaginationMetadata,
  } = useSelector((state: RootState) => state.lead);

  const goToTop = () => {
    listRef?.current?.scrollToLocation({itemIndex: 0, sectionIndex: 0});
  };

  const renderItem = ({item, index}: LeadListItem) => {
    return <LeadItem key={`${item}-${index}`} leadId={item} />;
  };
  useEffect(() => {
    handleRefreshLeads();
  }, []);
  function handleBulkSelection(type: string | number) {
    let indexes: Array<any> = [];
    if (typeof type === 'number') {
      // indexes = [...bulkMetadata.leadIds];
      const lastId = bulkMetadata.leadIds
        ? bulkMetadata.leadIds[bulkMetadata.leadIds.length - 1]
        : null;
      const lastIndex = lastId ? allleadIds.indexOf(lastId) : 0;
      for (let _i = 0; _i < type; _i++) {
        const searchIndex = _i + (lastIndex >= 0 ? lastIndex : 0);
        if (
          searchIndex < allleadIds.length &&
          !bulkMetadata.leadIds.includes(allleadIds[searchIndex].toString())
        ) {
          indexes.push(allleadIds[searchIndex]);
        }
      }
    } else if (type === 'unselect') {
      dispatch(resetBulkSelection());
      indexes = [];
    } else if (type === 'all') {
      dispatch(bulkSelectAll(true));
      indexes = allleadIds.map(_i => _i);
    }
    if (indexes.length) {
      dispatch(addToBulkSelection(indexes));
    }
  }
  const handleRefreshLeads = (page = 1) => {
    if (leadListType === LeadListEnum.ALL_LEADS) {
      const payload = {...leadPaginationMetadata};
      if (leadFilterMetadata.list) {
        payload.list = leadFilterMetadata.list;
      }
      payload.page = page;
      dispatch(getLeads(payload));
    } else {
      const filterMetadaa = {...leadFilterMetadata};
      filterMetadaa.paginationParams.page = page;
      dispatch(getFilterLeads(leadFilterMetadata));
    }
  };
  const handleEndReached = ({distanceFromEnd}: any) => {
    if (
      distanceFromEnd > 0 &&
      findLeadsStatus.status !== ThunkStatusEnum.LOADING
    ) {
      const page =
        leadListType === LeadListEnum.ALL_LEADS
          ? leadPaginationMetadata.page || 1
          : leadFilterMetadata.paginationParams.page;

      const maxPages = Math.ceil(totalLeads / 50);
      if (maxPages >= page + 1) {
        handleRefreshLeads(page + 1);
      }
    }
  };
  return (
    <>
      {bulkMetadata.bulkSelectionStatus ? (
        <View style={styles.bulkSelectionContainer}>
          <BulkSelectionOptions
            handleBulkSelection={handleBulkSelection}
            selectedCounts={
              bulkMetadata.selectAllStatus
                ? totalLeads
                : bulkMetadata.leadIds.length
            }
          />
        </View>
      ) : null}
      <SectionList
        ref={listRef}
        sections={sectionLeads}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
        ListEmptyComponent={() => (
          <NoData
            loading={false}
            heading={
              sectionLeads && leadListType === LeadListEnum.ALL_LEADS
                ? findLeadsStatus.status === ThunkStatusEnum.LOADING ||
                  filterLeadsStatus.status === ThunkStatusEnum.LOADING
                  ? 'Loading leads'
                  : 'Add your first lead'
                : 'no result found!'
            }
            subheading={
              leadFilterMetadata.list
                ? "You can use custom list to mange your leads and contacts easily. You can add new contacts by tapping '+' button"
                : "'This is your lead’s home. You can view your Facebook, Google, Imported leads here. Tap on the “Phonebook” icon to add your first lead. You can import leads from Settings > Manage integration menu.'"
            }
            backgroundColor={R.colors.bgCol}
          />
        )}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        stickyHeaderIndices={[0]}
        onScroll={event => {
          const currentOffset = event.nativeEvent.contentOffset.y;
          setScrollTopBtn(currentOffset > 500);
        }}
        refreshControl={
          <RefreshControl
            refreshing={
              filterLeadsStatus.status === ThunkStatusEnum.LOADING ||
              findLeadsStatus.status === ThunkStatusEnum.LOADING
            }
            onRefresh={handleRefreshLeads}
            title="Pull down to refresh"
            tintColor={R.colors.white}
            titleColor={R.colors.white}
            colors={['red', 'green', 'blue']}
          />
        }
        ListFooterComponent={() => <FooterLoader isVisible={false} />}
      />
      {scrollTopBtn ? (
        <View style={styles.backToTopContainer}>
          <TouchableOpacity style={styles.backToTopBtn} onPress={goToTop}>
            <View style={styles.btnStyle}>
              <Feather name={'arrow-up'} size={20} color={'white'} />
              <Text style={styles.btnText}>Back to top</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
      <BulkLeadActions />
    </>
  );
};

export default LeadsSectionList;
const styles = StyleSheet.create({
  backToTopContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {bottom: 45},
      android: {bottom: 25},
    }),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 40,
  },
  backToTopBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: R.colors.themeCol2,
    zIndex: 99,

    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 35,
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
  header: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.labelCol1,
    marginHorizontal: 20,
    marginBottom: 5,
  },
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {fontFamily: R.fonts.medium, color: 'white'},
  bulkSelectionContainer: {
    paddingHorizontal: 20,
  },
});
