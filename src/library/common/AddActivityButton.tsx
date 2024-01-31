import {Text, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

const AddActivityButton = ({
  title,
  onPress,
  buttonStyle = {},
}: {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonWrapper, buttonStyle]}>
      <MaterialCommunityIcons
        name={'plus-box'}
        color={R.colors.black}
        size={moderateScale(45)}
      />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: moderateScale(20),
    marginTop: 10,
  },
  buttonText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.black,
  },
});

export default AddActivityButton;
