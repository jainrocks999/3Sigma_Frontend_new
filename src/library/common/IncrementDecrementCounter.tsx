/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from '../../resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from '../../resources/fonts/fontStyles';
import R from 'resources/R';

const IncrementDecrementCounter = ({
  onCountUpdate,
}: {
  onCountUpdate: (count: number) => void;
}) => {
  const [count, setCount] = useState<number>(1);
  useEffect(() => {
    onCountUpdate && onCountUpdate(count);
  }, [count]);
  return (
    <View style={styles.buttonsWrapper}>
      <TouchableOpacity
        onPress={() => {
          if (count > 1) {
            setCount(count - 1);
          }
        }}
        style={styles.buttonStyle}>
        <MaterialCommunityIcons
          name="minus"
          color={R.colors.black}
          size={moderateScale(18)}
        />
      </TouchableOpacity>
      <Text style={styles.countText}>{count}</Text>
      <TouchableOpacity
        onPress={() => {
          setCount(count + 1);
        }}
        style={styles.buttonStyle}>
        <MaterialCommunityIcons
          name="plus"
          color={R.colors.black}
          size={moderateScale(18)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    justifyContent: 'space-between',
  },
  buttonStyle: {
    height: moderateScale(35),
    width: moderateScale(35),
    borderRadius: moderateScale(20),
    backgroundColor: R.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.MEDIUM),
    color: R.colors.white,
    minWidth: 50,
    textAlign: 'center',
  },
});

export default IncrementDecrementCounter;
