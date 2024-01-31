/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';

const SectionedTextInput = (props: any) => {
  const [height] = useState(props.multiLine ? props.height || 150 : 50);
  const [multiLine] = useState(props.multiLine || false);
  return (
    <View>
      {props.label && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelStyle}>
            {props.label}
            <Text style={{color: R.colors.IndianRed}}>
              {props.isRequired ? '*' : ''}
            </Text>
          </Text>
          {props.isVerifyBlock && props.verify ? (
            <Text style={styles.verifiedText}>Verified</Text>
          ) : props.isVerifyBlock ? (
            <TouchableOpacity
              style={[styles.labelContainer]}
              onPress={() => props.onActionBtnPress(props.value)}>
              <Text style={styles.unverifiedText}>Not Verified</Text>
              <MaterialCommunityIcons
                name={'information-outline'}
                color={R.colors.IndianRed}
                size={moderateScale(16)}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
      <View
        style={[
          styles.container,
          {height},
          props.containerStyle,
          {
            backgroundColor: props.readOnly
              ? R.colors.InputGrey3
              : R.colors.white,
          },
        ]}>
        {props.leftContent && (
          <View
            style={{
              alignItems: 'flex-end',
              width: props.leftWidth ? props.leftWidth : '10%',
            }}>
            {props.leftContent}
          </View>
        )}
        <TextInput
          {...props}
          style={{
            ...styles.textInput,
            color:
              props.editable != null && !props.editable
                ? props?.placeholderColor
                  ? props?.placeholderColor
                  : R.colors.themeCol1
                : R.colors.themeCol1,

            textAlignVertical: multiLine ? 'top' : 'center',
            height: '100%',
            flex: 1,
            ...props.inputStyle,
          }}
          placeholderTextColor={'#999999'}
          multiline={multiLine}
          editable={props.readOnly ? false : true}
        />
        {props.rightContent && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              width: props.rightWidth ? props.rightWidth : '12%',
            }}>
            {props.rightContent}
          </View>
        )}
        {props.showCharacterCount && (
          <Text
            style={{
              ...R.generateFontStyle(
                FontSizeEnum.BASE,
                FontWeightEnum.SEMI_BOLD,
              ),
              color: 'black',
              position: 'absolute',
              right: 10,
              bottom: 10,
            }}>
            {props.characterCount ? props.characterCount : 0}
          </Text>
        )}
      </View>
    </View>
  );
};
export default SectionedTextInput;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: R.colors.white,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  labelStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
  },
  textInput: {
    width: '100%',
    paddingHorizontal: 20,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.labelCol1,
  },
  s3PhoneIpCnt: {},
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  verifiedText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.green,
  },
  unverifiedText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.IndianRed,
    marginRight: 5,
  },
});
