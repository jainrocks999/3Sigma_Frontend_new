/* eslint-disable react-hooks/exhaustive-deps */
/* Libraries */
import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../../store/app.store';
import {getAllCheckIns} from '../../../store/slices/dashboard.slice';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
const CheckInLocation = ({refreshing}: {refreshing: boolean}) => {
  const dispatch = useDispatch<RootDispatch>();
  const {paramsMetadata, checkins, fetchCheckinsStatus} = useSelector(
    (state: RootState) => state.dashboard,
  );

  // useEffect(() => {
  //   reloadChartData();
  // }, [paramsMetadata]);
  useEffect(() => {
    if (fetchCheckinsStatus.status === ThunkStatusEnum.IDLE || refreshing) {
      reloadChartData();
    }
  }, [refreshing]);
  const reloadChartData = async () => {
    await dispatch(getAllCheckIns(paramsMetadata));
  };

  const [currentPosition, setCurrentPosition] = useState({
    latitude: parseFloat('28.6346811'),
    longitude: parseFloat('77.1065934'),
    latitudeDelta: 0.5,
    longitudeDelta: 0.4,
  });
  const mapRef = useRef(null);
  return (
    <View style={styles.pieSection}>
      <View style={styles.mapContainer}>
        {currentPosition && (
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={{flex: 1}}
            initialRegion={currentPosition}
            // region={currentPosition}
            showsUserLocation={true}
            onRegionChange={region => {
              setCurrentPosition(region);
            }}>
            {checkins.map(
              (item: any, index: number) =>
                item?.extraDetails?.coords && (
                  <Marker
                    key={`marker_${index}`}
                    coordinate={item.extraDetails.coords}
                    title={`${item.lead}`}
                    description={`${
                      item.performed_at
                        ? moment(item.performed_at).format('DD MMM YYYY HH:mm')
                        : ''
                    }`}
                  />
                ),
            )}
          </MapView>
        )}
      </View>
    </View>
  );
};
export default CheckInLocation;

const styles = StyleSheet.create({
  pieSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 300,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
});
