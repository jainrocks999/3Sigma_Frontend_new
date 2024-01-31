/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Linking,
  TextInput,
  Platform,
  SafeAreaView,
} from 'react-native';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import Header from '../../../library/common/Header';
import styles from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {
  getFilterLeads,
  selectFilterMetaData,
  showAutoDialer,
} from '../../../store/slices/lead.slice';
import LeadListModal from 'library/modals/LeadListModal';
import GAlert from 'library/common/GAlert';
import LeadFilterModal from 'library/modals/LeadFilterModal';
import {RootDispatch, RootState} from '../../../store/app.store';
import {
  FilterActionKeys,
  LeadFilterMetadata,
} from 'datalib/entity/paginatedResult';
import {selectListNameById} from '../../../store/slices/list.slice';
import GModal from 'library/wrapper/GModal';
import {Nillable} from '../../../models/custom.types';
import R from 'resources/R';
import {currentUserSelector} from '../../../store/slices/user.slice';
import {User} from 'datalib/entity/user';
import AutoDialer from 'library/common/AutoDialer';
import {TourGuideZone} from 'rn-tourguide';
import {APP_TOUR} from '../../../configs/constants';

const LeadHeader = ({
  setFilterApplied,
}: {
  setFilterApplied: (status: boolean) => void;
}) => {
  const dispatch = useDispatch<RootDispatch>();
  const {autoDialerStatus} = useSelector((state: RootState) => state.lead);
  const filterMetaData: LeadFilterMetadata = useSelector((state: RootState) =>
    selectFilterMetaData(state),
  );
  const listName: string = useSelector((state: RootState) =>
    selectListNameById(state, filterMetaData.list || -1),
  );
  const user: Nillable<User> = useSelector(currentUserSelector);

  let searchBar: MutableRefObject<null> = useRef(null);
  const [searchValueText, setSearchValueText] = useState(
    filterMetaData.search || '',
  );
  const [showSearchBar, setShowSerchBar] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  const totalLeads: number = useSelector(
    (state: RootState) => state.lead.totalLeads,
  );
  useEffect(() => {
    if (!filterMetaData.search) {
      setSearchValueText('');
    }
  }, [filterMetaData]);
  const openWhatsApp = () => {
    let msg = 'hi, i need help with 3 sigma CRM';
    let phoneWithCountryCode = '918814048362';

    let mobile =
      Platform.OS === 'ios' ? phoneWithCountryCode : '+' + phoneWithCountryCode;
    let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;

    Linking.canOpenURL(url)
      .then(() => Linking.openURL(url))
      .catch(_err => {
        GAlert('Make sure WhatsApp installed on your device');
      });
  };

  const leadSearch = (searchText: string = '') => {
    if (searchText) {
      let filterInfo = {
        ...filterMetaData,
      };
      if (searchText.length) {
        filterInfo.search = searchText;
      } else {
        delete filterInfo.search;
      }
      if (filterInfo.teamMembers || filterInfo.teams) {
      } else {
        filterInfo.teamMembers = [user?._id];
      }
      dispatch(getFilterLeads(filterInfo));
      setFilterApplied(true);
    }
  };
  const toggleSearchFilter = (
    action?: Nillable<FilterActionKeys> | undefined,
  ) => {
    let filterInfo = {
      ...filterMetaData,
    };
    if (action) {
      filterInfo.isNotAssign = false;
      filterInfo.isFollowUp = false;
      filterInfo.isNotCalled = false;
      filterInfo.isUntouched = false;
      filterInfo[action] = !filterInfo[action];
      setFilterApplied(true);
    } else {
      filterInfo.isNotAssign = false;
      filterInfo.isFollowUp = false;
      filterInfo.isNotCalled = false;
      filterInfo.isUntouched = false;
      delete filterInfo.search;

      setFilterApplied(false);
    }

    if (filterInfo.teamMembers || filterInfo.teams) {
    } else {
      filterInfo.teamMembers = [user?._id];
    }
    dispatch(getFilterLeads(filterInfo));
  };
  useEffect(() => {
    if (showSearchBar) {
      setTimeout(() => {
        if (searchBar && searchBar.current) {
          searchBar.current.focus();
          // searchBar.current.setNativeProps({
          //   selection: {
          //     start: searchValueText.length,
          //     end: searchValueText.length,
          //   },
          // });
        }
      }, 400);
    }
  }, [showSearchBar]);

  return (
    <>
      <Header
        moreHeight={true}
        left={
          <TourGuideZone
            zone={APP_TOUR.HOME_SCREEN.leadList.zone}
            text={APP_TOUR.HOME_SCREEN.leadList.text}
            style={styles.justifyContainer}
            borderRadius={10}>
            <TouchableOpacity
              onPress={() => {
                setShowListModal(true);
              }}
              style={styles.justifyContainer}>
              <View
                style={[styles.container, {justifyContent: 'space-between'}]}>
                <Text numberOfLines={1} style={styles.headerTitle}>
                  {listName}
                </Text>
                <Text numberOfLines={1} style={styles.headerTitleSub}>
                  ({totalLeads})
                  <MaterialCommunityIcons
                    name={'arrow-down-drop-circle'}
                    size={25}
                    color={R.colors.themeCol1}
                  />
                </Text>
              </View>
            </TouchableOpacity>
          </TourGuideZone>
        }
        right={
          <View style={styles.searchConatiner}>
            <TourGuideZone
              zone={APP_TOUR.HOME_SCREEN.search.zone}
              style={styles.HeaderTourIcon}
              text={APP_TOUR.HOME_SCREEN.search.text}
              borderRadius={10}>
              <Pressable
                onPress={() => {
                  setShowSerchBar(true);
                }}
                style={styles.HeaderIcon}>
                <Feather name={'search'} size={25} color={R.colors.themeCol1} />
              </Pressable>
            </TourGuideZone>
            <TourGuideZone
              zone={APP_TOUR.HOME_SCREEN.filter.zone}
              text={APP_TOUR.HOME_SCREEN.filter.text}
              style={styles.HeaderTourIcon}
              borderRadius={10}>
              <TouchableOpacity
                style={styles.HeaderIcon}
                onPress={() => setFilterModal(true)}>
                <Feather name={'filter'} size={25} color={R.colors.themeCol1} />
              </TouchableOpacity>
            </TourGuideZone>

            <TouchableOpacity style={styles.HeaderIcon} onPress={openWhatsApp}>
              <Icon name={'whatsapp'} size={25} color={R.colors.themeCol1} />
            </TouchableOpacity>
            {/* <TourGuideZone
              zone={APP_TOUR.HOME_SCREEN.autoDialer.zone}
              text={APP_TOUR.HOME_SCREEN.autoDialer.text}
              style={styles.HeaderTourIcon}
              borderRadius={10}>
              <TouchableOpacity
                style={styles.HeaderIcon}
                onPress={() => {
                  dispatch(showAutoDialer(!autoDialerStatus));
                }}>
                <MaterialCommunityIcons
                  name={'phone-refresh-outline'}
                  size={25}
                  color={R.colors.themeCol1}
                />
              </TouchableOpacity>
            </TourGuideZone> */}
          </View>
        }
      />
      {autoDialerStatus && <AutoDialer />}
      <LeadFilterModal
        isModal={filterModal}
        onModalClose={() => setFilterModal(!filterModal)}
        onFilterSelect={() => {
          setFilterApplied(true);
          setFilterModal(!filterModal);
        }}
      />
      <LeadListModal isVisible={showListModal} onModalHide={setShowListModal} />
      <GModal
        isVisible={showSearchBar}
        position={'top'}
        backdropColor={'transparent'}
        animationIn="slideInDown"
        animationOut={'slideOutUp'}
        onModalHide={() => setShowSerchBar(false)}>
        <SafeAreaView />
        <View style={styles.animatedsearch}>
          <View style={styles.searchContainer}>
            <Feather name={'search'} size={20} color={R.colors.themeCol1} />
            {showSearchBar && (
              <TextInput
                ref={searchBar}
                placeholder={'Search'}
                style={styles.searchTextInput}
                placeholderTextColor={'#999999'}
                value={searchValueText}
                onChangeText={text => {
                  setSearchValueText(text);
                }}
                onSubmitEditing={() => {
                  setShowSerchBar(false);
                  leadSearch(searchValueText);
                }}
              />
            )}
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              onPress={() => {
                setSearchValueText('');
                toggleSearchFilter();
              }}>
              <MaterialCommunityIcons
                name={'close-circle'}
                size={25}
                color={R.colors.themeCol1}
              />
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.rowContainer}>
              <TouchableOpacity
                onPress={() => toggleSearchFilter(FilterActionKeys.isNotAssign)}
                style={styles.searchItem}>
                <View
                  style={
                    filterMetaData.isNotAssign
                      ? styles.activeFilterBtn
                      : styles.filterBtn
                  }>
                  <View>
                    <MaterialCommunityIcons
                      name={'account-circle-outline'}
                      size={25}
                      color={filterMetaData.isNotAssign ? 'white' : 'black'}
                    />
                    <MaterialCommunityIcons
                      name={'minus'}
                      size={25}
                      color={'red'}
                      style={styles.rotateIcon}
                    />
                  </View>
                  <Text
                    style={
                      filterMetaData.isNotAssign
                        ? styles.activeBtnText
                        : styles.filterBtnText
                    }>
                    Unassigned
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleSearchFilter(FilterActionKeys.isFollowUp)}
                style={styles.searchItem}>
                <View
                  style={
                    filterMetaData.isFollowUp
                      ? styles.activeFilterBtn
                      : styles.filterBtn
                  }>
                  <View>
                    <MaterialCommunityIcons
                      name={'minus'}
                      size={25}
                      color={'red'}
                      style={styles.rotateIcon}
                    />
                    <MaterialCommunityIcons
                      name={'calendar-check'}
                      size={25}
                      color={filterMetaData.isFollowUp ? 'white' : 'black'}
                    />
                  </View>

                  <Text
                    style={
                      filterMetaData.isFollowUp
                        ? styles.activeBtnText
                        : styles.filterBtnText
                    }>
                    No followup task
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleSearchFilter(FilterActionKeys.isUntouched)}
                style={styles.searchItem}>
                <View
                  style={
                    filterMetaData.isUntouched
                      ? styles.activeFilterBtn
                      : styles.filterBtn
                  }>
                  <View>
                    <MaterialCommunityIcons
                      name={'clipboard-text-outline'}
                      size={25}
                      color={filterMetaData.isUntouched ? 'white' : 'black'}
                    />
                    <MaterialCommunityIcons
                      name={'minus'}
                      size={25}
                      color={'red'}
                      style={styles.rotateIcon}
                    />
                  </View>
                  <Text
                    style={
                      filterMetaData.isUntouched
                        ? styles.activeBtnText
                        : styles.filterBtnText
                    }>
                    Untouched
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleSearchFilter(FilterActionKeys.isNotCalled)}
                style={styles.searchItem}>
                <View
                  style={
                    filterMetaData.isNotCalled
                      ? styles.activeFilterBtn
                      : styles.filterBtn
                  }>
                  <View>
                    <MaterialCommunityIcons
                      name={'phone'}
                      size={25}
                      color={filterMetaData.isNotCalled ? 'white' : 'black'}
                    />
                    <MaterialCommunityIcons
                      name={'minus'}
                      size={25}
                      color={'red'}
                      style={styles.rotateIconY}
                    />
                  </View>
                  <Text
                    style={
                      filterMetaData.isNotCalled
                        ? styles.activeBtnText
                        : styles.filterBtnText
                    }>
                    No call
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </GModal>
    </>
  );
};

export default LeadHeader;
