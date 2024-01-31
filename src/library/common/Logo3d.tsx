import React from 'react';
import {View, Text, Platform, Image, StyleSheet} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';

import AppImages from 'resources/images';
import R from 'resources/R';

const Logo3d = () => {
  return (
    <>
      <View style={styles.container}>
        <Image source={AppImages.logoBg} style={styles.logoOut} />
        {Platform.OS === 'ios' ? (
          <>
            <Image
              source={AppImages.logo}
              style={{...styles.logo, ...styles.neuShadowBottom}}
            />
          </>
        ) : (
          <>
            <Image source={AppImages.logo} style={styles.logoOverlay} />
            <Image source={AppImages.logo} style={styles.logoOverlay} />
            <Image source={AppImages.logo} style={styles.logo} />
          </>
        )}
      </View>
      <View>
        <Text style={[styles.logoText, styles.logoTextShadow]}>3sigma</Text>
        <Text
          style={[
            styles.logoText,
            styles.logoTextShadowBottom,
            styles.absolute,
          ]}>
          3sigma
        </Text>
      </View>
    </>
  );
};

export default Logo3d;

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
  logo: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  absolute: {
    position: 'absolute',
  },
  logoOverlay: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
    position: 'absolute',
    top: 2,
    left: 2,
    tintColor: '#dee3e7',
  },
  logoOut: {
    top: -1,
    width: 55,
    height: 55,
    resizeMode: 'contain',
    tintColor: 'white',
    position: 'absolute',
  },
  logoText: {
    marginLeft: 5,
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL5, FontWeightEnum.MEDIUM),
    // marginTop:15
  },
  logoTextShadow: {
    ...Platform.select({
      ios: {
        textShadowColor: 'white',
        textShadowOffset: {width: 0, height: -5.5},
        textShadowRadius: 1,
      },
      android: {
        textShadowColor: 'white',
        textShadowOffset: {width: 0, height: -4},
        textShadowRadius: 1,
      },
    }),
  },
  logoTextShadowBottom: {
    ...Platform.select({
      ios: {
        textShadowColor: 'lightgrey',
        textShadowOffset: {width: 0, height: 5},
        textShadowRadius: 3,
      },
      android: {
        textShadowColor: 'lightgrey',
        textShadowOffset: {width: 0, height: 4},
        textShadowRadius: 3,
      },
    }),
  },
  neuShadowTop: {
    shadowColor: 'lightgrey',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  neuShadowBottom: {
    shadowColor: 'lightgrey',
    shadowOffset: {
      width: -2,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
});
