/* eslint-disable react-hooks/exhaustive-deps */
import GAlert from 'library/common/GAlert';
import GFlatList from 'library/common/GFlatList';
import Header from 'library/common/Header';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import GScreen from 'library/wrapper/GScreen';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Linking,
  Platform,
  Animated,
  Dimensions,
  RefreshControl,
  SectionList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  getAllCallLogs,
  getSectionLogs,
  initialCalllogPaginationMetaData,
  selectLogsById,
} from '../../store/slices/calllog.slice';
import ListModal from 'library/common/ListModal';
import {CALL_OPTION_ACTIONS} from '../../configs/constants';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {useNavigation} from '@react-navigation/native';
import FilterModal from './FilterModal';
import LeadListModal from 'library/modals/LeadListModal';
import Helper from '../../utils/helper';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {CallLog} from 'datalib/entity/callLog';
import moment from 'moment';

export default function CallLogsScreen() {
  const [searchText, setSearchText] = useState<string>('');
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [showListModal, setShowListModal] = useState(false);

  const [value] = useState(new Animated.Value(0));
  const [isOpen, setOpen] = useState(false);
  const dispatch = useDispatch<RootDispatch>();
  const {paginationMetadata, total, findCalllogStatus} = useSelector(
    (state: RootState) => state.calllog,
  );
  const logIds = useSelector(getSectionLogs);
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
  useEffect(() => {
    dispatch(getAllCallLogs(paginationMetadata));
  }, []);
  useEffect(() => {
    Animated.timing(value, {
      toValue: isOpen ? Dimensions.get('screen').width - 32 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);
  const handleSearchTextChange = (_search: string) => {
    setSearchText(_search);
  };
  const handleFilterSelect = filter => {};
  const handleEndReached = ({distanceFromEnd}: any) => {
    if (
      distanceFromEnd > 0 &&
      findCalllogStatus.status !== ThunkStatusEnum.LOADING
    ) {
      const page = paginationMetadata.page || 1;

      const maxPages = Math.ceil(total / 50);
      if (maxPages >= page + 1) {
        const metadata = {...paginationMetadata};
        metadata.page = page + 1;
        dispatch(getAllCallLogs(metadata));
      }
    }
  };
  const handleRefreshLeads = () => {
    dispatch(getAllCallLogs(initialCalllogPaginationMetaData));
  };
  return (
    <GScreen style={styles.screenStyle}>
      <Header
        left={
          <TouchableOpacity
            style={styles.justifyContainer}
            onPress={() => {
              setShowListModal(true);
            }}>
            <View style={[styles.container]}>
              <Text numberOfLines={1} style={styles.headerTitle}>
                Call Logs
              </Text>
              <Text numberOfLines={1} style={styles.headerTitleSub}>
                <MaterialCommunityIcons
                  name={'arrow-down-drop-circle'}
                  size={25}
                  color={R.colors.themeCol1}
                />
              </Text>
            </View>
          </TouchableOpacity>
        }
        right={
          <View style={styles.searchConatiner}>
            {/* <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => setFilterModal(true)}>
              <Feather name={'filter'} size={25} color={R.colors.themeCol1} />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.headerIcon} onPress={openWhatsApp}>
              <Icon name={'whatsapp'} size={25} color={R.colors.themeCol1} />
            </TouchableOpacity>
            {/* <Animated.View
              style={[
                {
                  width: value,
                  ...styles.animatedStyle,
                },
              ]}>
              <View style={styles.searchContainer}>
                <SectionedTextInput
                  placeholder={'Search'}
                  defaultValue={`${searchText || ''}`}
                  onChangeText={handleSearchTextChange}
                />
              </View>
            </Animated.View>
            <TouchableOpacity
              style={isOpen ? styles.closeIcon : styles.headerIcon}
              onPress={() => setOpen(!isOpen)}>
              {!isOpen ? (
                <Feather name={'search'} size={25} color={R.colors.themeCol1} />
              ) : (
                <MaterialCommunityIcons
                  name={'close'}
                  size={25}
                  color={R.colors.themeCol1}
                />
              )}
            </TouchableOpacity> */}
          </View>
        }
      />
      <SectionList
        sections={logIds}
        renderItem={({item, index}) => (
          <CallLgItem logId={item} key={index.toString()} />
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl
            refreshing={findCalllogStatus.status === ThunkStatusEnum.LOADING}
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
const CallLgItem = ({logId}) => {
  const navigation = useNavigation();
  const logItem: CallLog = useSelector((state: RootState) =>
    selectLogsById(state, logId || ''),
  );
  const phoneNumber = logItem?.phone || '';
  const [openOptions, setOptionModal] = useState<boolean>(false);
  const handleOptionSelect = (action: string) => {
    setOptionModal(false);
    switch (action) {
      case 'call':
        Linking.canOpenURL(`tel:${phoneNumber}`)
          .then(supported => {
            if (!supported) {
              GAlert('Unable to open default call app');
            } else {
              Linking.openURL(`tel:${phoneNumber}`);
            }
          })
          .catch(_err => {
            GAlert('Unable to open default call app');
          });
        break;
      case 'whatsapp':
        if (phoneNumber.length > 9) {
          let phone =
            phoneNumber.length > 10 ? phoneNumber : `+91${phoneNumber}`;
          Linking.canOpenURL(`whatsapp://send?phone=${phone}`)
            .then(supported => {
              if (!supported) {
                GAlert('Make sure whatsapp is installed and then try');
              } else {
                let nphone =
                  phoneNumber.length > 10 ? phoneNumber : `+91${phoneNumber}`;
                Linking.openURL(`whatsapp://send?phone=${nphone}`);
              }
            })
            .catch(err => {
              console.log(err);
              GAlert('Unable to open whatsapp');
            });
        }
        break;
      case 'message':
        Linking.canOpenURL(`sms:${phoneNumber}`)
          .then(supported => {
            if (!supported) {
              GAlert('Unable to open default message app');
            } else {
              Linking.openURL(`sms:${phoneNumber}`);
            }
          })
          .catch(err => {
            console.log(err);
            GAlert('Unable to open default message app');
          });
        break;
      case 'add-lead':
        navigation.navigate(ScreenNameEnum.CREATE_LEAD_SCREEN, {
          contactInfo: {phone: phoneNumber},
        });
        break;
      case 'lead-detail':
        navigation.navigate(ScreenNameEnum.LEAD_PROFILE_SCREEN, {
          id: logItem.lead._id,
        });
        break;
      case 'call-history':
        break;
    }
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'INCOMING':
        return {
          name: 'phone-incoming',
          background: '#0DA30A75',
          iconColor: '#0DA30A',
        };
      case 'OUTGOING':
        return {
          name: 'phone-incoming',
          background: '#1D6CE175',
          iconColor: R.colors.themeCol1,
        };
      case 'MISSED':
        return {
          name: 'phone-missed',
          background: '#CF3C45BD',
          iconColor: '#E11D1D',
        };
      default:
        return {
          name: 'phone-alert',
          background: '#CF3C45BD',
          iconColor: '#E11D1D',
        };
    }
  };

  return (
    <>
      <View style={styles.logItem}>
        <Pressable
          onPress={() => setOptionModal(true)}
          style={styles.logItemPressable}
          android_ripple={{color: '#ccc', borderless: false}}>
          <View style={styles.logItemInner}>
            <View style={styles.logItemLeft}>
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconView,
                    {backgroundColor: getCallIcon(logItem.type).background},
                  ]}>
                  <MaterialCommunityIcons
                    name={getCallIcon(logItem.type).name}
                    size={25}
                    color={getCallIcon(logItem.type).iconColor}
                  />
                </View>
              </View>
              <View style={styles.description}>
                {logItem.lead ? (
                  <Text style={styles.logName}>{logItem?.lead.name}</Text>
                ) : null}
                <Text
                  style={logItem.lead ? styles.mobileNumber : styles.logName}>
                  {logItem?.phone}
                </Text>

                <Text style={styles.callTimeText}>
                  {/* {Helper.formatAddedTime(logItem.startedAt)} */}
                  {`${moment(logItem?.startedAt).format('hh:mm a')}`}
                </Text>
              </View>
            </View>
            <View style={styles.logItemRight}>
              <Text style={styles.callDuration}>
                {Helper.formateTime(logItem?.duration || 0)}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
      <ListModal
        display={openOptions}
        onModalClose={() => setOptionModal(!openOptions)}
        data={
          logItem?.lead
            ? [
                ...CALL_OPTION_ACTIONS,
                {
                  name: 'Goto lead detail',
                  value: 'lead-detail',
                  icon: 'account-arrow-left',
                  iconcolor: '#000000',
                },
              ]
            : [
                ...CALL_OPTION_ACTIONS,
                {
                  name: 'Add as a lead',
                  value: 'add-lead',
                  icon: 'account-plus-outline',
                  iconcolor: '#000000',
                },
              ]
        }
        onItemSelect={handleOptionSelect}
        title={'Actions'}
      />
    </>
  );
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
    color: R.colors.labelCol1,
    marginHorizontal: 20,
    marginBottom: 5,
  },
});
