/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import GAlert from '../common/GAlert';
Geocoder.init('AIzaSyAAGq5ZMwPrU2LlcFftQ9mNtLTVPsndh-E');
import MapView, {Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Nillable} from '../../models/custom.types';

const MapsInput = (props: any) => {
  // REFS
  const autPlacesRef = useRef(null);
  const mapRef = useRef(null);
  const [mapViewHeight] = useState(props.mapHeight || 150);
  const [addressText, setAddressText] = useState('');
  const [loader, setLoader] = useState<boolean>(false);
  // STATE
  const [address, setAddress] =
    useState<Nillable<{address: string; coords: any}>>(null);
  // const [enableCurrentLocation, setCurrentLication] = useState(false);

  // METHODS
  const animate = currPos => {
    setTimeout(() => {
      mapRef.current?.animateToRegion(currPos, 1000);
    }, 15);
  };

  // HOOKS
  useEffect(() => {
    if (address && address.coords) {
      setTimeout(() => {
        mapRef.current?.animateToRegion(address.coords, 1000);
        autPlacesRef.current?.setAddressText(address.address);
      }, 15);
    }
  });
  useEffect(() => {
    setTimeout(() => {
      try {
        if (props.defaultCoords && !address) {
          setAddresByLocation({
            address: props.defaultAddress,
            coords: props.defaultCoords,
          });
        }
        // if (props.defaultCoords && props.defaultAddress) {
        //   mapRef.current &&
        //     mapRef.current.animateToRegion(props.defaultCoords, 1000);
        //   autPlacesRef.current.setAddressText(props.defaultAddress);
        // }
      } catch (e) {
        console.log(e);
      }
    }, 1000);
  }, [props.defaultAddress, props.defaultCoords]);
  useEffect(() => {
    if (address) {
      props.onChangeAddress &&
        props.onChangeAddress(address.address, address.coords);
    }
  }, [address]);

  // useEffect(() => {
  //   props.onChangeCoords && props.onChangeCoords(coords, address);
  // }, [coords]);
  const setAddresByLocation = (location: any, updateToParent = false) => {
    if (location.address) {
      setAddress(location);
      autPlacesRef.current?.setAddressText(location.address);
    } else {
      Geocoder.from(location.coords.latitude, location.coords.longitude)
        .then(json => {
          var addressComponent: string =
            json.results.length > 2
              ? `${json.results[2].formatted_address}`
              : `${json.results[0].formatted_address}`;
          setAddress({
            address: addressComponent,
            coords: location.coords,
          });
          autPlacesRef.current?.setAddressText(addressComponent);
          if (updateToParent) {
            props.onChangeAddress &&
              props.onChangeAddress(addressComponent, location.coords);
            props.onChangeCoords &&
              props.onChangeCoords(location.coords, addressComponent);
          }
        })
        .catch(error => console.warn(error));
    }

    if (mapRef && mapRef.current && mapRef.current.animateToRegion) {
      mapRef.current.animateToRegion(location.coords, 1000);
    }
  };
  const setCurrentLocation = () => {
    setLoader(true);
    Geolocation.getCurrentPosition(
      async position => {
        setLoader(false);
        setAddresByLocation(
          {
            coords: {
              latitude: parseFloat(`${position.coords.latitude}`),
              longitude: parseFloat(`${position.coords.longitude}`),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0922,
            },
            address: null,
          },
          true,
        );
      },
      _error => {
        GAlert('Timeout, Not able to fetch current location');
        // setCurrentLication(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 10000,
      },
    );
  };

  return (
    <View style={[styles.container, {height: mapViewHeight + 150}]}>
      <View style={styles.locationSwitch}>
        <View>
          <Text style={styles.labelStyle}>
            {props.label || 'label'}
            <Text style={styles.warningText}>
              {props.isRequired ? '*' : ''}
            </Text>
          </Text>
        </View>
        {/* <View style={styles.switchWrapper}>
          <Text style={styles.labelStyle}>Current location</Text>
          <Switch
            trackColor={{
              false: '#767577',
              true: R.colors.themeCol2,
            }}
            thumbColor={enableCurrentLocation ? R.colors.themeCol2 : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={val => {
              setCurrentLication(val);
              if (val) {
                setCurrentLocation();
              }
            }}
            value={enableCurrentLocation}
          />
        </View> */}
      </View>
      <TouchableOpacity
        style={styles.locateMeIcon}
        onPress={setCurrentLocation}>
        <MaterialCommunityIcons name="crosshairs-gps" size={25} color="gray" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          ref={autPlacesRef}
          placeholder={'Search for an address'}
          minLength={2}
          keyboardShouldPersistTaps={'always'}
          keepResultsAfterBlur={true}
          // returnKeyType={'default'}
          textInputProps={{
            placeholderTextColor: '#999999',
            returnKeyType: 'default',
            editable: props?.editable,
          }}
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (details) {
              const _coords = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0061,
              };
              setAddress({
                address: data?.description || data?.name,
                coords: _coords,
              });
              animate(_coords);
            }
          }}
          query={{
            key: 'AIzaSyCnS48j3rbqgdhum3jOuGL4l4Q5lft2Ezs',
            language: 'en',
          }}
          styles={{
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
            description: styles.textInput,
            listView: styles.listView,
          }}
          enablePoweredByContainer={false}
          listViewDisplayed={false}
          nearbyPlacesAPI={'GoogleReverseGeocoding'}
        />
      </View>

      <View
        style={[
          styles.mapView,
          {height: mapViewHeight + 100},
          props.mapViewStyle,
        ]}>
        <MapView ref={mapRef} style={styles.flexOne} onRegionChange={() => {}}>
          {address && address.coords ? (
            <Marker coordinate={address.coords} />
          ) : null}
        </MapView>
        {loader && (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size={'small'} color={R.colors.white} />
            <Text style={styles.loaderText}>Refreshing...</Text>
          </View>
        )}
      </View>
    </View>
  );
};
export default MapsInput;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
    position: 'relative',
  },
  warningText: {color: R.colors.IndianRed},
  textInput: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    backgroundColor: 'transparent',
  },
  loaderText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.white,
  },
  labelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 4,
  },
  textStyle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.labelCol1,
  },
  mapView: {
    position: 'absolute',
    top: 100,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 15,
    zIndex: 1,
  },
  locationSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  locateMeIcon: {
    position: 'absolute',
    right: 5,
    top: 42,
    padding: 5,
    borderRadius: 30,
    zIndex: 999999,
  },
  flexOne: {
    flex: 1,
    zIndex: 9,
  },
  textInputContainer: {
    width: '100%',
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: R.colors.white,
    borderRadius: 10,
    overflow: 'hidden',
  },
  listView: {height: 150, borderRadius: 10, zIndex: 99999},
  searchContainer: {flex: 1, width: '100%', zIndex: 99999},
  loaderWrapper: {
    position: 'absolute',
    zIndex: 999,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
