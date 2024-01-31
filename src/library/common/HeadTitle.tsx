import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {FontSizeEnum, FontWeightEnum} from '../../resources/fonts/fontStyles';
import R from 'resources/R';

const HeadTitle = ({
  screenTitle,
  onPress,
  icon = null,
}: {
  screenTitle: string;
  onPress?: () => void;
  icon?: any;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.headerTitle}>
        {screenTitle} {icon}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
  },
});

export default HeadTitle;
