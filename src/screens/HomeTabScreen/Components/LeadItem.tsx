import React, {PureComponent, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Pressable,
  Vibration,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import GAlert from 'library/common/GAlert';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../../store/app.store';
import {
  addToBulkSelection,
  leadByIdSelector,
  removeFromBulkSelection,
  selectBulkMetadata,
} from '../../../store/slices/lead.slice';
import {BulkSelectionMetadata, Lead} from 'datalib/entity/lead';
import {userPrefrenceSelector} from '../../../store/slices/user.slice';
import {EntityId} from 'datalib/entity/entity';
import R from 'resources/R';
import {PrefrenceKeyEnum} from '../../../models/common/preference.keys.enum';
import {PrefrenceItem, PrefrenceObject} from 'datalib/entity/prefrence';
import {Nillable} from '../../../models/custom.types';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import Tag from 'library/common/Tag';
import {moderateScale} from 'resources/responsiveLayout';
import Helper from '../../../utils/helper';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../../models/routes/screenName.enum';

interface LeadItemProps {
  leadId: EntityId;
  onPress?: () => void;
  onLongPress?: () => void;
  backgroundColor?: string;
}

const LeadItem = (props: LeadItemProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const bulkMetadata: BulkSelectionMetadata = useSelector(selectBulkMetadata);

  const leadDetail: Lead | null = useSelector((state: RootState) =>
    leadByIdSelector(state, props.leadId || -1),
  );
  const prefrences: Nillable<PrefrenceObject> = useSelector(
    (state: RootState) => userPrefrenceSelector(state),
  );
  const callOption = () => {
    Linking.canOpenURL(`tel:${leadDetail?.phone}`)
      .then(supported => {
        if (!supported) {
          GAlert('Unable to open default call app');
        } else {
          Linking.openURL(`tel:${leadDetail?.phone}`);
        }
      })
      .catch(_err => {
        GAlert('Unable to open default call app');
      });
  };
  const getPrefItem = (item: string, key: PrefrenceKeyEnum) => {
    if (prefrences) {
      const prefArray = prefrences[key];
      if (prefArray && Array.isArray(prefArray) && prefArray.length) {
        let _data = prefArray.find((p: PrefrenceItem) => p.value === item);
        if (_data) {
          return _data;
        } else {
          return {name: item, color: R.colors.themeCol2};
        }
      } else {
        return {name: item, color: R.colors.themeCol2};
      }
    }
  };

  const setSourceName = (_leadDetail: any) => {
    if (_leadDetail) {
      if (
        'customSource' in _leadDetail &&
        _leadDetail.customSource &&
        _leadDetail.customSource !== null
      ) {
        const getName =
          getPrefItem(
            _leadDetail.customSource,
            PrefrenceKeyEnum.LEAD_CUSTOM_SOURCES,
          )?.name || '';
        return getName.replace('_', ' ');
      } else if (
        _leadDetail?.integration &&
        typeof _leadDetail?.integration === 'string'
      ) {
        return _leadDetail?.integration;
      } else if (
        _leadDetail?.integration &&
        typeof _leadDetail?.integration === 'object'
      ) {
        return _leadDetail?.integration.name;
      } else {
        return 'Unknown';
      }
    } else {
      return 'Unknown';
    }
  };
  const handleOnPress = () => {
    if (bulkMetadata.bulkSelectionStatus) {
      if (bulkMetadata.leadIds.includes(props.leadId?.toString())) {
        dispatch(removeFromBulkSelection(props.leadId?.toString()));
      } else {
        dispatch(addToBulkSelection(props.leadId?.toString()));
      }
    } else {
      navigation.navigate(ScreenNameEnum.LEAD_PROFILE_SCREEN, {
        id: props.leadId?.toString(),
      });
    }
  };
  const onLongPress = () => {
    Vibration.vibrate();
    if (!bulkMetadata.leadIds.includes(props.leadId?.toString())) {
      dispatch(addToBulkSelection(props.leadId?.toString()));
    }
  };
  return (
    <View
      style={[
        styles.itemContainer,
        bulkMetadata.leadIds.includes(`${props.leadId}`)
          ? styles.selectedItem
          : {},
      ]}>
      <Pressable
        android_ripple={R.darkTheme.grayRipple}
        onPress={handleOnPress}
        delayLongPress={500}
        onLongPress={onLongPress}>
        <View style={[styles.leadListCardConatiner]}>
          {/* LEFT CONTENT */}
          <View style={styles.leadListCardLeftConatiner}>
            <View style={styles.leftContent}>
              <View style={styles.container}>
                <Text numberOfLines={1} style={styles.leadNameText}>
                  {leadDetail?.name}
                </Text>
              </View>

              <View style={styles.leadOuter}>
                <Tag
                  tags={leadDetail?.status || []}
                  tagKey={PrefrenceKeyEnum.STATUS}
                />
                {leadDetail?.saleValue && leadDetail?.saleValue > 0 ? (
                  <View
                    style={StyleSheet.flatten([
                      styles.outerStatus,
                      {backgroundColor: R.colors.themeCol2},
                    ])}>
                    <Text numberOfLines={1} style={styles.leadListCardLabel}>
                      {`₹ ${Helper.currencyFormate(leadDetail?.saleValue)}`}
                    </Text>
                  </View>
                ) : null}
                <Tag
                  tags={leadDetail?.label || []}
                  tagKey={PrefrenceKeyEnum.LABELS}
                />
              </View>

              <Text style={styles.leadListCardTimeText}>
                {`Added via ${setSourceName(leadDetail)} at ${moment(
                  leadDetail?.createdAt,
                ).format('hh:mm a')}`}
              </Text>
            </View>
          </View>
          {/* RIGHT CONTENT */}
          <View style={styles.leadListCardRightConatiner}>
            <TouchableOpacity
              style={[
                styles.RightCircle,
                {backgroundColor: leadDetail?.phone ? '#e6e7ec' : 'whitesmoke'},
              ]}
              onPress={() => {
                callOption();
              }}>
              <MaterialCommunityIcons
                name={'phone-outline'}
                color={'#000'}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
class PureLeadItem extends PureComponent<{leadId: EntityId}, {}> {
  constructor(props: {leadId: EntityId}) {
    super(props);
  }

  // render(): React.ReactNode {
  //   console.log('render lead item');
  //   return (
  //     <View style={{borderWidth: 1, padding: 20, marginBottom: 10}}>
  //       <Text>{this.props.leadId}</Text>
  //     </View>
  //   );
  // }

  render(): React.ReactNode {
    return <LeadItem leadId={this.props?.leadId} />;
  }
}
export default memo(LeadItem);
const styles = StyleSheet.create({
  leadListCardLeftConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RightCircle: {
    height: 40,
    width: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6e7ec',
  },
  outerStatus: {
    marginVertical: moderateScale(3),
    marginRight: moderateScale(6),
    borderRadius: moderateScale(18),
    textTransform: 'capitalize',
  },
  leadListCardLabel: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.SEMI_BOLD),
    color: R.colors.white,
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(18),
    textTransform: 'capitalize',
  },
  leadListCardTimeText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
    fontSize: 12,
  },
  itemContainer: {
    borderRadius: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: R.colors.white,
  },
  selectedItem: {
    backgroundColor: '#c6e2f5',
  },
  leadNameText: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.SEMI_BOLD),
    color: R.colors.black,
  },
  leadListCardConatiner: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
  },
  leadListCardRightConatiner: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leadOuter: {
    flexDirection: 'row',
    maxWidth: '100%',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  leftContent: {marginLeft: 10, flex: 1},
});
