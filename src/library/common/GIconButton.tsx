import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import R from 'resources/R';
interface GIconButton {
  onPress: Function;
  icon: any;
  iconColor?: string;
  size?: number;
  style?: object;
}
const GIconButton = ({
  onPress,
  icon,
  iconColor = '#000',
  size = 20,
  style = {},
}: GIconButton) => {
  const Icon = icon;
  return (
    <View style={[styles.iconOuter, style]}>
      <Pressable
        onPress={() => onPress && onPress()}
        style={styles.iconButton}
        android_ripple={{color: R.darkTheme.regular, borderless: true}}>
        <Icon height={size} width={size} color={iconColor} />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  iconOuter: {
    borderRadius: 30,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default GIconButton;
