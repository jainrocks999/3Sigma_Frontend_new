/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import R from 'resources/R';
import GModal from '../wrapper/GModal';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../common/ButtonGroup';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {
  CreateSubscriptionPayload,
  Subscription,
} from 'datalib/entity/subscription';
import {
  createUserSubscription,
  getSubscriptionPlan,
} from '../../store/slices/actions/Subscription';
import {RootDispatch, RootState} from '../../store/app.store';
import {useDispatch, useSelector} from 'react-redux';
import GAlert, {MessageType} from '../common/GAlert';
import {
  currentUserSelector,
  selectSubscriptionPlan,
} from '../../store/slices/user.slice';
import {Nillable} from '../../models/custom.types';
import {User} from 'datalib/entity/user';
import ga from '../hooks/analytics';

interface SubscriptionTrialModalProps {
  isVisible: boolean;
  screenTitle: string;
  onModalHide: (isVisible: boolean) => void;
}
const iconSize = 30;
const SubscriptionTrialModal = ({
  isVisible,
  onModalHide,
  screenTitle = 'Dashboard',
}: SubscriptionTrialModalProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const user: Nillable<User> = useSelector(currentUserSelector);
  const subscriptionPlan: Array<Subscription> | null = useSelector(
    (state: RootState) => selectSubscriptionPlan(state),
  );
  useEffect(() => {
    if (!subscriptionPlan || subscriptionPlan.length === 0) {
      dispatch(getSubscriptionPlan());
    }
  }, []);
  const handleTrial = async () => {
    if (subscriptionPlan && subscriptionPlan.length) {
      const payload: CreateSubscriptionPayload = {
        isTrail: true,
        plan: subscriptionPlan[0]?._id,
      };
      await ga.logEvent('Start_7_Day_Trial');
      const response = await dispatch(createUserSubscription(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        GAlert('7 days trial activaetd successfully', MessageType.SUCCESS);
        onModalHide(false);
      }
    }
  };
  return (
    <GModal isVisible={isVisible} onModalHide={() => onModalHide(false)}>
      <View style={styles.modalContainer}>
        <View>
          <Text style={styles.headerText}>{screenTitle} is locked</Text>
          <Text style={styles.subHeader}>
            You are currently on free version of 3Sigma CRM
          </Text>
        </View>
        <View>
          <Text style={styles.subHeading}>
            Buy a premium planto get access to
          </Text>
          <View style={styles.paragroup}>
            <MaterialCommunityIcons
              name={'circle'}
              size={iconSize}
              color={R.colors.red}
            />
            <Text style={styles.paragraph} numberOfLines={2}>
              Access call, task, lead, reports on dashboard
            </Text>
          </View>
          <View style={styles.paragroup}>
            <MaterialCommunityIcons
              name={'circle'}
              size={iconSize}
              color={R.colors.red}
            />
            <Text style={styles.paragraph}>Integrate premium lead sources</Text>
          </View>
          <View style={styles.paragroup}>
            <MaterialCommunityIcons
              name={'circle'}
              size={iconSize}
              color={R.colors.red}
            />
            <Text style={styles.paragraph}>Add team members</Text>
          </View>
          <View style={styles.paragroup}>
            <MaterialCommunityIcons
              name={'circle'}
              size={iconSize}
              color={R.colors.red}
            />
            <Text style={styles.paragraph}>
              Setup automatic-lead assignment
            </Text>
          </View>
        </View>
        {user && user.role && user?.role?.name === 'super_admin' ? (
          <View>
            {!user?.isTrailTaken ? (
              <Button
                onPress={handleTrial}
                label={'Start 7 day trial'}
                buttonStyle={styles.trialBtnStyle}
              />
            ) : null}
            <Button
              label={'Buy Plan'}
              buttonStyle={styles.buyBtnStyle}
              onPress={() => {
                onModalHide(false);
                navigation.navigate(
                  ScreenNameEnum.SUBSCRIPTION_SCREEN as never,
                );
              }}
            />
          </View>
        ) : (
          <Text style={styles.bottomHeader}>
            Contact your super admin to upgrade premium
          </Text>
        )}
      </View>
    </GModal>
  );
};
export default SubscriptionTrialModal;
const styles = StyleSheet.create({
  modalContainer: {
    minHeight: '40%',
    backgroundColor: R.colors.white,
    padding: 20,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
  trialBtnStyle: {backgroundColor: R.colors.green, marginTop: 20},
  buyBtnStyle: {backgroundColor: R.colors.themeCol5, marginTop: 20},
  container: {
    justifyContent: 'center',
    height: Dimensions.get('screen').height,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingtext: {
    textAlign: 'center',
  },
  headerText: {
    ...R.generateFontStyle(FontSizeEnum.XL4, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  subHeading: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.labelCol1,
    marginBottom: 10,
  },
  paragraph: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.REGULAR),
    color: R.colors.labelCol1,
    marginLeft: 5,
    width: '90%',
    flexWrap: 'wrap',
  },
  subHeader: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.REGULAR),
    color: R.colors.labelCol1,
    marginBottom: 5,
  },
  bottomHeader: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.REGULAR),
    color: R.colors.labelCol1,
    marginTop: 10,
  },
  paragroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
