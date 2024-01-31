import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { moderateScale } from 'resources/responsiveLayout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { FontSizeEnum, FontWeightEnum } from 'resources/fonts/fontStyles';
import R from 'resources/R';
import DateTimePicker from 'react-native-modal-datetime-picker';

const DateSelect = (props: any) => {
  let { onChangeText } = props;
  const [isVisible, setIsVisible] = useState(false)
  const [date, setDate] = useState(
    props.defaultValue ? new Date(props.defaultValue) : null,
  );

  const onChange = (event: any, selectedDate: any) => {
    if (event.type !== 'dismissed') {
      const currentDate = selectedDate;
      setDate(currentDate);
      onChangeText(currentDate);
    }
  };

  const showMode = (currentMode: any) => {
    const options: any = {
      value: date || new Date(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    };
    if (props.disableFutureDate) {
      options.maximumDate = new Date();
    }

    if (props.disablePastDate) {
      options.minimumDate = new Date();
    }
    DateTimePickerAndroid.open(options);
  };

  const showDatepicker = () => {
    setIsVisible(true)
  };

  const onConfirm = (date: any) => {
    onChangeText(date)
    setDate(date)
    setIsVisible(false)
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={showDatepicker} style={styles.inputStyle}>
          <TextInput
            style={styles.inputText}
            multiline={false}
            numberOfLines={1}
            placeholder={'Select date'}
            editable={false}
            placeholderTextColor={'#999999'}
            value={date ? moment(date).format('DD MMM YYYY') : ''}
          />
          <MaterialCommunityIcons
            name={'calendar'}
            color={R.colors.themeCol2}
            size={moderateScale(20)}
          />
        </TouchableOpacity>
      </View>
      <DateTimePicker
        mode='date'
        isVisible={isVisible}
        onConfirm={onConfirm}
        onCancel={() => setIsVisible(false)}
        is24Hour={true}
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
  inputStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default DateSelect;
