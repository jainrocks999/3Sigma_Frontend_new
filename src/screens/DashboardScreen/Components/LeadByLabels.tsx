/* eslint-disable react-hooks/exhaustive-deps */
/* Libraries */
import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {VictoryPie} from 'victory-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import Helper from '../../../utils/helper';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../../store/app.store';
import {getLeadCountByLabel} from '../../../store/slices/dashboard.slice';
import {PrefrenceKeyEnum} from '../../../models/common/preference.keys.enum';
import {
  selectPrefrence,
  selectSubcriptionStatus,
} from '../../../store/slices/user.slice';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
const LeadByLabels = ({refreshing}: {refreshing: boolean}) => {
  const dispatch = useDispatch<RootDispatch>();
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const {paramsMetadata, leadsByLabel, fetchLeadsByLabels} = useSelector(
    (state: RootState) => state.dashboard,
  );
  const labels: Array<any> = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.LABELS),
  );
  useEffect(() => {
    if (fetchLeadsByLabels.status === ThunkStatusEnum.IDLE || refreshing) {
      reloadChartData();
    }
  }, [refreshing]);
  // useEffect(() => {
  //   reloadChartData();
  // }, [paramsMetadata]);
  const reloadChartData = async () => {
    if (isSubscribed) {
      await dispatch(getLeadCountByLabel(paramsMetadata));
    }
  };
  const [chartData, setChartData] = useState([]);
  const [chartColor, setChartColor] = useState([]);
  const [total, setTotalLeads] = useState(0);
  useEffect(() => {
    if (chartData && leadsByLabel) {
      const colors: any = [];
      const _chartData: any = [];
      let sum = leadsByLabel.reduce(function (
        previousValue: number,
        currentValue: any,
      ) {
        return previousValue + parseInt(currentValue.count, 10);
      },
      0);

      leadsByLabel.map((item: any, index: number) => {
        const payload = {
          y: ((100 / sum) * parseInt(item.count, 10)).toFixed(2),
          x: '',
          label: '',
        };

        const label = labels.find(_i => _i.value === item.type);
        payload.x = label ? label.name : item.type;
        payload.label = item.count;
        colors[index] = label ? label?.color : '#347C17';
        _chartData.push(payload);
      });
      setTotalLeads(sum);
      setChartData(_chartData);
      setChartColor(colors);
    }
  }, [leadsByLabel]);
  return (
    <View style={styles.chartSections}>
      <View style={styles.pieSection}>
        {refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : null}
        {/* {chartData.length ? (
          <Text style={styles.leadTotal}>
            Total Leads : {Helper.kFormatter(total)}
          </Text>
        ) : null} */}
        {chartData.length && total > 0 ? (
          <>
            <VictoryPie
              data={chartData}
              colorScale={chartColor}
              width={250}
              height={250}
              innerRadius={50}
              padAngle={3}
              style={{
                labels: {
                  fill: 'white',
                  fontSize: 11,
                  padding: 10,
                },
              }}
            />
            <View style={styles.pieItemDesc}>
              {chartData &&
                chartData.map((item: any, index: number) => (
                  <View
                    key={`${index}_${Math.random()}_key`}
                    style={styles.pieItemStyle}>
                    <View style={styles.dataBlock}>
                      <MaterialCommunityIcons
                        name="checkbox-blank-circle"
                        color={chartColor[index]}
                        size={20}
                      />
                      <Text style={[styles.chartItem]} numberOfLines={1}>
                        <Text style={styles.daraLabel}>{item.x}</Text>
                      </Text>
                    </View>
                    <Text
                      key={`${item.id}_ewewe`}
                      style={[styles.chartItem, {alignSelf: 'flex-end'}]}>
                      {item.y}% | {Helper.kFormatter(item.label)}
                    </Text>
                  </View>
                ))}
            </View>
          </>
        ) : (
          <Text style={styles.noDataMessage}>No data to show</Text>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  noDataMessage: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.black,
  },
  dataBlock: {flexDirection: 'row', maxWidth: '80%'},
  daraLabel: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
    maxWidth: 50,
    textTransform: 'capitalize',
  },
  chartSections: {},
  pieSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartItem: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    marginBottom: 5,
    marginLeft: 5,
    textAlign: 'left',
    color: R.colors.themeCol1,
  },
  leadTotal: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  pieItemDesc: {
    width: '100%',
    marginTop: 10,
  },
  pieItemStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
export default LeadByLabels;
