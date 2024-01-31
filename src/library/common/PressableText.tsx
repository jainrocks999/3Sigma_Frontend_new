import React, {FunctionComponent, PropsWithChildren} from 'react';
import {ColorValue, Pressable, PressableProps, TextProps} from 'react-native';
import R from 'resources/R';
import GText from './GText';

// Add props as required in future
interface PressableTextProps extends Omit<TextProps, 'onPress'> {
  disabled?: boolean;
  pressableStyle?: PressableProps['style'];
  rippleColor?: ColorValue;
  rippleRadius?: number;
  textStyle?: TextProps['style'];
  onPress: PressableProps['onPress'];
}

// TODO: Pressable text width should fit content
const PressableText: FunctionComponent<
  PropsWithChildren<PressableTextProps>
> = ({
  children,
  disabled,
  numberOfLines,
  pressableStyle,
  rippleColor,
  rippleRadius,
  textStyle,
  onPress,
}: PropsWithChildren<PressableTextProps>) => (
  <Pressable
    android_ripple={
      !disabled
        ? {
            borderless: false,
            color: rippleColor || R.colors.gray400,
            radius: rippleRadius,
          }
        : void 0
    }
    onPress={!disabled ? onPress : () => void 0}
    style={pressableStyle}>
    <GText
      style={[textStyle, disabled ? {opacity: 0.4} : {}]}
      numberOfLines={numberOfLines ?? 1}>
      {children}
    </GText>
  </Pressable>
);

export default PressableText;
