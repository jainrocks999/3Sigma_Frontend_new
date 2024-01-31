import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

const LeadData = (props: any) => {
  return (
    <View style={styles.leadContainerWrapper}>
      <View style={styles.titleTrendWrapper}>
        <Text style={styles.leadTitle}>{props.title}</Text>
      </View>
      <View style={styles.titleTrendWrapper}>
        <Text style={styles.leadBoldNumber}>{props?.count}</Text>
        <Text style={styles.leadUnitText}>{props.suffix}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leadContainerWrapper: {
    flex: 1,
    marginHorizontal: moderateScale(5),
    padding: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: R.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  titleTrendWrapper: {
    flexDirection: 'row',
  },
  leadTitle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.SEMI_BOLD),
    color: R.colors.black,
  },
  leadBoldNumber: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.EXTRA_BOLD),
    color: R.colors.black,
  },
  leadUnitText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.black,
    marginLeft: moderateScale(5),
    marginTop: 6,
  },
});

export default LeadData;
