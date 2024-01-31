import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';

import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
const DefaultButton = (props: any) => {
  return (
    <View style={[styles.ButtonContainer, props.buttonStyle]}>
      <Pressable
        android_ripple={R.darkTheme.grayRipple}
        onPress={props.onPress}
        style={[styles.Button]}>
        <Text style={[styles.labelStyle, props.labelStyle]}>{props.label}</Text>
        {props.loading ? (
          <View>
            <ActivityIndicator size={'large'} color={'white'} />
          </View>
        ) : null}
        {props.children}
      </Pressable>
    </View>
  );
};

export const IconButton = (props: any) => {
  return (
    <TouchableOpacity
      style={[styles.buttonWrapper, styles.normal, props.btnStyle]}
      onPress={() => props.onPress && props.onPress()}>
      {props.Icon ? (
        props.Icon
      ) : (
        <MaterialCommunityIcons
          name={props.icon || 'pencil'}
          size={props.iconSize || 14}
          color={props.iconColor || R.colors.themeCol2}
        />
      )}
    </TouchableOpacity>
  );
};

export const IconLabel = (props: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      style={[styles.Button, {flexDirection: 'row'}, props.buttonStyle]}>
      {props.Icon}
      <Text style={[styles.labelStyle, props.labelStyle]}>{props.label}</Text>
    </TouchableOpacity>
  );
};
export const DeleteButton = (props: any) => {
  return (
    <TouchableOpacity
      style={[styles.buttonWrapper, styles.danger, props.btnStyle]}
      onPress={() => props.onPress && props.onPress()}>
      <MaterialCommunityIcons
        name={'trash-can-outline'}
        color={R.colors.IndianRed}
        size={18}
      />
    </TouchableOpacity>
  );
};

export const EditButton = (props: any) => {
  return (
    <TouchableOpacity
      style={[styles.buttonWrapper, styles.normal]}
      onPress={() => props.onPress && props.onPress()}>
      <MaterialCommunityIcons
        name={props.icon || 'pencil'}
        size={props.size || 14}
        color={R.colors.themeCol2}
      />
    </TouchableOpacity>
  );
};
export const SmallButton = (props: any) => {
  return (
    <TouchableOpacity
      style={[styles.addListButton, props.btnStyle]}
      onPress={props.onPress}>
      <Text style={[styles.addButtonText, props.textStyle]}>
        {props.label || 'Save'}
      </Text>
    </TouchableOpacity>
  );
};
export const Button = (props: any) => {
  if (props.type === 'icon') {
    return <IconButton {...props} />;
  } else if (props.type === 'iconLabel') {
    return <IconLabel {...props} />;
  } else {
    return <DefaultButton {...props} />;
  }
};

export default Button;
const styles = StyleSheet.create({
  ButtonContainer: {
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: R.colors.themeCol1,
    position: 'relative',
    maxHeight: 50,
  },
  Button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: '100%',
  },
  labelStyle: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: 'white',
    justifyContent: 'center',
    borderColor: 'white',
  },

  neuShadowBottom: {
    shadowColor: '#ffffff',
    shadowOffset: {
      width: -6,
      height: 6,
    },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(35),
    width: moderateScale(35),
    height: moderateScale(35),
  },
  danger: {
    backgroundColor: R.colors.deleteButton,
  },
  normal: {
    backgroundColor: '#dae4eb',
  },
  addListButton: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(5),
    backgroundColor: R.colors.themeCol2,
    marginHorizontal: moderateScale(5),
    justifyContent: 'center',
  },
  addButtonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.white,
  },
});
