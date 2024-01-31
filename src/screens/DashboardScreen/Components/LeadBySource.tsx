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
import {getCountByIntegration} from '../../../store/slices/dashboard.slice';
import {
  selectIntegrations,
  selectSubcriptionStatus,
} from '../../../store/slices/user.slice';
import {selectPrefrence} from '../../../store/slices/user.slice';
import {sourceColors} from 'resources/colors/colors';
import {PrefrenceKeyEnum} from '../../../models/common/preference.keys.enum';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
const customSource = [
  '#FFC0CB',
  '#FF00FF',
  '#00FF00',
  '#FFFF00',
  '#800000',
  '#808080',
  '#123456',
  '#0000FF',
  '#347C17',
];
const LeadBySource = ({refreshing}: {refreshing: boolean}) => {
  const dispatch = useDispatch<RootDispatch>();
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const {paramsMetadata, leadsBySource, fetchIntegrationStatus} = useSelector(
    (state: RootState) => state.dashboard,
  );
  const integrations = useSelector((state: RootState) =>
    selectIntegrations(state),
  );
  const sources: Array<any> = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.LEAD_CUSTOM_SOURCES),
  );

  // const [totalLeads, setTotalLeads] = useState<number>(0);
  const [chartData, setChartData] = useState([]);
  const [chartColor, setChartColor] = useState([]);

  // useEffect(() => {
  //   reloadChartData();
  // }, [paramsMetadata]);
  useEffect(() => {
    if (fetchIntegrationStatus.status === ThunkStatusEnum.IDLE || refreshing) {
      reloadChartData();
    }
  }, [refreshing]);
  useEffect(() => {
    if (chartData && leadsBySource) {
      const colors: any = [];
      const _chartData: any = [];
      let sum = leadsBySource.reduce(function (
        previousValue: number,
        currentValue: any,
      ) {
        return previousValue + parseInt(currentValue.count, 10);
      },
      0);

      leadsBySource.map((item: any, index: number) => {
        const payload = {
          y: ((100 / sum) * parseInt(item.count, 10)).toFixed(2),
          x: '',
          label: '',
        };
        const integration = integrations.find(
          _i => _i.key === item.integration || _i._id === item.integration,
        );
        if (integration) {
          payload.x = integration.name;

          payload.label = item.count;
          colors[index] = sourceColors[integration.key] || '#347C17';
        } else {
          const source = sources.find(_i => _i.value === item.integration);
          payload.x = source ? source.name : item.integration;
          payload.label = item.count;
          colors[index] = customSource[index];
        }
        _chartData.push(payload);
      });
      // setTotalLeads(sum);
      setChartData(_chartData);
      setChartColor(colors);
    }
  }, [leadsBySource]);
  const reloadChartData = async () => {
    if (isSubscribed) {
      await dispatch(getCountByIntegration(paramsMetadata));
    }
  };

  return (
    <View style={styles.chartSections}>
      <View style={styles.pieSection}>
        {fetchIntegrationStatus.status === ThunkStatusEnum.LOADING ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : null}
        {/* {chartData && chartData.length ? (
          <Text style={styles.leadTotal}>
            Total Leads : {Helper.kFormatter(totalLeads)}
          </Text>
        ) : null} */}
        {chartData && chartData.length ? (
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
                  padding: 7,
                },
              }}
            />
            <View style={styles.pieItemDesc}>
              {chartData &&
                chartData.map((item: any, index: number) => (
                  <View
                    key={`${item.id}_${Math.random()}_key`}
                    style={styles.pieItemStyle}>
                    <Text style={[styles.chartItem, styles.daraLabel]}>
                      <MaterialCommunityIcons
                        name="checkbox-blank-circle"
                        color={chartColor[index]}
                        size={20}
                      />{' '}
                      {item.x === 'assigned_lead' ? 'Assigned Lead' : item.x}
                    </Text>
                    <Text key={`${item.id}_ewewe`} style={[styles.chartItem]}>
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
  daraLabel: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
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
  pieItemStyle: {justifyContent: 'space-between', flexDirection: 'row'},
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
export default LeadBySource;
