import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

interface SelectDropdown {
  title: string;
  onPress: () => void;
}
const SelectDropdown = ({onPress, title}: SelectDropdown) => {
  return (
    <TouchableOpacity style={styles.dropdownWrapper} onPress={onPress}>
      <Text style={styles.dropdownText}>{title}</Text>
      <View style={styles.dropdownIconWrapper}>
        <MaterialCommunityIcons
          name="chevron-up"
          color={R.colors.blue}
          size={moderateScale(23)}
        />

        <View style={styles.downArrow}>
          <MaterialCommunityIcons
            name="chevron-down"
            color={R.colors.IndianRed}
            size={moderateScale(23)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dropdownWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.SEMI_BOLD),
    color: R.colors.black,
  },
  dropdownIconWrapper: {
    marginTop: moderateScale(-5),
    marginLeft: moderateScale(5),
  },
  downArrow: {
    marginTop: moderateScale(-12),
  },
});

export default SelectDropdown;
