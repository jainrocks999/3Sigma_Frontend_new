import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import R from 'resources/R';

import GModal from '../wrapper/GModal';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
interface LoaderProps {
  isVisible: boolean;
  message?: string;
}
const Loader = ({isVisible, message = ''}: LoaderProps) => {
  return (
    <GModal
      isVisible={isVisible}
      backdropColor={'transparent'}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={R.colors.themeCol2} />
        <Text style={styles.loadingtext}>{message}</Text>
      </View>
    </GModal>
  );
};
export default Loader;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: Dimensions.get('screen').height,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingtext: {
    textAlign: 'center',
    color: R.colors.white,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.REGULAR),
  },
});
