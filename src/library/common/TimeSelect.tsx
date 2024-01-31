import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, { useState } from 'react';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { moderateScale } from '../../resources/responsiveLayout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { FontSizeEnum, FontWeightEnum } from 'resources/fonts/fontStyles';
import R from 'resources/R';

const TimeSelect = (props: any) => {
  let { onChangeText, defaultValue } = props;
  const [isVisible, setIsVisible] = useState(false)
  const [date, setDate] = useState(
    defaultValue ? new Date(defaultValue) : null,
  );

  const onChange = (_event: any, selectedDate: any) => {
    if (_event.type !== 'dismissed') {
      const currentDate = selectedDate;
      setDate(currentDate);
      onChangeText(currentDate);
    }
  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: date || new Date(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showTimepicker = () => {
    setIsVisible(true)
  };

  const onConfirm = (time: any) => {
    onChangeText(time)
    setDate(time)
    setIsVisible(false)
  }

  return (
    <>
      <View>
        <Text style={styles.labelStyle}>
          {props.label}
          <Text style={{ color: R.colors.IndianRed }}>
            {props.isRequired ? '*' : ''}
          </Text>
        </Text>
        <View style={styles.container}>
          <TouchableOpacity onPress={showTimepicker} style={styles.inputStyle}>
            <TextInput
              style={styles.inputText}
              multiline={false}
              editable={false}
              numberOfLines={1}
              placeholder={'Select ' + props.label || 'time'}
              placeholderTextColor={'#999999'}
              value={date ? moment(date).format('hh:mm a') : ''}
            />
            <MaterialCommunityIcons
              name={'clock-time-three-outline'}
              color={R.colors.themeCol2}
              size={moderateScale(20)}
            />
          </TouchableOpacity>
        </View>
      </View>
      <DateTimePicker
        mode='time'
        isVisible={isVisible}
        onConfirm={onConfirm}
        onCancel={() => setIsVisible(false)}
      />
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: moderateScale(50),
    paddingRight: moderateScale(9),
    borderRadius: moderateScale(10),
    marginTop: 10,
  },
  inputText: {
    height: moderateScale(43),
    margin: moderateScale(5),
    padding: moderateScale(10),
    textAlignVertical: 'top',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol1,
    flex: 1,
  },
  labelStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 10,
  },
  inputStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TimeSelect;
