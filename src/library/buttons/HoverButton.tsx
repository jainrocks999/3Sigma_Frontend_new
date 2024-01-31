/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppImages from 'resources/images';
import R from 'resources/R';
import {TourGuideZone} from 'rn-tourguide';

const HoverButtonContent = (props: any) => {
  switch (props.type) {
    case 'addressBook':
      return (
        <Image
          source={AppImages.addressbook}
          style={{
            height: 20,
            width: 20,
            resizeMode: 'contain',
            tintColor: props.IconCol ? props.IconCol : 'white',
          }}
        />
      );
    case 'share':
      return (
        <Image
          source={AppImages.quickWhite}
          style={{
            height: 20,
            width: 20,
            resizeMode: 'contain',
            tintColor: props.IconCol ? props.IconCol : 'white',
          }}
        />
      );
    case 'refresh':
      return (
        <MaterialCommunityIcons
          name={'refresh'}
          size={35}
          color={props.IconCol ? props.IconCol : 'white'}
        />
      );
    case 'dialPad':
      return (
        <MaterialCommunityIcons
          name={'dialpad'}
          size={25}
          color={props.IconCol ? props.IconCol : 'white'}
        />
      );
    default:
      return (
        <MaterialIcons
          name={'add'}
          size={45}
          color={props.IconCol ? props.IconCol : 'white'}
        />
      );
  }
};

const HoverButton = (props: any) => {
  if (!props.hide) {
    return props.tourEnabled ? (
      <TourGuideZone
        zone={props.zone || 100}
        text={props.text || ''}
        style={{
          ...styles.HoverButton,
          right: props.right && 20,
          left: props.left && 20,
          ...props.style,
        }}
        borderRadius={10}>
        <TouchableOpacity onPress={props.onPress}>
          <HoverButtonContent {...props} />
        </TouchableOpacity>
      </TourGuideZone>
    ) : (
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          ...styles.HoverButton,
          right: props.right && 20,
          left: props.left && 20,
          ...props.style,
        }}>
        <HoverButtonContent {...props} />
      </TouchableOpacity>
    );
  }
  return null;
};

export default HoverButton;
const styles = StyleSheet.create({
  HoverButton: {
    height: 55,
    width: 55,
    borderRadius: 55,
    position: 'absolute',
    backgroundColor: R.colors.themeCol2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.54,
        shadowRadius: 6.27,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
