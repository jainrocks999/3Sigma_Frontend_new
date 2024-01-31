/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  currentUserSelector,
  saveOnBoardingdata,
  setUserProfile,
} from '../../store/slices/user.slice';
import {User, UserProfile} from 'datalib/entity/user';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import GScreen from 'library/wrapper/GScreen';
import GAlert from 'library/common/GAlert';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {ONBOARDING_FORM} from '../../configs/constants';
import GModal from 'library/wrapper/GModal';
import Button from 'library/common/ButtonGroup';
import OtpContainer from '../RegistrationScreen/Components/OtpContainer';
import DynamicForm from 'library/form-field/DynamicForm';
import AuthenticationApi from 'datalib/services/authentication.api';
import UserApi from 'datalib/services/user.api';
import GCountDown from 'library/common/GCountDown';

export default function UpdateBasicProfileScreen() {
  const currentUser: User | null = useSelector((state: RootState) =>
    currentUserSelector(state),
  );
  const navigation = useNavigation();
  const [loader, setLoading] = useState(false);
  const [showTimer, setTimer] = useState(false);
  const [showPhoneVerifiyModal, setPhoneVerifyModal] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [userProfile, setUserProfileData] = useState<any>(
    {
      name: `${currentUser?.firstName || ''} ${
        currentUser?.lastName || ''
      }`.trim(),
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      countryCode: currentUser?.countryCode || '91',
    } || {},
  );

  const dispatch = useDispatch<RootDispatch>();
  const addBasicInformation = async () => {
    setLoading(true);
    let name = userProfile.name.split(' ');
    let InfoUpdate: UserProfile = {
      profile: {
        firstName: name[0],
        lastName: name[1] || '',
        phone: userProfile.phone,
        email: userProfile.email,
        countryCode: userProfile.countryCode || '91',
      },
      organization: {
        name: userProfile?.companyName || '',
        teamSize: userProfile.teamSize || 1,
        // phone: '',
        // currency: '',
        // timeZone: '',
        // website: '',
        // address: '',
        // description: '',
        // socialLinks: {
        //   linkedin: '',
        //   twitter: '',
        //   facebook: '',
        //   instagram: '',
        // },
      },
    };
    try {
      if (!InfoUpdate.profile.lastName && InfoUpdate.profile.lastName === '') {
        delete InfoUpdate.profile.lastName;
      }
      let response = await dispatch(saveOnBoardingdata(InfoUpdate));
      setLoading(false);
      if (response.meta.requestStatus === 'fulfilled') {
        await dispatch(setUserProfile());
        navigation.navigate(ScreenNameEnum.HOME_TAB_SCREEN);
      }
    } catch (error) {
      GAlert('Error while saving user data');
      setLoading(false);
    }
  };
  useEffect(() => {}, []);

  const handleCustomField = (item: any) => {
    if (item.field === 'phone') {
      const newUser = {
        ...userProfile,
        phone: item.value.phone,
        countryCode: item.value.country.callingCode[0] || '91',
      };
      setUserProfileData(newUser);
    } else {
      const newUser = {...userProfile};
      if (item && item.field) {
        newUser[item.field] = item.value;
      }
      setUserProfileData(newUser);
    }
  };
  useEffect(() => {
    if (otpCode.length === 6) {
      handleOtpPress();
    }
  }, [otpCode]);
  const handleOtpPress = async () => {
    try {
      if (otpCode.length === 6) {
        const payload = {
          phone: `${userProfile?.phone}`,
          otp: otpCode,
          countryCode: userProfile.countryCode || '91',
        };
        setLoading(true);
        const response = await new UserApi().verifyPhone(payload);
        setLoading(false);
        if (response) {
          addBasicInformation();
        } else {
          GAlert('Error while verifying mobile  number');
        }
      } else {
        GAlert('Enter 6 digit OTP code');
      }
    } catch (error) {
      try {
        if (
          error &&
          error?.response &&
          error?.response?.data &&
          error?.response?.data?.message === 'Mobile no. already verified'
        ) {
          addBasicInformation();
        }
        setLoading(false);
      } catch (_error) {
        console.log('_error', _error);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSaveBtnPress = async () => {
    if (!userProfile.name || userProfile.name === '') {
      GAlert('Name cannot be empty');
      return;
    }
    if (!userProfile.phone || userProfile.phone === '') {
      GAlert('Phone cannot be empty');
      return;
    }
    if (!userProfile.email || userProfile.email === '') {
      GAlert('Email cannot be empty');
      return;
    }
    if (!userProfile.companyName || userProfile.companyName === '') {
      GAlert('Company name cannot be empty');
      return;
    }
    if (!userProfile.teamSize || userProfile.teamSize === '') {
      GAlert('Please enter your team size');
      return;
    }
    if (currentUser?.isPhoneVerified) {
      addBasicInformation();
    } else {
      if (userProfile?.phone) {
        const payload = {
          otpType: 'sms',
          phone: userProfile?.phone,
          countryCode: userProfile.countryCode || '91',
        };
        const response = await new AuthenticationApi().sendOtp(payload);
        if (response.status) {
          setPhoneVerifyModal(true);
          setTimer(true);
        }
      } else {
        GAlert('Plesae enter a valid phone number');
      }
    }
  };
  const profileForm = [...ONBOARDING_FORM];
  profileForm[4].disable = false;
  if (currentUser?.extraDetails?.loginType === 'phone') {
    profileForm[1].disable = true;
    profileForm[2].disable = false;
  } else {
    profileForm[1].disable = false;
    profileForm[1].readOnly = false;
    if (currentUser?.email) {
      profileForm[2].disable = true;
    } else {
    }
  }
  profileForm[2].isVerifyBlock = false;
  profileForm[3].disable = false;
  return (
    <GScreen loading={loader}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headeText}>Get started with 3Sigma CRM</Text>
        <Text style={styles.tagline}>
          Please setup your profile to continue
        </Text>
      </View>
      <DynamicForm
        formFields={profileForm}
        fieldValues={userProfile}
        handleValueChange={handleCustomField}
        buttonPress={handleSaveBtnPress}
        containerStyle={styles.formContainer}
        buttonTitle={'Save & Continue'}>
        <Text style={styles.labelStyle}>
          You can change the information later in settings menu
        </Text>
      </DynamicForm>

      <GModal
        isVisible={showPhoneVerifiyModal}
        onModalHide={() => setPhoneVerifyModal(false)}>
        <View style={styles.modalView}>
          <View>
            <Text style={styles.modalHeader}>Enter OTP</Text>
            <OtpContainer onCodeChanged={setOtpCode} />
          </View>
          <View style={styles.countDownContainer}>
            {showTimer ? (
              <GCountDown
                until={60}
                onFinish={() => {
                  setTimer(false);
                }}
              />
            ) : (
              <TouchableOpacity onPress={handleSaveBtnPress}>
                <Text style={styles.resendText}>Resend</Text>
              </TouchableOpacity>
            )}
          </View>
          <Button label={'Verify OTP'} onPress={handleOtpPress} />
        </View>
      </GModal>
    </GScreen>
  );
}
const styles = StyleSheet.create({
  labelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
  },
  resendText: {
    color: R.colors.themeCol2,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    paddingVertical: 10,
  },
  countDownContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignItems: 'center',
  },
  headerWrapper: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  headeText: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.BOLD),
    marginTop: 10,
  },
  tagline: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.REGULAR),
    marginTop: 10,
  },
  contentContainer: {
    padding: 20,
  },
  buttonContaine: {
    padding: 20,
  },
  s3PhoneIpCnt: {
    width: '100%',
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
  },
  s3PhoneIp: {
    width: '70%',
    backgroundColor: 'white',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: 'black',
  },
  formContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  modalView: {
    backgroundColor: R.colors.white,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    minHeight: 150,
  },
  modalHeader: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
  },
  phoneEmailText: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
  },
});
