import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import CountDown from 'react-native-countdown-component';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';

export default function GCountDown({
  until,
  onFinish,
  digitStyle = {},
  labelStyle = {},
}: {
  until: number | undefined;
  onFinish: (arg0: boolean) => void;
  digitStyle?: ViewStyle;
  labelStyle?: ViewStyle;
}) {
  return (
    <CountDown
      until={until ? until : 0}
      onFinish={() => {
        onFinish(false);
      }}
      size={20}
      timeToShow={['S']}
      digitStyle={{...styles.digitStyle, ...digitStyle}}
      digitTxtStyle={{...styles.labelStyle, ...labelStyle}}
      timeLabels={{m: '', s: ''}}
      separatorStyle={{color: R.colors.labelCol1}}
      showSeparator
    />
  );
}
const styles = StyleSheet.create({
  digitStyle: {
    backgroundColor: 'transparent',
    height: 25,
    padding: 0,
    margin: 0,
  },
  labelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.MEDIUM),
  },
});
