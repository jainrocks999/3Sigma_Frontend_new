/* eslint-disable react-hooks/exhaustive-deps */
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from '../../resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from '../../resources/fonts/fontStyles';
import {useNavigation} from '@react-navigation/native';
import R from 'resources/R';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import ConfirmationDialog from '../modals/ConfirmationDialog';

interface BackButtonProps {
  title?: string;
  resetNavigator?: boolean;
  preventBackBtn?: boolean;
  onTitlePress?: () => void;
}
const BackButton = ({
  title,
  onTitlePress,
  resetNavigator,
  preventBackBtn,
}: BackButtonProps) => {
  const navigation = useNavigation();
  const [isConfirm, setConfirm] = useState<boolean>(false);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBackPress();
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  const handleBackPress = () => {
    if (resetNavigator) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: ScreenNameEnum.HOME_TAB_SCREEN,
          },
        ],
      });
    } else if (preventBackBtn) {
      setConfirm(true);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.log('erset navigator');
      navigation.reset({
        index: 0,
        routes: [
          {
            name: ScreenNameEnum.HOME_TAB_SCREEN,
          },
        ],
      });
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButtonWrapper}
        onPress={handleBackPress}>
        <MaterialCommunityIcons
          name="chevron-left"
          color={R.colors.themeCol2}
          size={moderateScale(30)}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onTitlePress} style={styles.titleStyle}>
        <Text style={styles.headerTitle}>{title}</Text>
      </TouchableOpacity>

      <ConfirmationDialog
        showDialog={isConfirm}
        onConfirm={function (status: boolean): void {
          setConfirm(false);
          if (status) {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              console.log('erset navigator');
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: ScreenNameEnum.HOME_TAB_SCREEN,
                  },
                ],
              });
            }
          }
        }}
        confirmationMessage={'Are you sure want to exit?'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  titleStyle: {
    marginLeft: 5,
  },
});

export default BackButton;
