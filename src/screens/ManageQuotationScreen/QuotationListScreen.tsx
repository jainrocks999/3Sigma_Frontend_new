/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  Platform,
  SectionList,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import QuotationItem from './QuotationItem';
import BackButton from 'library/common/BackButton';
import {moderateScale} from 'resources/responsiveLayout';
import {
  getCategories,
  getQuotations,
  getProducts,
  initialPaginationMetaData,
  getSectionQuotations,
} from '../../store/slices/quotation.slice';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import GScreen from 'library/wrapper/GScreen';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import R from 'resources/R';
import YouTubeLinkIcon from 'library/common/YouTubeLinkIcon';
import SearchModal from 'library/modals/SearchModal';
import HoverButton from 'library/buttons/HoverButton';
import NoData from 'library/common/NoData';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import ga from 'library/hooks/analytics';
const searchTags = [
  {
    name: 'Created',
    value: 'created',
    icon: '',
  },
  {
    name: 'Accepted',
    value: 'accepted',
    icon: '',
  },
];
const QuotationListScreen = (props: any) => {
  const navigation = useNavigation();

  const dispatch = useDispatch<RootDispatch>();
  const quotations = useSelector(getSectionQuotations);
  const {
    findQuotationsStatus,
    paginationMetadata,
    findProductsStatus,
    findCategoriesStatus,
    total,
  } = useSelector((state: RootState) => state.quotation);
  const [isSearchModal, setSearchModal] = useState<boolean>(false);
  const [isFilterApplied, setFilterApplied] = useState<boolean>(false);
  const [quotationFilter, setFilterValue] = useState<any>(paginationMetadata);
  useEffect(() => {
    if (props.navigation.isFocused()) {
      if (findQuotationsStatus.status === ThunkStatusEnum.IDLE) {
        dispatch(getQuotations(paginationMetadata));
      }
      if (findProductsStatus.status === ThunkStatusEnum.IDLE) {
        dispatch(getProducts(initialPaginationMetaData));
      }
      if (findCategoriesStatus.status === ThunkStatusEnum.IDLE) {
        dispatch(getCategories(initialPaginationMetaData));
      }
    }
  }, []);

  const onClickAdd = async () => {
    await ga.logEvent('Add_New_Quotation');
    navigation.navigate(ScreenNameEnum.CREATE_QUOTATION_SCREEN);
  };
  const handleRefreshQuotation = () => {
    dispatch(getQuotations(paginationMetadata));
  };
  const handleFilterReset = () => {
    setFilterValue(initialPaginationMetaData);
    dispatch(getQuotations(initialPaginationMetaData));
  };

  const handleSearchTextChange = (_search: string) => {
    const newFilter = {...quotationFilter};
    if (_search) {
      newFilter.search = _search;
    } else {
      delete newFilter.search;
    }
    setFilterApplied(true);
    setFilterValue(newFilter);
    dispatch(getQuotations(newFilter));
  };
  const handleTagSelect = (tag: string) => {
    const newFilter = {...quotationFilter};
    newFilter.status = tag;
    setFilterValue(newFilter);
  };
  return (
    <GScreen>
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <BackButton title={`Quotation ${total > 0 ? `(${total})` : ``}`} />
          <View style={styles.filterArea}>
            <YouTubeLinkIcon
              screenName={ScreenNameEnum.QUOTATION_LIST_SCREEN}
            />
            {/* <IconButton
              icon={'magnify'}
              iconSize={25}
              btnStyle={styles.btnStyle}
              onPress={() => setSearchModal(true)}
            /> */}
          </View>
        </View>
        <SectionList
          sections={quotations}
          renderItem={({item, index}) => {
            return <QuotationItem key={index} quitationId={item} />;
          }}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header}>{title}</Text>
          )}
          ListEmptyComponent={() => (
            <NoData
              loading={false}
              heading={
                findQuotationsStatus.status === ThunkStatusEnum.LOADING
                  ? 'Loading quotations'
                  : 'Add your first quotation'
              }
              subheading={'Create your first Quotation by pressing + button'}
              backgroundColor={R.colors.bgCol}
            />
          )}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl
              refreshing={
                findQuotationsStatus.status === ThunkStatusEnum.LOADING
              }
              onRefresh={handleRefreshQuotation}
              title="Pull down to refresh"
              tintColor={R.colors.white}
              titleColor={R.colors.white}
              colors={['red', 'green', 'blue']}
            />
          }
        />
        <View style={styles.bottomFixedBtn}>
          {isFilterApplied && (
            <HoverButton
              style={styles.hoverBtn}
              right
              type="refresh"
              onPress={handleFilterReset}
            />
          )}
          {!isFilterApplied ? (
            <HoverButton style={styles.hoverBtn} right onPress={onClickAdd} />
          ) : null}
        </View>
      </View>
      <SearchModal
        isVisible={isSearchModal}
        defaultText={quotationFilter?.search || ''}
        onModalClose={() => setSearchModal(false)}
        onSearch={handleSearchTextChange}
        searchTags={searchTags}
        onTagSelect={handleTagSelect}
        selectedTag={quotationFilter?.status}
      />
    </GScreen>
  );
};
export default QuotationListScreen;
const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 20,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  filterArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnStyle: {
    marginLeft: 10,
  },
  addButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: R.colors.black,
    position: 'absolute',
    bottom: moderateScale(25),
    right: moderateScale(13),
  },
  container: {
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
  header: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.labelCol1,
    marginHorizontal: 20,
    marginBottom: 5,
  },
});
