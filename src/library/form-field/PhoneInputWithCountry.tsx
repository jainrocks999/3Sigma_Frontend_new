/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from 'resources/responsiveLayout';
import CountryPicker, {Country} from 'react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

const PhoneInputWithCountry = (props: any) => {
  const phoneRef = React.useRef(null);
  const [phone, setPhone] = useState(props.default_value || '');
  const [country, selectCountry] = useState<Country>({
    callingCode: ['91'],
    cca2: 'IN',
    currency: ['INR'],
    flag: 'flag-in',
    name: 'India',
    region: 'Asia',
    subregion: 'Southern Asia',
  });
  useEffect(() => {
    if (phone && phone !== '') {
      props.handleValueChange &&
        props.handleValueChange({
          value: {
            phone,
            country,
          },
          field: props.value,
        });
    }
  }, [phone, country]);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const onPressFlag = () => {
    setIsCountryPickerVisible(!isCountryPickerVisible);
  };
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
        style={props.readOnly ? styles.s3PhoneIpReadOnly : styles.s3PhoneIpCnt}>
        <TouchableOpacity onPress={onPressFlag} style={styles.inputContainer}>
          <View style={styles.flOne}>
            <PhoneInput
              ref={phoneRef}
              disabled={true}
              flagStyle={{
                height: moderateScale(22),
                width: moderateScale(22),
                borderRadius: moderateScale(20),
              }}
              textStyle={styles.inputStyle}
              initialCountry={country.cca2.toLowerCase()}
            />
          </View>
          <MaterialCommunityIcons
            name={'chevron-down'}
            color={'black'}
            size={moderateScale(16)}
            style={styles.iconStyle}
          />
          <View style={styles.picketContainer}>
            <CountryPicker
              onSelect={_country => selectCountry(_country)}
              onClose={() => setIsCountryPickerVisible(false)}
              translation="common"
              withCallingCodeButton={false}
              withFilter={true}
              withModal={true}
              visible={isCountryPickerVisible}
              countryCode={'IN'}
              renderFlagButton={() => <View></View>}
            />
          </View>
        </TouchableOpacity>
        <TextInput
          maxLength={16}
          keyboardType={'number-pad'}
          placeholder={'Enter Phone Number'}
          style={styles.s3PhoneIp}
          value={phone}
          editable={!props.readOnly}
          onChangeText={(_phone: string) => setPhone(_phone)}
          placeholderTextColor={'#999999'}
        />
      </View>
    </View>
  );
};
export default PhoneInputWithCountry;
const styles = StyleSheet.create({
  s3PhoneIpCnt: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: R.colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
  },
  s3PhoneIpReadOnly: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: R.colors.InputGrey3,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
  },
  s3PhoneIp: {
    width: '70%',
    color: 'black',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
  },
  s3Btn: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: R.colors.themeCol1,
  },
  s3BtnLabel: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.SEMI_BOLD),
    color: 'white',
  },

  inputContainer: {
    paddingLeft: 16,
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  picketContainer: {
    position: 'absolute',
    zIndex: 0,
  },
  iconStyle: {position: 'absolute', right: moderateScale(1)},
  flOne: {flex: 1},
  inputStyle: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: 'black',
  },
  labelStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
