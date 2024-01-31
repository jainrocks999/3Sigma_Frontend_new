import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {androidRipple} from 'resources/colors/colors';
import Helper from '../../../utils/helper';

const LeadCalculateWithTrends = ({
  boxTitle,
  numberText,
  selected,
  onPress,
  tabName,
}: any) => {
  return (
    <View
      style={[
        styles.itemContainer,
        {backgroundColor: selected ? R.colors.themeCol2 : R.colors.white},
      ]}>
      <Pressable
        onPress={() => onPress(tabName)}
        android_ripple={androidRipple}>
        <View style={styles.leadBoxWrapper}>
          <View style={styles.leadData}>
            <Text
              style={[
                styles.boxInfoTitle,
                {color: selected ? R.colors.white : R.colors.black},
              ]}>
              {boxTitle}
            </Text>
          </View>
          <Text
            style={[
              styles.numberTextStyle,
              {color: selected ? R.colors.white : R.colors.black},
            ]}>
            {Helper.kFormatter(numberText)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  leadBoxWrapper: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
  },
  itemContainer: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderRadius: moderateScale(10),
    marginHorizontal: moderateScale(10),
    overflow: 'hidden',
  },
  leadData: {
    flexDirection: 'row',
  },
  boxInfoTitle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.black,
    marginBottom: moderateScale(5),
    marginRight: moderateScale(10),
  },
  numberTextStyle: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.EXTRA_BOLD),
    color: R.colors.black,
  },
});

export default LeadCalculateWithTrends;
