/* eslint-disable react-hooks/exhaustive-deps */
/* Libraries */
import React, {useEffect, useState} from 'react';
import {View, Platform, Text, Pressable, StyleSheet} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {
  selectPrefrence,
  selectSubcriptionStatus,
} from '../../../store/slices/user.slice';
import {PrefrenceKeyEnum} from '../../../models/common/preference.keys.enum';
import {RootDispatch, RootState} from '../../../store/app.store';
import {useDispatch, useSelector} from 'react-redux';
import Helper from '../../../utils/helper';
import {getLeadCountByStatus} from '../../../store/slices/dashboard.slice';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';

const LeadFunnel = ({refreshing}: {refreshing: boolean}) => {
  const dispatch = useDispatch<RootDispatch>();
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const {paramsMetadata, leadsByStatus, fetchLeadsByStatus} = useSelector(
    (state: RootState) => state.dashboard,
  );
  useEffect(() => {
    if (fetchLeadsByStatus.status === ThunkStatusEnum.IDLE || refreshing) {
      reloadChartData();
    }
  }, [refreshing]);
  // useEffect(() => {
  //   reloadChartData();
  // }, [paramsMetadata]);
  const reloadChartData = async () => {
    if (isSubscribed) {
      await dispatch(getLeadCountByStatus(paramsMetadata));
    }
  };

  const statusArr = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.STATUS),
  );
  const labelsArr = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.LABELS),
  );
  const [tab, setTab] = useState('status');
  const [leadLabelCount, setLeadLabelCount] = useState<any>({});
  const [labelSale, setLabelSate] = useState<any>({});
  const statuses = [...statusArr];
  const getDataPoints = (status: string, key: any) => {
    const statusObj = leadsByStatus.find((_i: any) => _i.type === status);
    if (statusObj) {
      return statusObj[key];
    } else {
      return 0;
    }
  };
  return (
    <View style={styles.chartSections}>
      <View style={styles.funnelContainer}>
        <Pressable
          onPress={() => {
            setTab('status');
          }}>
          <Text
            style={[
              styles.tabHeader,
              tab === 'status' ? styles.activeTabHeader : {},
            ]}>
            Status
          </Text>
        </Pressable>
      </View>
      {tab === 'status' ? (
        <View style={styles.funnelWrapper}>
          {statuses.map((item, index) => (
            <View style={styles.funnelItem} key={`${index}_status`}>
              <View
                style={[
                  styles.chartLabelBack,
                  {
                    backgroundColor: item.color,
                    width: 320 - index * 25,
                  },
                  styles.shadowLow,
                ]}
              />
              <View
                key={`${index}_lead_by_status`}
                style={[
                  styles.rectangle,
                  {
                    width: 350 - index * 25,
                    borderTopColor: item.color,
                  },
                ]}>
                <View style={[styles.chartLabel]}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.funnelText,
                      item.color === '#000000' ? styles.colorWhite : {},
                    ]}>
                    {Helper.kFormatter(getDataPoints(item.value, 'count'))}{' '}
                    {item.name} Leads
                  </Text>
                  <Text style={styles.funnelText}>
                    ₹{Helper.kFormatter(getDataPoints(item.value, 'saleValue'))}{' '}
                    {'Sale Value'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.funnelWrapper}>
          {labelsArr.map(
            (item, index) =>
              index < 7 && (
                <View style={styles.funnelItem} key={`${index}_labels`}>
                  <View
                    style={[
                      styles.chartLabelBack,
                      {
                        backgroundColor: item.color,
                        width: 320 - index * 25,
                      },
                      styles.shadowLow,
                    ]}
                  />
                  <View
                    key={`${index}_lead_by_label`}
                    style={[
                      styles.rectangle,
                      {
                        width: 350 - index * 30,
                        borderTopColor: item.color,
                      },
                    ]}>
                    <View style={[styles.chartLabel]}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.funnelText,
                          item.color === '#000' ? styles.colorWhite : {},
                        ]}>
                        {Helper.kFormatter(
                          leadLabelCount[item.value]
                            ? leadLabelCount[item.value]
                            : 0,
                        )}{' '}
                        {item.name} Leads
                      </Text>
                      <Text
                        style={[
                          styles.funnelText,
                          item.color === '#000' ? styles.colorWhite : {},
                        ]}>
                        ₹
                        {Helper.kFormatter(
                          labelSale[item.value] ? labelSale[item.value] : 0,
                        )}{' '}
                        Sale Value
                      </Text>
                    </View>
                  </View>
                </View>
              ),
          )}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  rectangle: {
    borderTopWidth: 50,
    borderLeftWidth: 15,
    borderLeftColor: 'transparent',
    borderRightWidth: 15,
    borderRightColor: 'transparent',
    borderStyle: 'solid',
    marginBottom: 20,
    zIndex: 99,
  },
  chartLabel: {
    zIndex: 99,
    color: '#FFFFFF',
    fontSize: 11,
    position: 'absolute',
    top: -45,
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.BOLD),
    minWidth: 100,
    paddingVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 5,
    width: '100%',
    alignItems: 'center',
  },
  chartLabelBack: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.BOLD),
    paddingVertical: 5,
    borderRadius: 5,
    width: '100%',

    height: 5,
    position: 'absolute',
    bottom: -4,
    left: 15,
    zIndex: 1,
  },
  sectionHeader: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.BOLD),
    paddingVertical: 10,
    marginTop: 10,
  },

  chartSections: {
    paddingHorizontal: 20,
  },
  shadowLow: {
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
        elevation: 1,
      },
    }),
  },
  tabHeader: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.BOLD),
    color: R.colors.labelCol1,
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  activeTabHeader: {
    color: R.colors.themeCol2,
    borderBottomColor: R.colors.themeCol2,
    borderBottomWidth: 2,
  },
  funnelText: {
    color: 'black',
    fontWeight: 'bold',
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.BOLD),
    elevation: 2,
  },
  funnelContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  funnelWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  funnelItem: {height: 50, marginBottom: 13},
  colorWhite: {color: 'white'},
});
export default LeadFunnel;
