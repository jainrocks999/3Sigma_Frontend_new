/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {Integration, UserIntegration} from 'datalib/entity/systemIntegration';
import BackButton from 'library/common/BackButton';
import GAlert, {MessageType} from 'library/common/GAlert';
import GFlatList from 'library/common/GFlatList';
import GScreen from 'library/wrapper/GScreen';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Pressable, Text, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {typeFormat} from 'resources/icons/icons';
import R from 'resources/R';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  currentUserSelector,
  getUserIntegration,
  selectIntegrations,
  selectSubcriptionStatus,
  selectUserIntegration,
} from '../../store/slices/user.slice';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import WebViewModal from 'library/modals/WebViewModal';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ENVIRONMENT, WEBPAGE_URL} from '../../../env';
import SInfoTypeEnum from '../../models/common/sInfoType.enum';
import sInfoUtil from '../../utils/sInfo.util';
import {Nillable} from '../../models/custom.types';
import {User} from 'datalib/entity/user';
import SubscriptionTrialModal from 'library/modals/SubscriptionTrialModal';

export default function ManageIntegrationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const [isSubscriptionModal, setSubscriptionModal] = useState<boolean>(false);
  const integrations: Array<Integration> = useSelector((state: RootState) =>
    selectIntegrations(state),
  );
  const user: Nillable<User> = useSelector(currentUserSelector);

  const [integration, setIntegration] = useState<Integration | null>(null);
  const [showIntegrationModal, setShowIntegrationModal] =
    useState<boolean>(false);
  const [queyParams, setQueryParams] = useState<string>('');
  const [userToken, setUserToken] = useState<string>('');

  useEffect(() => {
    dispatch(getUserIntegration());
    loadUseToken();
  }, []);
  const loadUseToken = async () => {
    const storedJwt = await sInfoUtil.fetch(SInfoTypeEnum.JWT);
    setUserToken(storedJwt);
  };
  const facebookLogin = () => {
    LoginManager.logOut();
    LoginManager.setLoginBehavior('web_only');
    LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_metadata',
      'pages_manage_ads',
      'ads_management',
      'leads_retrieval',
    ]).then(
      function (result: any) {
        if (result.isCancelled) {
          GAlert('Login cancelled');

          setShowIntegrationModal(false);
        } else if (result.declinedPermissions.length > 0) {
          GAlert(
            'All the permissions are necessary in order to successfully integrate',
          );

          setShowIntegrationModal(false);
        } else {
          AccessToken.getCurrentAccessToken().then((data: any) => {
            setQueryParams(
              `accessToken=${data.accessToken.toString()}&fb_user_id=${
                data.userID
              }`,
            );
            setShowIntegrationModal(true);
          });
        }
      },
      function (error) {
        setShowIntegrationModal(false);
        GAlert(error);
      },
    );
  };
  const handleIntegrationPress = (_integration: Integration) => {
    if (isSubscribed || !_integration.isPremium) {
      setIntegration(_integration);
      if (_integration.key === 'csv') {
        navigation.navigate(ScreenNameEnum.UPLOAD_EXCEL_FILE_SCREEN);
      } else {
        setShowIntegrationModal(true);
      }
    } else {
      setSubscriptionModal(true);
    }
  };
  const handleURlChangeActions = (web_url: string) => {
    if (web_url === `${WEBPAGE_URL[ENVIRONMENT]}login/facebook`) {
      facebookLogin();
    } else if (
      web_url === `${WEBPAGE_URL[ENVIRONMENT]}integration/success` ||
      web_url === `${WEBPAGE_URL[ENVIRONMENT]}disconnect/success`
    ) {
      setQueryParams('');
      setShowIntegrationModal(false);
      //refresh Integrations
      switch (web_url) {
        case `${WEBPAGE_URL[ENVIRONMENT]}integration/success`:
          GAlert('Integration Successful', MessageType.SUCCESS);
          dispatch(getUserIntegration());
          break;
        case `${WEBPAGE_URL[ENVIRONMENT]}disconnect/success`:
          GAlert('Integration disconnected Successfully', MessageType.SUCCESS);
          dispatch(getUserIntegration());
          break;
      }
    }
  };
  return (
    <GScreen>
      <View style={styles.container}>
        <BackButton title="Manage Integration" />
        <View style={styles.listContainer}>
          <GFlatList
            data={integrations.filter(_i => _i.isDisplayable && _i.isActive)}
            renderItem={({item, index}: {item: Integration; index: number}) => (
              <IntegrationItem
                integration={item}
                key={index}
                onPress={handleIntegrationPress}
              />
            )}
          />
        </View>
      </View>
      <WebViewModal
        isVisible={showIntegrationModal}
        handleURlChangeActions={handleURlChangeActions}
        weburl={`${WEBPAGE_URL[ENVIRONMENT]}integration/${integration?.key}/${
          user?._id
        }?token=${userToken}${queyParams ? `&${queyParams}` : ''}`}
        onModalHide={setShowIntegrationModal}
      />
      {isSubscriptionModal && (
        <SubscriptionTrialModal
          screenTitle={'This integration'}
          isVisible={isSubscriptionModal}
          onModalHide={setSubscriptionModal}
        />
      )}
    </GScreen>
  );
}

const styles = StyleSheet.create({
  container: {padding: 20, backgroundColor: R.colors.bgCol},
  listContainer: {paddingVertical: 20, marginBottom: 40},
  itemContaienr: {
    backgroundColor: R.colors.white,
    marginBottom: 10,
    borderRadius: 10,
  },
  innerContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: R.colors.bgCol,
    borderRadius: 10,
  },
  titleContainer: {paddingHorizontal: 10},
  rightContainer: {
    justifyContent: 'center',
  },
  nameText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
  },
  descriptionText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.BOLD),
    color: R.colors.black,
  },
  summery: {
    ...R.generateFontStyle(FontSizeEnum.XXS, FontWeightEnum.REGULAR),
    color: R.colors.black,
  },
  imageStyle: {height: 40, width: 40},
  leftContainer: {flexDirection: 'row'},
});
const IntegrationItem = ({
  integration,
  onPress,
}: {
  integration: Integration;
  onPress: (integration: Integration) => void;
}) => {
  const userIntegration: Nillable<UserIntegration> = useSelector(
    (state: RootState) => selectUserIntegration(state, integration?._id),
  );
  const format = typeFormat(integration.key);
  return (
    <View style={styles.itemContaienr}>
      <Pressable
        android_ripple={R.darkTheme.grayRipple}
        onPress={() => onPress(integration)}>
        <View style={styles.innerContainer}>
          <View style={styles.leftContainer}>
            <View style={styles.imageContainer}>
              {format.iconType === 'image' ? (
                <Image
                  source={format.icon}
                  style={styles.imageStyle}
                  resizeMode={'contain'}
                />
              ) : (
                format.icon
              )}
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.nameText}>{integration.name}</Text>
              <Text
                style={[
                  styles.descriptionText,
                  {color: integration?.isPremium ? 'indigo' : 'green'},
                ]}>
                {integration?.isPremium ? 'Premium' : 'Free'}
              </Text>
              {/* {userIntegration && (
                <Text style={styles.summery}>Lead fetched 2 hours ago</Text>
              )} */}
            </View>
          </View>
          <View style={styles.rightContainer}>
            {userIntegration ? (
              <MaterialCommunityIcons
                name={'check-circle'}
                color={R.colors.green}
                size={30}
              />
            ) : null}
          </View>
        </View>
      </Pressable>
    </View>
  );
};
