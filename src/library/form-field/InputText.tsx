import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {InputTextProps} from 'datalib/entity/component';
import R from 'resources/R';
import {Pressable} from 'react-native';

const InputText = (props: InputTextProps) => {
  let {
    boxHeight,
    multiLine,
    numberOfLines,
    placeHolder,
    value,
    onChangeText,
    tag,
    textWidth,
    icon,
  } = props;
  return (
    <View
      style={[
        styles.inputTextWrapper,
        {
          height: moderateScale(boxHeight) || moderateScale(45),
          width: moderateScale(textWidth) || '100%',
        },
      ]}>
      {icon ? (
        <>
          <View style={styles.iconTextWrapper}>
            <View style={styles.iconView}>{icon}</View>
            <TextInput
              style={styles.inputText}
              multiline={multiLine || false}
              numberOfLines={numberOfLines || 1}
              placeholder={placeHolder || ''}
              placeholderTextColor={'#999999'}
              defaultValue={value || ''}
              onChangeText={text => {
                onChangeText(text);
              }}
              readOnly={props.readOnly}
            />
          </View>
        </>
      ) : (
        <TextInput
          style={styles.inputText}
          multiline={multiLine || false}
          numberOfLines={numberOfLines || 1}
          placeholder={placeHolder || ''}
          placeholderTextColor={'#999999'}
          defaultValue={value || ''}
          onChangeText={text => {
            onChangeText(text);
          }}
          readOnly={props.readOnly}
        />
      )}

      {tag && (
        <View style={styles.tagItem}>
          {tag.map((item: string, index: number) => {
            return (
              <View style={styles.tagContiner} key={index.toString()}>
                <Pressable
                  android_ripple={{color: 'gray'}}
                  onPress={() => onChangeText(item)}>
                  <Text style={styles.tagItemInfo}>{item}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};
export const styles = StyleSheet.create({
  inputTextWrapper: {
    backgroundColor: R.colors.white,
    borderRadius: moderateScale(15),
    marginTop: 10,
  },
  inputText: {
    height: '100%',
    width: '100%',
    padding: moderateScale(10),
    textAlignVertical: 'top',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol1,
  },
  tagItem: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    padding: moderateScale(3),
    flexWrap: 'wrap',
  },
  tagItemInfo: {
    padding: moderateScale(3),
    color: R.colors.themeCol2,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
  },
  tagContiner: {
    borderColor: R.colors.themeCol2,
    borderWidth: 1,
    borderRadius: moderateScale(5),
    margin: moderateScale(3),
    overflow: 'hidden',
  },
  iconTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconView: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: moderateScale(40),
    width: moderateScale(30),
  },
  labelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 20,
  },
});

export default InputText;
