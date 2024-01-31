/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Switch} from 'react-native-switch';
interface GSwitchProps {
  isEnabled: boolean;
  toggleSwitch: (isEnabled: boolean) => void;
}
const GSwitch = ({isEnabled, toggleSwitch}: GSwitchProps) => {
  return (
    <Switch
      value={isEnabled}
      onValueChange={val => toggleSwitch && toggleSwitch(val)}
      activeText={''}
      inActiveText={''}
      circleSize={20}
      circleBorderWidth={3}
      backgroundActive={'#88bdfa'}
      backgroundInactive={'#667387'}
      innerCircleStyle={{borderColor: isEnabled ? '#88bdfa' : '#667387'}}
    />
  );
};
export default GSwitch;
