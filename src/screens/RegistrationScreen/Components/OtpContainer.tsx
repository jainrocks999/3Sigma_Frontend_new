/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useEffect, useState, FunctionComponent} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

interface OtpContainerProps {
  onCodeChanged: (otp: string) => void;
}
const OtpContainer: FunctionComponent<OtpContainerProps> = ({
  onCodeChanged,
}: OtpContainerProps) => {
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);
  const fifthTextInputRef = useRef(null);
  const sixthTextInputRef = useRef(null);

  useEffect(() => {
    const OTP = otpArray.filter(_i => _i !== ' ').join('');
    onCodeChanged(OTP);
  }, [otpArray, onCodeChanged]);

  const onOtpChange = (index: number) => {
    return (value: string) => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return;
      }
      const otpArrayCopy = otpArray.concat();
      otpArrayCopy[index] = value;
      setOtpArray(otpArrayCopy);

      // auto focus to next InputText if value is not blank
      if (value !== '') {
        if (index === 0 && secondTextInputRef && secondTextInputRef.current) {
          secondTextInputRef.current.focus();
        } else if (
          index === 1 &&
          thirdTextInputRef &&
          thirdTextInputRef.current
        ) {
          thirdTextInputRef.current.focus();
        } else if (
          index === 2 &&
          fourthTextInputRef &&
          fourthTextInputRef.current
        ) {
          fourthTextInputRef.current.focus();
        } else if (
          index === 3 &&
          fifthTextInputRef &&
          fifthTextInputRef.current
        ) {
          fifthTextInputRef.current.focus();
        } else if (
          index === 4 &&
          sixthTextInputRef &&
          sixthTextInputRef.current
        ) {
          sixthTextInputRef.current.focus();
        }
      }
    };
  };
  const onOtpKeyPress = (index: number) => {
    return ({nativeEvent: {key: value}}) => {
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (value === 'Backspace' && otpArray[index] === '') {
        if (index === 1 && firstTextInputRef && firstTextInputRef.current) {
          firstTextInputRef.current.focus();
        } else if (
          index === 2 &&
          secondTextInputRef &&
          secondTextInputRef.current
        ) {
          secondTextInputRef.current.focus();
        } else if (
          index === 3 &&
          thirdTextInputRef &&
          thirdTextInputRef.current
        ) {
          thirdTextInputRef.current.focus();
        } else if (
          index === 4 &&
          fourthTextInputRef &&
          fourthTextInputRef.current
        ) {
          fourthTextInputRef.current.focus();
        } else if (
          index === 5 &&
          fifthTextInputRef &&
          fifthTextInputRef.current
        ) {
          fifthTextInputRef.current.focus();
        } else if (
          index === 6 &&
          sixthTextInputRef &&
          sixthTextInputRef.current
        ) {
          sixthTextInputRef.current.focus();
        }
        /*
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (index > 0) {
          const otpArrayCopy = otpArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          setOtpArray(otpArrayCopy);
        }
      }
    };
  };
  const refCallback = (textInputRef: React.MutableRefObject<any>) => {
    if (textInputRef) {
      textInputRef.current = textInputRef;
    }
  };

  return (
    <View style={styles.otpInputContainer}>
      {[
        firstTextInputRef,
        secondTextInputRef,
        thirdTextInputRef,
        fourthTextInputRef,
        fifthTextInputRef,
        sixthTextInputRef,
      ].map((textInputRef, index) => (
        <TextInput
          style={
            otpArray.length >= index ? styles.focusStyle : styles.inputStyle
          }
          ref={textInputRef}
          value={otpArray[index]}
          onKeyPress={onOtpKeyPress(index)}
          onChangeText={onOtpChange(index)}
          keyboardType={'numeric'}
          maxLength={1}
          refCallback={refCallback(textInputRef)}
          key={index}
          placeholderTextColor={'#999999'}
          autoComplete={'off'}
        />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  inputStyle: {
    flex: 1,
    width: 40,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: '#e2e2e2',
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL3, FontWeightEnum.MEDIUM),
    textAlign: 'center',
    marginHorizontal: 5,
    maxWidth: 40,
    minHeight: 55,
  },
  focusStyle: {
    flex: 1,
    width: 40,
    borderWidth: 0,
    borderBottomWidth: 2,
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL3, FontWeightEnum.MEDIUM),
    textAlign: 'center',
    marginHorizontal: 5,
    maxWidth: 40,
    minHeight: 55,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 999,
    paddingVertical: 20,
  },
});
export default OtpContainer;
