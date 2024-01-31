import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {moderateScale} from '../../resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from '../../resources/fonts/fontStyles';
import R from 'resources/R';

const AddButton = props => {
  let {title, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.addButton}>
      <Text style={styles.addButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: R.colors.themeCol1,
    paddingVertical: moderateScale(13),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    width: '100%',
  },
  addButtonText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.MEDIUM),
    color: R.colors.white,
  },
});

export default AddButton;
