/* eslint-disable react-hooks/exhaustive-deps */
import React, {FunctionComponent} from 'react';
import {ActivityIndicator, Image, SafeAreaView, Text, View} from 'react-native';
import {styles} from './styles';
import AppImages from 'resources/images';
import R from 'resources/R';
interface SplashProps {
  hasNoInternet?: boolean;
  message?: string;
}
const SplashScreen: FunctionComponent<SplashProps> = ({
  hasNoInternet,
  message,
}: SplashProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={AppImages.splash}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.loadingBlock}>
        <ActivityIndicator size={'small'} color={R.colors.themeCol2} />
        <Text style={styles.loadingText}>
          {hasNoInternet ? 'No internet' : message || 'Initializing...'}
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default SplashScreen;
