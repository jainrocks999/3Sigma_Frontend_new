import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import R from 'resources/R';

interface GCheckBoxProps {
  isChecked: boolean;
  onPress?: (isChecked: boolean) => void;
}
const GCheckBox = ({isChecked = false, onPress}: GCheckBoxProps) => {
  return (
    <View style={styles.container}>
      <Pressable
        android_ripple={R.darkTheme.grayRipple}
        style={styles.innerContainer}
        onPress={() => {
          onPress && onPress(!isChecked);
        }}>
        <View>
          <MaterialCommunityIcons
            name={isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'}
            color={R.colors.themeCol2}
            size={25}
          />
        </View>
      </Pressable>
    </View>
  );
};
export default GCheckBox;
const styles = StyleSheet.create({
  container: {
    height: 25,
    width: 25,
    overflow: 'hidden',
  },
  innerContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
