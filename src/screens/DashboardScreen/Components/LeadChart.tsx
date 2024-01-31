/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {LineChart} from 'react-native-chart-kit';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {moderateScale} from 'resources/responsiveLayout';
import R from 'resources/R';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../../store/app.store';
import {getChartData} from '../../../store/slices/dashboard.slice';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
import Helper from '../../../utils/helper';
import {selectSubcriptionStatus} from '../../../store/slices/user.slice';

const LeadChart = (props: any) => {
  const dispatch = useDispatch<RootDispatch>();
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const [activeTab, setTabValue] = useState('');
  const {paramsMetadata, fetchChartDataStatus, chartData} = useSelector(
    (state: RootState) => state.dashboard,
  );

  // useEffect(() => {
  //   if (isSubscribed) {
  //     reloadChartData();
  //   }
  // }, [props.tab]);
  useEffect(() => {
    if (
      (fetchChartDataStatus.status === ThunkStatusEnum.IDLE ||
        props.refreshing ||
        props.tab !== activeTab) &&
      isSubscribed
    ) {
      reloadChartData();
    }
  }, [props.refreshing, props.tab]);
  const reloadChartData = async () => {
    const payload = {
      ...paramsMetadata,
      userId: paramsMetadata.userId,
      dataType: props.tab,
    };
    if (paramsMetadata.userId && paramsMetadata.userId !== '') {
      payload.userId = paramsMetadata.userId;
    } else {
      delete payload.userId;
    }
    setTabValue(props.tab);
    await dispatch(getChartData(payload));
  };
  return (
    <View style={styles.leadChartWrapper}>
      <View style={styles.chartArea}>
        {/* <Text> {callSelected}</Text> */}
        {fetchChartDataStatus.status === ThunkStatusEnum.LOADING ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : null}
        {chartData &&
        chartData.length &&
        fetchChartDataStatus.status !== ThunkStatusEnum.LOADING ? (
          <>
            <LineChart
              data={{
                labels: chartData.map((_i: any) => {
                  if (Helper.isDate(_i.point)) {
                    return moment(_i.point).format('DD MMM');
                  } else {
                    return _i.point;
                  }
                }),
                datasets: [
                  {
                    data: chartData.map(_i => _i.count),
                  },
                ],
              }}
              width={Dimensions.get('window').width} // from react-native
              height={240}
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: '#f4f4f4',
                backgroundGradientFrom: '#f4f4f4',
                backgroundGradientTo: '#f4f4f4',
                fillShadowGradient: '#3FAEFD',
                fillShadowGradientOpacity: 0.3,
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (_opacity = 1) => '#3FAEFD',
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {},
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#3FAEFD',
                  fill: 'white',
                },
                propsForLabels: styles.labelStyle,
                propsForBackgroundLines: {},
              }}
              style={styles.chartStyle}
            />
            <Text style={styles.noDataText}>
              Showing data from{' '}
              {moment(paramsMetadata.fromDate).format('DD MMM')} to{' '}
              {moment(paramsMetadata.toDate).format('DD MMM YYYY')}
            </Text>
          </>
        ) : (
          <Text style={styles.noDataText}>
            No data to show between{' '}
            {moment(paramsMetadata.fromDate).format('DD MMM')} to{' '}
            {moment(paramsMetadata.toDate).format('DD MMM YYYY')}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leadChartWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitleText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.black,
    marginVertical: moderateScale(5),
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
  noDataText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.black,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  chartArea: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 0,
    marginLeft: -20,
  },
  labelStyle: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
  },
});

export default LeadChart;
