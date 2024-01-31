import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet, Platform
} from 'react-native';

import CountryPicker from 'react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import R from 'resources/R';
import Button from 'library/common/ButtonGroup';
import messaging from '@react-native-firebase/messaging';

import { styles } from './styles';
import AppImages from 'resources/images';
import SmsRetriever from 'react-native-sms-retriever';

import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import { moderateScale } from '../../resources/responsiveLayout';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import AuthenticationApi from 'datalib/services/authentication.api';
import AsyncStorage from '@react-native-community/async-storage';
import GAlert, { MessageType } from 'library/common/GAlert';
import { AuthFunctions, AuthContext } from '../../store/contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { RootDispatch } from '../../store/app.store';
import { setUserInStore } from '../../store/slices/user.slice';
import GScreen from 'library/wrapper/GScreen';
import Logo3d from 'library/common/Logo3d';
import AddButton from 'library/common/AddButton';
import { DEV_IOS_OAUTH } from '../../../env';
import ga from 'library/hooks/analytics';
import auth from '@react-native-firebase/auth';
const Login = () => {
  const phoneRef = React.useRef(null);
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const authContext: AuthFunctions = useContext(AuthContext);
  const dispatch = useDispatch<RootDispatch>();

  const [loader, setLoader] = useState<boolean>(false);
  const navigation = useNavigation();
  const [country, setCountry] = useState({
    callingCode: ['91'],
    cca2: 'IN',
    currency: ['INR'],
    flag: 'flag-in',
    name: 'India',
    region: 'Asia',
    subregion: 'Southern Asia',
  });
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  React.useEffect(() => {
    try {
      GoogleSignin.configure({
        iosClientId: DEV_IOS_OAUTH,
        webClientId:
          '322938904388-p7l4fso2n9g93n8irg3c9get69rn3vk4.apps.googleusercontent.com',
      });
    } catch (err) {
      console.log(err, 'err at config google');
    }
  }, []);

  const onPressFlag = () => {
    setIsCountryPickerVisible(!isCountryPickerVisible);
  };

  const selectCountry = (cty: any) => {
    if (phoneRef && phoneRef?.current) {
      phoneRef?.current?.selectCountry(cty.cca2.toLowerCase());
    }
    setIsCountryPickerVisible(false);
    setCountry({ ...country, cca2: cty.cca2 });
  };

  React.useEffect(() => {
    getDeviceToken();
    setTimeout(_onPhoneNumberPressed, 500);
  }, []);
  const _onPhoneNumberPressed = async () => {
    try {
      const phoneNumber = await SmsRetriever.requestPhoneNumber();
      if (phoneNumber) {
        setPhone(phoneNumber.split('+91')[1]);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };
  const signInWithPhoneNumber = async (phoneNumber: string) => {
    try {
      console.log(phoneNumber);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log(confirmation);
      setLoader(false);
      if (confirmation) {
        setConfirm(confirmation);
        navigation.navigate(ScreenNameEnum.ENTER_OTP_SCREEN, {
          deviceToken: deviceToken,
          country: `${country.callingCode[0]}`,
          phone: phone,
          confirm: confirmation,
        });
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    return enabled;
  }

  const getDeviceToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      await messaging().registerDeviceForRemoteMessages();
      await requestUserPermission();
      messaging()
        .getToken()
        .then((_token: string) => {
          AsyncStorage.setItem('token', _token);
          console.log('token', _token);
          setDeviceToken(_token);
        });
    } else {
      console.log('token 2', token);
      setDeviceToken(token);
    }
  };
  const onLogin = async () => {
    if (phone.trim().length === 0 || phone.trim().length < 9) {
      GAlert('Please enter a valid mobile number');
      return false;
    }
    setLoader(true);
    if (country && country.callingCode && country.callingCode[0] != 91) {
      return signInWithPhoneNumber(`+${country.callingCode[0]}${phone}`);
    }
    try {
      let authApi = new AuthenticationApi();
      let response = await authApi.sendOtp({
        otpType: 'sms',
        phone,
        countryCode: `${country.callingCode[0]}`,
      });
      setLoader(false);
      if (response.status) {
        navigation.navigate(ScreenNameEnum.ENTER_OTP_SCREEN, {
          deviceToken: deviceToken,
          country: `${country.callingCode[0]}`,
          phone: phone,
        });
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const googleLogin = async () => {
    setLoader(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      const body = {
        loginType: 'google',
        loggedFrom: 'mobile',
        deviceToken: deviceToken,
        identityToken: idToken,
      };
      console.log('google login', body);
      let response: any = await new AuthenticationApi().verifyOtp(body);
      if (response) {
        await ga.logEvent('Google_Login');
        authContext.signIn(response.isOnboardCompleted);
        await dispatch(setUserInStore(response));
      }
    } catch (error: any) {
      setLoader(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        console.log('operation (f.e. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('play services not available or outdated');
      } else {
        // some other error happened
        console.log('error at google login', error);
        GAlert('Error in authentication');
      }
    }
  };

  const facebookLogin = () => {
    try {
      setLoader(true);
      LoginManager.setLoginBehavior('web_only');
      LoginManager.logInWithPermissions(['public_profile', 'email']).then(
        function (result) {
          if (result.isCancelled) {
            setLoader(false);
            GAlert('Login Cancelled by user', MessageType.DANGER);
            console.log('Login cancelled');
          } else {
            AccessToken.getCurrentAccessToken().then(async (data: any) => {
              const body = {
                loggedFrom: 'mobile',
                // email: userInfo.email,
                identityToken: data.accessToken.toString(),
                loginType: 'facebook',
                deviceToken: deviceToken,
              };
              await ga.logEvent('Facebook_Login_Succes');
              let response: any = await new AuthenticationApi().verifyOtp(body);
              if (response) {
                setLoader(false);
                authContext.signIn(response.isOnboardCompleted);
                await dispatch(setUserInStore(response));
              } else {
                setLoader(false);
              }
            });
          }
        },
        function (error) {
          setLoader(false);
          GAlert('Login failed with errors', MessageType.DANGER);
          console.log('Login fail with error: ' + error);
        },
      );
    } catch (error) {
      setLoader(false);
      GAlert('Login failed with errors', MessageType.DANGER);
      console.log(error);
    }
  };

  const onAppleLogin = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const {
        user,
        fullName,
        email,
        nonce,
        identityToken,
        authorizationCode,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        // //console.log(nonce, identityToken);
      } else {
        // no token - failed sign-in?
      }
      if (user != null) {
        const body = {
          loginType: 'apple',
          loggedFrom: 'mobile',
          identityToken: identityToken,
        };   
        setLoader(true);
        let response: any = await new AuthenticationApi().verifyOtp(body);
        if (response) {
          await ga.logEvent('Apple_Login_Success');
          authContext.signIn(response.isOnboardCompleted);
          await dispatch(setUserInStore(response));
        }
        setLoader(false);
      }
    } catch (error) { 
      setLoader(false);
      GAlert('Login failed with errors', MessageType.DANGER);
      console.log(error);
    }
  };

  return (
    <GScreen loading={loader} hasKeyboardAvoidView>
      <View style={styles.mainConatiner}>
        <StatusBar backgroundColor={R.colors.bgCol} barStyle={'dark-content'} />
        <View style={styles.container}>
          <View style={[styles.sectionContainer, newStyles.flexRow]}>
            <Logo3d />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.s2Txt2}>Login via Phone Number</Text>
            <Text style={styles.s2Txt3}>
              We will send you OTP on this Phone number.
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.s3PhoneIpCnt}>
              <TouchableOpacity
                onPress={onPressFlag}
                style={styles.inputContainer}>
                <View style={styles.flOne}>
                  <PhoneInput
                    ref={phoneRef}
                    disabled={true}
                    flagStyle={{
                      height: moderateScale(22),
                      aspectRatio: moderateScale(1),
                      borderRadius: moderateScale(20),
                    }}
                    textStyle={styles.inputStyle}
                    initialCountry={country.cca2.toLowerCase()}
                  />
                </View>
                <MaterialCommunityIcons
                  name={'chevron-down'}
                  color={'white'}
                  size={moderateScale(16)}
                />
                <MaterialCommunityIcons
                  name={'chevron-down'}
                  color={'black'}
                  size={moderateScale(16)}
                  style={styles.iconStyle}
                />
                <View style={newStyles.picketContainer}>
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
                maxLength={10}
                keyboardType={'number-pad'}
                placeholder={'Enter Phone Number'}
                style={styles.s3PhoneIp}
                value={phone}
                placeholderTextColor={'#999999'}
                onChangeText={(_phone: string) => setPhone(_phone)}
              />
            </View>
            <AddButton title={'LOGIN'} onPress={onLogin} />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.s2Txt2}>Or Login using</Text>
            <View style={newStyles.flexRow}>
              <Button
                type={'icon'}
                btnStyle={styles.s4Btn}
                onPress={() => facebookLogin()}
                Icon={
                  <FontAwesome
                    name={'facebook-f'}
                    size={22}
                    color={R.colors.themeCol2}
                  />
                }
              />
              <Button
                type={'icon'}
                btnStyle={styles.s4Btn}
                onPress={() => googleLogin()}
                Icon={
                  <Image
                    source={AppImages.googleLogo}
                    style={styles.glogoStyle}
                  />
                }
              />
            </View>
            {
              Platform.OS == 'ios' &&
              <AppleButton
                buttonStyle={AppleButton.Style.BLACK}
                buttonType={AppleButton.Type.SIGN_IN}
                style={styles.appleBtnView}
                onPress={() => onAppleLogin()}
              />
            }
          </View>
        </View>
      </View>
    </GScreen>
  );
};

const newStyles = StyleSheet.create({
  flex: { flex: 1 },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'row',
  },
  picketContainer: {
    position: 'absolute',
    zIndex: 0,
  },
});

export default Login;
