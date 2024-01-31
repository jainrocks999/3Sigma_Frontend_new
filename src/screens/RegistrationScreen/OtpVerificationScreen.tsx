/* eslint-disable react-hooks/exhaustive-deps */
import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import auth from '@react-native-firebase/auth';
import {goBack} from '../../navigators/NavigationService';
import OtpContainer from './Components/OtpContainer';
import AuthenticationApi from '../../datalib/services/authentication.api';
import {AuthContext, AuthFunctions} from '../../store/contexts/AuthContext';
import R from 'resources/R';
import {RootDispatch} from '../../store/app.store';
import {useDispatch} from 'react-redux';
import {setUserInStore} from '../../store/slices/user.slice';
import {User} from 'datalib/entity/user';
import GAlert, {MessageType} from 'library/common/GAlert';
import GScreen from 'library/wrapper/GScreen';
import BackButton from 'library/common/BackButton';

import TermsConditionModal from 'library/modals/TermsConditionModal';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {moderateScale} from 'resources/responsiveLayout';
import Button from 'library/common/ButtonGroup';
import GCountDown from 'library/common/GCountDown';
import {
  getHash,
  startOtpListener,
  removeListener,
} from 'react-native-otp-verify';
import ga from 'library/hooks/analytics';

const OtpVerificationScreen: FunctionComponent = props => {
  const [showTimerPicker, setShowTimerPicker] = useState(true);
  const [loader, setLoader] = useState(false);
  const [viewTermsModal, setTermsModal] = useState(false);
  const [code, setCode] = useState('');
  const dispatch = useDispatch<RootDispatch>();

  let {deviceToken, country, phone, confirm} = props?.route?.params;
  const authContext: AuthFunctions = useContext(AuthContext);
  useEffect(() => {
    setTimeout(() => {
      setShowTimerPicker(false);
    }, 1000 * 60);
    return () => {
      setShowTimerPicker(false);
    };
  }, []);
  useEffect(() => {
    if (code.length === 6) {
      verifyOtp();
    }
  }, [code]);
  // using methods
  useEffect(() => {
    getHash()
      .then((hash: string) => {
        // use this hash in the message.
        console.log('hash');
      })
      .catch(console.log);

    startOtpListener(message => {
      try {
        const otp = /(\d{6})/g.exec(message)[1];
        setCode(otp);
      } catch (error) {}
    });
    return () => removeListener();
  }, []);
  const onAuthStateChanged = async (user: any) => {
    try {
      console.log('firebase user ---', user);
      if (user) {
        setLoader(true);
        let authApi = new AuthenticationApi();
        const payload = {
          loginType: 'firebase',
          deviceToken,
          loggedFrom: 'mobile',
          identityToken: user._user.uid,
        };
        console.log(payload);
        const response: User = await authApi.verifyOtp(payload);
        if (response) {
          await ga.logEvent('Otp_Verification_Success');
          await dispatch(setUserInStore(response));
          setLoader(false);
          authContext.signIn(response.isOnboardCompleted);
        }
      }
    } catch (error) {
      ga.logEvent('Error_in_Otp_verification');
      setLoader(false);
    }
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  const verifyOtp = async () => {
    if (code.length <= 5) {
      GAlert('Please enter valid OTP');
      return false;
    }
    if (confirm) {
      try {
        return await confirm.confirm(code);
      } catch (error) {
        console.log('Invalid code.');
      }
    } else {
      try {
        setLoader(true);
        let authApi = new AuthenticationApi();
        const payload = {
          loginType: 'phone',
          deviceToken,
          phone: `${phone}`,
          otp: code,
          countryCode: country,
          loggedFrom: 'mobile',
        };
        const response: User = await authApi.verifyOtp(payload);
        if (response) {
          await ga.logEvent('Otp_Verification_Success');
          await dispatch(setUserInStore(response));
          setLoader(false);
          authContext.signIn(response.isOnboardCompleted);
        }
      } catch (error) {
        ga.logEvent('Error_in_Otp_verification');
        setLoader(false);
      }
    }
  };
  const handleResendOtp = async (type = 'sms') => {
    if (!showTimerPicker) {
      let authApi = new AuthenticationApi();
      let response = await authApi.sendOtp({
        otpType: type,
        phone,
        countryCode: `+${country}`,
      });
      setShowTimerPicker(true);
      if (response.status) {
        GAlert(
          type === 'voice'
            ? 'OTP code send via call. Please make sure to recieve call'
            : 'OTP sent successfully',
          MessageType.SUCCESS,
        );
      }
    }
  };
  return (
    <GScreen loading={loader} hasKeyboardAvoidView>
      <View style={styles.container}>
        <View>
          <View style={styles.sectionContainer}>
            <BackButton />
            <Text style={styles.s2Txt2}>Enter 6-digit OTP code</Text>
            <View style={styles.numberContainer}>
              <Text style={styles.phoneText}>
                Sent to {country} {phone}
              </Text>
              <TouchableOpacity onPress={() => goBack()}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <OtpContainer
              onCodeChanged={(_code: string) => {
                setCode(_code.trim());
              }}
            />
            <View style={styles.reSend}>
              {showTimerPicker ? (
                <>
                  <Text style={showTimerPicker ? styles.s4Txt4 : styles.s4Txt2}>
                    Auto reading OTP
                  </Text>
                  <GCountDown
                    until={60}
                    onFinish={() => {
                      setShowTimerPicker(false);
                    }}
                  />
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => handleResendOtp('sms')}>
                    <Text
                      style={showTimerPicker ? styles.s4Txt4 : styles.s4Txt2}>
                      Resend
                    </Text>
                  </TouchableOpacity>
                  <Text style={{...styles.s4Txt3}}> | </Text>
                  <TouchableOpacity onPress={() => handleResendOtp('voice')}>
                    <Text
                      style={showTimerPicker ? styles.s4Txt4 : styles.s4Txt2}>
                      Get Otp on Call
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <TouchableOpacity
            onPress={() => {
              let URL = 'https://www.3sigmacrm.com/privacy/';
              Linking.openURL(URL);
            }}>
            <Text style={styles.termsText}>
              By continuting you agree to the{' '}
              <Text style={styles.termsTextLnk}>
                Terms and conditions & privacy policy
              </Text>
            </Text>
          </TouchableOpacity>

          <Button
            label={'CONTINUE'}
            buttonStyle={styles.btnStyle}
            labelStyle={styles.labelStyle}
            onPress={verifyOtp}
          />
        </View>
      </View>
      <TermsConditionModal
        isVisible={viewTermsModal}
        onModalHide={setTermsModal}
      />
    </GScreen>
  );
};
export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.bgCol,
    flex: 1,
    justifyContent: 'space-between',
  },
  digitStyle: {
    backgroundColor: R.colors.bgCol,
    height: 30,
  },
  s4Txt4: {
    color: 'grey',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    marginTop: 3,
    marginLeft: 5,
  },
  phoneText: {
    color: 'grey',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
  },
  termsText: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginBottom: 20,
    textAlign: 'center',
  },
  termsTextLnk: {
    color: R.colors.themeCol2,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  sectionContainer: {
    paddingVertical: 10,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  s4Txt2: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol2,
    marginTop: 3,
  },
  changeText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol2,
    marginLeft: 20,
  },
  s4Txt3: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.SEMI_BOLD),
    color: '#000',
    width: 20,
    textAlign: 'center',
  },
  s2Txt2: {
    marginTop: moderateScale(20),
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.BOLD),
    textAlign: 'left',
  },
  reSend: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  numberContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  btnStyle: {
    borderRadius: 10,
    backgroundColor: R.colors.themeCol2,
    width: '100%',
  },
  labelStyle: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  counter: {
    flexDirection: 'row',
  },
});
