import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  currentUserSelector,
  setUserProfile,
  updteUserProfile,
} from '../../store/slices/user.slice';
import {User} from 'datalib/entity/user';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import GScreen from 'library/wrapper/GScreen';
import GAlert, {MessageType} from 'library/common/GAlert';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import BackButton from 'library/common/BackButton';
import DynamicForm from 'library/form-field/DynamicForm';
import {USER_PROFILE_FORM} from '../../configs/constants';
import GModal from 'library/wrapper/GModal';
import Button from 'library/common/ButtonGroup';
import UserApi from 'datalib/services/user.api';
import Helper from '../../utils/helper';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';

const UpdateUserProfile = () => {
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const [showEmailVerifiyModal, setEmailVerifyModal] = useState<boolean>(false);

  const currentUser: User | null = useSelector(currentUserSelector);
  const useProfileStatus = useSelector((state: RootState) => state.user);

  const [userProfile, setUserProfileObject] = useState<any>({
    name: `${currentUser?.firstName} ${currentUser?.lastName || ''}`,
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    countryCode: currentUser?.countryCode || '',
    companyName: currentUser?.organization?.name,
  });

  const addBasicInformation = async () => {
    if (!userProfile?.name || userProfile?.name === '') {
      GAlert('Name cannot be empty');
      return;
    }

    if (!userProfile.phone || userProfile.phone === '') {
      GAlert('Contact number cannot be empty');
      return;
    }
    if (!userProfile.email || userProfile.email === '') {
      GAlert('Email cannot be empty');
      return;
    }
    // if (!userProfile.companyName || userProfile.companyName === '') {
    //   GAlert('Company name cannot be empty');
    //   return;
    // }

    const name = Helper.splitName(userProfile.name);

    let payload = {
      firstName: name.firstName,
      lastName: name.lastName || '',
      phone: userProfile.phone,
      email: userProfile.email,
      countryCode: userProfile.countryCode || '91',
    };
    try {
      if (!payload.lastName && payload.lastName === '') {
        delete payload.lastName;
      }

      let response = await dispatch(updteUserProfile(payload));
      if (response.payload) {
        await dispatch(setUserProfile());
        navigation.navigate(ScreenNameEnum.HOME_TAB_SCREEN);
      }
    } catch (error) {}
  };

  const handleCustomField = (item: {field: string; value: any}) => {
    if (item.field === 'phone') {
      const newUser = {
        ...userProfile,
        phone: item.value.phone,
        countryCode: item.value.country.callingCode[0] || '91',
      };
      setUserProfileObject(newUser);
    } else {
      const newUser = {...userProfile};
      if (item && item.field) {
        newUser[item.field] = item.value;
      }
      setUserProfileObject(newUser);
    }
  };
  const handleActionPress = () => {
    setEmailVerifyModal(true);
  };
  const handleEmailVerification = () => {
    new UserApi().sendEmailLink(currentUser?.email);
    setEmailVerifyModal(false);
    GAlert(
      'Email verification link sent your your email ID',
      MessageType.SUCCESS,
    );
  };
  const userForm = [...USER_PROFILE_FORM];
  userForm[2].verify = currentUser?.isEmailVerified || false;
  userForm[2].readOnly = currentUser?.isEmailVerified || false;
  userForm[1].readOnly = true;
  userForm[3].readOnly = true;
  userForm[4].disable = true;
  userForm[3].disable = false;
  return (
    <GScreen loading={useProfileStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.contianer}>
        <BackButton title="Update Profile" />
        <DynamicForm
          formFields={userForm}
          fieldValues={userProfile}
          handleValueChange={handleCustomField}
          buttonPress={addBasicInformation}
          containerStyle={styles.formContainer}
          onActionBtnPress={handleActionPress}
        />
      </View>
      <GModal
        isVisible={showEmailVerifiyModal}
        onModalHide={() => setEmailVerifyModal(false)}>
        <View style={styles.modalView}>
          <View>
            <Text style={styles.modalHeader}>
              We will send a verification link to your registered email{' '}
              <Text style={styles.phoneEmailText}>{currentUser?.email}.</Text>
            </Text>
          </View>
          <Button
            label={'Send Verification Link'}
            onPress={handleEmailVerification}
          />
        </View>
      </GModal>
    </GScreen>
  );
};
export default UpdateUserProfile;
const styles = StyleSheet.create({
  tagline: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    marginTop: 10,
  },
  contianer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    backgroundColor: R.colors.bgCol,
  },
  formContainer: {
    marginTop: 20,
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
