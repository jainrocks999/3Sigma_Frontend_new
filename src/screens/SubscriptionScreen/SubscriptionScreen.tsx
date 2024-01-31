/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  CreateSubscriptionPayload,
  Subscription,
} from 'datalib/entity/subscription';
import BackButton from 'library/common/BackButton';
import GSwitch from 'library/common/GSwitch';
import YouTubeLinkIcon from 'library/common/YouTubeLinkIcon';
import WebViewModal from 'library/modals/WebViewModal';
import GScreen from 'library/wrapper/GScreen';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import AppImages from 'resources/images';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
import IncrementDecrementCounter from '../../library/common/IncrementDecrementCounter';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {Nillable} from '../../models/custom.types';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  cancelUserSubscription,
  createStripeSubscription,
  createUserSubscription,
  getSubscriptionPlan,
  getUserSubscription,
} from '../../store/slices/actions/Subscription';
import {
  currentUserSelector,
  selectSubcriptionStatus,
  selectSubscriptionPlan,
} from '../../store/slices/user.slice';
import RazorpayCheckout, {CheckoutOptions} from 'react-native-razorpay';
import GAlert, {MessageType} from 'library/common/GAlert';
import {PAYMENT_PROVIDER, RAZORPAR_KEY} from '../../../env';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import moment from 'moment';
import {User} from 'datalib/entity/user';
import {UserSubscription} from 'datalib/entity/subscription';
import ga from 'library/hooks/analytics';
import {PaymentProviderEnum} from '../../models/consts/environment.enum';

var subscriptionBenefits = [
  {
    title: 'Dashboard Screen',
    icon: 'view-dashboard',
  },
  {
    title: 'Premium integration like Facebook',
    icon: 'connection',
  },
  {
    title: 'Desktop web app',
    icon: 'monitor',
  },
  {
    title: 'Send Quotation',
    icon: 'currency-usd',
  },
  {
    title: 'Remove 3Sigma branding',
    image: 'logo',
  },
  {
    title: 'Priority Support',
    icon: 'face-agent',
  },
];
export default function SubscriptionScreen(props) {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const dispatch = useDispatch<RootDispatch>();
  const [planType, setPlanType] = useState(false);
  const [isPreview, setPreview] = useState(false);
  const user: Nillable<User> = useSelector(currentUserSelector);
  const subscription = user?.subscription || null;
  const subscriptionPlan: Array<Subscription> | null = useSelector(
    (state: RootState) => selectSubscriptionPlan(state),
  );
  const [showConfirm, setConfirmation] = useState<boolean>(false);
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const [selectedPlan, setSelPlan] = useState<Nillable<Subscription>>(null);
  const [subscribedUser, setSubsUser] = useState<number>(
    isSubscribed ? subscription?.quantity || 1 : 1,
  );
  const {fetchSubscriptionStatus, createSubscriptionStatus} = useSelector(
    (state: RootState) => state.user,
  );
  useEffect(() => {
    if (!subscriptionPlan || subscriptionPlan.length <= 0) {
      dispatch(getSubscriptionPlan());
    }
  }, []);
  useEffect(() => {
    console.log(
      'subscriptionPlan',
      subscriptionPlan,
      user?.subscription,
      isSubscribed,
    );
    if (subscriptionPlan && subscriptionPlan.length) {
      if (
        user?.subscription &&
        isSubscribed &&
        subscription?.subscriptionPlan
      ) {
        const splan = subscription?.subscriptionPlan || null;
        let plan = subscriptionPlan.find(_i => _i._id === splan);
        setSelPlan(plan || null);
      } else {
        const _planType = planType ? 'yearly' : 'monthly';
        let plan = subscriptionPlan.find(_i => _i.period === _planType);
        setSelPlan(plan || null);
      }
    }
  }, [subscriptionPlan.length, props.navigation.isFocused()]);

  useEffect(() => {
    if (subscriptionPlan && subscriptionPlan.length) {
      const _planType = planType ? 'yearly' : 'monthly';
      let plan = subscriptionPlan.find(_i => _i.period === _planType);
      setSelPlan(plan || null);
    }
  }, [planType, props.navigation.isFocused()]);
  const setPerUserPrice = (planPeriod: string) => {
    let plan = subscriptionPlan?.find(_i => _i.period === planPeriod);
    if (plan) {
      return (plan.amount || 0) * subscribedUser;
    } else {
      return 0;
    }
  };

  const handleCancelSubscription = async (
    confirm: boolean,
    subscriptionId: Nillable<string> = null,
  ) => {
    setConfirmation(false);
    if (confirm) {
      try {
        await ga.logEvent('Cancel_Subscription');
        const response = await dispatch(
          cancelUserSubscription({
            id: subscriptionId ? subscriptionId : subscription?._id || '',
            isImmediately: true,
          }),
        );
        if (response.meta.requestStatus === 'fulfilled') {
          GAlert('Subscription Cancelled successfully', MessageType.SUCCESS);
        }
      } catch (error) {}
    }
  };
  const handleCreateSubscription = async () => {
    if (
      subscription &&
      subscription.status !== 'cancelled' &&
      subscription?.subscriptionId
    ) {
      await ga.logEvent('Create_Subscription');
      initialisePayment(subscription?.subscriptionId || '');
    } else {
      const payload: CreateSubscriptionPayload = {
        isTrail: false,
        plan: selectedPlan?._id,
        quantity: subscribedUser,
      };
      await ga.logEvent('Create_Subscription');
      const response = await dispatch(createUserSubscription(payload));
      if (response.meta.requestStatus === 'fulfilled' && response.payload) {
        const _subscription: UserSubscription = response?.payload;
        if (_subscription?.subscriptionId) {
          initialisePayment(_subscription?.subscriptionId);
        } else {
          GAlert('Subscription not created');
        }
      }
    }
  };
  const handleStripeSubscription = async () => {
    const payload: CreateSubscriptionPayload = {
      plan: selectedPlan?._id,
      quantity: subscribedUser,
    };
    await ga.logEvent('Create_Subscription');
    const response = await dispatch(createStripeSubscription(payload));
    console.log(response.payload);
    if (response.meta.requestStatus === 'fulfilled' && response.payload) {
      if (response?.payload) {
        await initializePaymentSheet(response?.payload);
      } else {
        GAlert('Subscription not created');
      }
    }
  };
  const initializePaymentSheet = async ({
    clientSecret,
    ephemeralKey,
    customer,
  }: any) => {
    try {
      const response = await initPaymentSheet({
        merchantDisplayName: '3Sigma',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: `${user?.firstName} ${user?.lastName}`,
        },
      });
      if (response.error) {
        GAlert(`Error code: ${response.error.code}, ${response.error.message}`);
      } else {
        openPaymentSheet();
      }
    } catch (error) {
      console.log('Error in opening payment sheet', error);
    }
  };
  const openPaymentSheet = async () => {
    const response = await presentPaymentSheet();

    if (response.error) {
      GAlert(`Error code: ${response.error.code}, ${response.error.message}`);
    } else {
      dispatch(getUserSubscription());
    }
  };
  const handleStartTrial = async () => {
    const payload: CreateSubscriptionPayload = {
      isTrail: true,
      plan: selectedPlan?._id,
    };
    await ga.logEvent('Start_7_Day_Trial');
    const response = await dispatch(createUserSubscription(payload));
    if (response.meta.requestStatus === 'fulfilled') {
      GAlert('7 days trial activaetd successfully', MessageType.SUCCESS);
    }
  };
  const initialisePayment = (subscriptionId: string) => {
    var options: CheckoutOptions = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: RAZORPAR_KEY,
      amount: selectedPlan?.amount || 0,
      name: '3Sigma',
      // order_id: 'order_DslnoIgkIDL8Zt', //Replace this with an order_id created using Orders API.
      subscription_id: subscriptionId, //Replace this with an order_id created using Orders API.
      prefill: {
        email: user?.email,
        contact: user?.phone,
        name: `${user?.firstName} ${user?.lastName}`,
      },
      theme: {color: '#53a20e'},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        GAlert('Payment success', MessageType.SUCCESS);
        dispatch(getUserSubscription());
      })
      .catch(error => {
        GAlert(
          'Payment failed, cancelling subscription...',
          MessageType.DANGER,
        );
        handleCancelSubscription(true);
      });
  };
  const calculateEndDate = (date, plan) => {
    if (plan.period === 'monthly') {
      return moment(date).add(30, 'days').format('MMM YYYY');
    } else {
      return moment(date).add(365, 'days').format('MMM YYYY');
    }
  };

  return (
    <GScreen
      loading={
        fetchSubscriptionStatus.status === ThunkStatusEnum.LOADING ||
        createSubscriptionStatus.status === ThunkStatusEnum.LOADING
      }>
      <View style={styles.container}>
        <View style={styles.backBtnWrapper}>
          <BackButton title={'Manage Subscriptions'} />
          <YouTubeLinkIcon screenName={ScreenNameEnum.SUBSCRIPTION_SCREEN} />
        </View>
        {selectedPlan ? (
          <>
            <View
              style={
                planType
                  ? styles.planSelectionWrapperSolid
                  : styles.planSelectionWrapper
              }>
              <Text
                style={[
                  styles.planSelectionTitle,
                  {color: planType ? R.colors.white : R.colors.black},
                ]}>
                {selectedPlan?.name}
              </Text>
              <View style={styles.planWrapper}>
                <Text
                  style={[
                    styles.planName,
                    {
                      color: planType ? R.colors.white : R.colors.black,
                      marginRight: 10,
                    },
                  ]}>
                  Monthly
                </Text>
                <GSwitch
                  isEnabled={planType}
                  toggleSwitch={() => setPlanType(!planType)}
                />
                <View style={{marginLeft: 10}}>
                  <Text
                    style={[
                      styles.planName,
                      {color: planType ? R.colors.white : R.colors.black},
                    ]}>
                    Yearly
                  </Text>
                  <Text
                    style={[
                      styles.saveUpTo,
                      {color: planType ? R.colors.white : R.colors.black},
                    ]}>
                    save upto 50%
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.planName,
                  {color: planType ? R.colors.white : R.colors.black},
                ]}>
                {selectedPlan?.amount} per user
              </Text>
              <Text
                style={[
                  styles.planName,
                  {color: planType ? R.colors.white : R.colors.black},
                ]}>
                {isSubscribed ? (
                  <Text>
                    Valid till{' '}
                    <Text style={styles.expName}>
                      {user?.subscription?.isTrail
                        ? moment(subscription.trailStartedAt || '')
                            .add(7, 'days')
                            .format('DD MMM YYYY')
                        : calculateEndDate(
                            user?.subscription?.createdAt,
                            selectedPlan,
                          )}
                    </Text>
                  </Text>
                ) : (
                  <Text>You are currently on free plan</Text>
                )}
              </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {subscriptionBenefits.map((item, index) => (
                <View style={styles.planItemWrapper} key={index}>
                  {item.icon ? (
                    <MaterialCommunityIcons
                      name={item.icon}
                      color={R.colors.themeCol2}
                      size={25}
                    />
                  ) : (
                    <Image source={AppImages.logo} style={styles.imageStyle} />
                  )}
                  <Text style={styles.planTitle}>{item.title} </Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.planTypeWrapper}>
              <Text style={[styles.planName, {color: R.colors.white}]}>
                Number of users
              </Text>
              <IncrementDecrementCounter onCountUpdate={setSubsUser} />
            </View>
            <View style={styles.priceContainer}>
              <View style={styles.planAmountWrapper}>
                <View style={styles.planTextWrapper}>
                  <View style={styles.policyContainer}>
                    <Text style={styles.priceText}>
                      ₹{setPerUserPrice(selectedPlan?.period || '')}
                    </Text>
                    <Text style={styles.durationText}>
                      /{selectedPlan.interval != 1 ? selectedPlan.interval : ''}
                      {selectedPlan.period === 'yearly' ? 'Year' : ' Month'}
                    </Text>
                  </View>
                  <Text style={styles.saveUpTo}>
                    Pay ₹
                    {selectedPlan.period === 'yearly'
                      ? (
                          setPerUserPrice(selectedPlan.period || 'month') / 12
                        ).toFixed(2)
                      : (
                          setPerUserPrice(selectedPlan.period || 'month') * 4
                        ).toFixed(2)}
                    /{selectedPlan.period === 'yearly' ? 'month' : 'year'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={
                    isSubscribed && !subscription?.isTrail
                      ? styles.cancelButton
                      : styles.planButton
                  }
                  onPress={() =>
                    isSubscribed && !subscription?.isTrail
                      ? setConfirmation(true)
                      : PAYMENT_PROVIDER === PaymentProviderEnum.RAZOR_PAY
                      ? handleCreateSubscription()
                      : handleStripeSubscription()
                  }>
                  <Text style={styles.buttonText}>
                    {isSubscribed && !subscription?.isTrail
                      ? 'Cancel'
                      : 'Buy subscription'}
                  </Text>
                </TouchableOpacity>
              </View>
              {!isSubscribed && !user?.isTrailTaken ? (
                <View>
                  <TouchableOpacity
                    style={styles.trialButton}
                    onPress={handleStartTrial}>
                    <Text style={styles.buttonText}>Start 7 day trial</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {subscription?.isTrail ? (
                <View>
                  <TouchableOpacity
                    style={styles.cancelTrialButton}
                    onPress={() => setConfirmation(true)}>
                    <Text style={styles.buttonText}>Cancel trial</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {/* <View style={styles.policyContainer}>
                <Text style={styles.descText}>
                  15 days moneyback guarantee.{' '}
                </Text>
                <TouchableOpacity onPress={() => setPreview(true)}>
                  <Text style={styles.policyText}>Read our policy</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </>
        ) : (
          <View style={styles.noPlanWrapper}>
            <Text style={styles.noPlanMessage}>
              {fetchSubscriptionStatus.status === ThunkStatusEnum.LOADING
                ? 'Loading Subscription status'
                : 'Plan not available'}
            </Text>
          </View>
        )}
      </View>
      <WebViewModal
        weburl={'https://www.3sigmacrm.com/refund-policy/'}
        isVisible={isPreview}
        handleURlChangeActions={function (weburl: string): void {}}
        onModalHide={setPreview}
      />
      <ConfirmationDialog
        showDialog={showConfirm}
        onConfirm={handleCancelSubscription}
        confirmationMessage={'Are you sure want cancel your subscription?'}
      />
    </GScreen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  planSelectionWrapperSolid: {
    backgroundColor: R.colors.themeCol5,
    padding: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: moderateScale(15),
    borderRadius: moderateScale(20),
    minHeight: moderateScale(183),
    color: R.colors.white,
  },
  planSelectionWrapper: {
    backgroundColor: R.colors.white,
    padding: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: moderateScale(15),
    borderRadius: moderateScale(20),
    minHeight: moderateScale(183),
    color: R.colors.black,
  },
  planSelectionTitle: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  planWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  backBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  policyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  planName: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
  },
  expName: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.green,
  },
  noPlanMessage: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
  },

  planItemWrapper: {
    backgroundColor: R.colors.white,
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginBottom: moderateScale(10),
    flexDirection: 'row',
  },

  planTitle: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
    marginLeft: 10,
  },
  imageStyle: {
    height: 25,
    width: 25,
  },

  planAmountWrapper: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  planButton: {
    backgroundColor: R.colors.themeCol5,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: R.colors.IndianRed,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    minWidth: 120,
    alignItems: 'center',
  },
  trialButton: {
    backgroundColor: R.colors.themeCol2,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    minWidth: 120,
    alignItems: 'center',
  },
  cancelTrialButton: {
    backgroundColor: R.colors.IndianRed,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    minWidth: 120,
    alignItems: 'center',
  },
  priceContainer: {
    backgroundColor: R.colors.white,
    marginTop: -25,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
  },
  planTypeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 15,
    marginTop: 20,
    backgroundColor: R.colors.themeCol5,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 35,
  },
  buttonText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.white,
  },
  planTextWrapper: {
    paddingLeft: moderateScale(10),
    justifyContent: 'space-between',
  },
  priceText: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.BOLD),
    color: R.colors.themeCol2,
  },
  durationText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.textCol1,
  },
  saveUpTo: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.MEDIUM),
    color: R.colors.textCol1,
  },
  policyText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.BOLD),
    color: R.colors.themeCol2,
  },
  descText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  noPlanWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
