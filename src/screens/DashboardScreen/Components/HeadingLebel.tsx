import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

const HeadingLebel = ({title}: {title: string}) => {
  return (
    <View style={styles.textWrapper}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  textWrapper: {
    flex: 1,
    marginBottom: 10,
  },
  headerTitle: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.BOLD),
    color: R.colors.black,
  },
});
export default HeadingLebel;
