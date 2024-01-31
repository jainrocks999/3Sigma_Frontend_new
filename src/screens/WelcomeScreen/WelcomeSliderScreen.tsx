import React from 'react';
import {StyleSheet, Dimensions, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import GCarousel from '../../library/common/GCarousel';
import GScreen from 'library/wrapper/GScreen';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import AppImages from 'resources/images';
import FastImage from 'react-native-fast-image';

const slideImages = [
  {
    _id: 1,
    image: AppImages.SlideScreen1,
    title: 'All your leads in one Place',
    description: 'Auto sync leads from 10+ lead sources',
    resizeMode: FastImage.resizeMode.contain,
  },
  {
    _id: 2,
    image: AppImages.SlideScreen2,
    title: 'Reach your leads in seconds',
    description: 'Whatsapp or call leads instantly',
    resizeMode: FastImage.resizeMode.contain,
  },
  {
    _id: 3,
    image: AppImages.SlideScreen3,
    title: 'Never miss another Follow-up',
    description: 'Manage all tasks with reminder notification',
    resizeMode: FastImage.resizeMode.stretch,
  },
  {
    _id: 4,
    image: AppImages.SlideScreen4,
    title: 'Auto-Personalize your messaging',
    description: 'Create & share message templates, files, pages with Leads',
    resizeMode: FastImage.resizeMode.stretch,
  },
  // {
  //   _id: 5,
  //   image: AppImages.SlideScreen5,
  //   title: 'View real-time reports',
  //   description:
  //     'View individual team call report, work reports, sales funnels',
  // },
];
export default function WelcomeSliderScreen(props) {
  const navigation = useNavigation();
  const onSkipPress = () => {
    navigation.navigate(ScreenNameEnum.REGISTRATION_SCREEN, {});
  };
  return (
    <GScreen>
      <TouchableOpacity style={styles.btnStyle} onPress={onSkipPress}>
        <Text style={styles.textStyle}>SKIP</Text>
      </TouchableOpacity>
      {props.navigation.isFocused() && (
        <GCarousel
          data={slideImages}
          fullWidth
          height={Dimensions.get('screen').height - 300}
          contentContainerStyle={styles.contentContainerStyle}
          onLoginPress={onSkipPress}
        />
      )}
    </GScreen>
  );
}
const styles = StyleSheet.create({
  btnStyle: {
    position: 'absolute',
    zIndex: 999,
    right: 20,
    top: 20,
  },
  textStyle: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol2,
  },
  contentContainerStyle: {
    height: Dimensions.get('window').height - 50,
  },
});
