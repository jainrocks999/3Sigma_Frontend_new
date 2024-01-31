/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import GListItem from 'library/wrapper/GListItem';
import GScreen from 'library/wrapper/GScreen';
import React, {useContext, useState} from 'react';
import {FlatList, Image, Platform, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import AppImages from 'resources/images';
import R from 'resources/R';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import sInfoUtil from '../../utils/sInfo.util';
import SInfoTypeEnum from '../../models/common/sInfoType.enum';
import {AuthFunctions, AuthContext} from '../../store/contexts/AuthContext';
import BackButton from 'library/common/BackButton';
import {useDispatch, useSelector} from 'react-redux';
import {
  currentUserSelector,
  restoreUserStore,
  selectPermissions,
} from '../../store/slices/user.slice';
import {Nillable} from '../../models/custom.types';
import {User} from 'datalib/entity/user';
import {restoreLeadStore} from '../../store/slices/lead.slice';
import {RootDispatch} from '../../store/app.store';
import {restoreTaskStore} from '../../store/slices/task.slice';
import {restoreActivityStore} from '../../store/slices/activity.slice';
import {restoreQuotationStore} from '../../store/slices/quotation.slice';
import {restoreDashboardStore} from '../../store/slices/dashboard.slice';
import {restoreContentStore} from '../../store/slices/content.slice';
import {restoreListStore} from '../../store/slices/list.slice';
import UserApi from 'datalib/services/user.api';
import GAlert, {MessageType} from 'library/common/GAlert';
import {logout} from '../../store/slices/actions/User';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import GCheckBox from 'library/form-field/GCheckBox';
const SettingsScreen = () => {
  const navigation = useNavigation();
  const authContext: AuthFunctions = useContext(AuthContext);
  const user: Nillable<User> = useSelector(currentUserSelector);
  const permission: Array<string> = useSelector(selectPermissions);
  const [logoutConfirm, setConfirm] = useState<boolean>(false);
  const [isAllEmployee, setAllEmployee] = useState<boolean>(false);
  const [isAllDevices, setAllDevices] = useState<boolean>(false);

  const dispatch = useDispatch<RootDispatch>();
  const handleLogout = async () => {
    dispatch(
      logout({
        isAllEmployees: isAllEmployee,
        isAllDevice: isAllDevices,
      }),
    );
    sInfoUtil.remove(SInfoTypeEnum.JWT);
    sInfoUtil.remove(SInfoTypeEnum.USER_CONTEXT);
    await dispatch(restoreLeadStore());
    await dispatch(restoreTaskStore());
    await dispatch(restoreUserStore());
    await dispatch(restoreActivityStore());
    await dispatch(restoreDashboardStore());
    await dispatch(restoreQuotationStore());
    await dispatch(restoreContentStore());
    await dispatch(restoreListStore());

    authContext.signOut();
  };
  const handleExportData = async () => {
    const response = await new UserApi().exportLeads();
    if (response) {
      GAlert(
        'Request successfully received, we will send you a link to your registered email id.',
        MessageType.SUCCESS,
      );
    }
  };
  const settingsNavItems = [
    {
      id: 1,
      title: 'General Settings',
      subtitle: 'My account, Notification',
      icon: AppImages.userSetting,
      titleStyle: {fontSize: 18},
      notVisibleTo: ScreenNameEnum.GENERAL_SETTINGS_SCREEN,
      notVisibleToRole: [],
      onPress: () => {
        navigation.navigate(ScreenNameEnum.GENERAL_SETTINGS_SCREEN);
      },
    },
    {
      id: 2,
      title: 'Manage Integration',
      subtitle: 'Facebook, Zapier, Indiamart',
      icon: AppImages.integrationSetting,
      titleStyle: {fontSize: 18},
      notVisibleTo: 'manage_integration',
      notVisibleToRole: [],
      onPress: () => {
        navigation.navigate(ScreenNameEnum.MANAGE_INTEGRATION_SCREEN);
      },
    },
    {
      id: 3,
      title: 'Manage Subscription',
      subtitle: '',
      icon: AppImages.subscriptionSetting,
      notVisibleTo: 'manage_subscription',
      notVisibleToRole: [],
      onPress: () => {
        navigation.navigate(ScreenNameEnum.SUBSCRIPTION_SCREEN);
      },
    },
    {
      id: 4,
      title: 'Manage Team',
      subtitle: '',
      icon: AppImages.teamSetting,
      notVisibleTo: 'manage_teams',
      notVisibleToRole: [],
      onPress: () => {
        navigation.navigate(ScreenNameEnum.MY_TEAM_SCREEN);
      },
    },
    {
      id: 5,
      title: 'Customization',
      subtitle: '',
      icon: AppImages.personalisationSetting,
      notVisibleTo: 'manage_customization',
      notVisibleToRole: [],
      onPress: () => {
        navigation.navigate(ScreenNameEnum.MANAGE_CUSTOMIZATION);
      },
    },
    {
      id: 6,
      title: 'Manage Lead Distribution',
      subtitle: '',
      icon: AppImages.distributionSetting,
      notVisibleTo: 'manage_lead_distribution',
      notVisibleToRole: [],
      onPress: () => {
        navigation.navigate(ScreenNameEnum.DISTRIBUTION_SETTING_SCREEN);
      },
    },
    // {
    //   id: 5,
    //   title: 'Referral',
    //   subtitle: '',
    //   icon: AppImages.personalisationSetting,
    //   notVisibleTo: 'gift',
    //   notVisibleToRole: [],
    //   onPress: () => {
    //     navigation.navigate(ScreenNameEnum.REFERRAL_SCREEN);
    //   },
    // },

    // {
    //   id: 10,
    //   title: 'Book a demo',
    //   subtitle: '',
    //   icon: AppImages.referralSetting,
    //   notVisibleTo: ['employee'],
    //   onPress: () => {
    //     let URL = 'https://calendly.com/3sigmacrm/15min';
    //     Linking.openURL(URL);
    //   },
    // },
    {
      id: 11,
      title: 'Export data',
      subtitle: '',
      icon: AppImages.download,
      titleStyle: {color: 'red'},
      iconStyle: {},
      hideArrow: true,
      notVisibleTo: 'logout',
      notVisibleToRole: ['admin', 'employee', 'team_leader'],
      onPress: handleExportData,
    },
    {
      id: 12,
      title: 'Disclosure',
      subtitle: '',
      icon: AppImages.teamSetting,
      notVisibleTo: '',
      notVisibleToRole: [],
      onPress: () => {
        navigation.navigate(ScreenNameEnum.DISCLOSURE_SCREEN);
      },
    },
    {
      id: 13,
      title: 'Logout',
      subtitle: '',
      icon: AppImages.logoutSetting,
      titleStyle: {color: 'red'},
      iconStyle: {tintColor: 'red'},
      hideArrow: true,
      notVisibleTo: 'logout',
      notVisibleToRole: [],
      onPress: () => setConfirm(true),
    },
  ];
  const renderItem = ({item, index}: any) => {
    return (
      <SettingItem
        key={index}
        data={item}
        onPress={() => {
          item.onPress();
        }}
      />
    );
  };

  return (
    <GScreen>
      <View style={styles.container}>
        <BackButton title="Settings" />
        <Text style={styles.textLabel}>
          {user?.role?.displayName || 'Employee'} account for{' '}
          {user?.organization?.name || ''}
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tablePadding}
          data={settingsNavItems.filter(
            _i =>
              !permission.includes(_i.notVisibleTo.toLowerCase()) &&
              !_i.notVisibleToRole.includes(user?.role.name),
          )}
          renderItem={renderItem}
        />
      </View>
      <ConfirmationDialog
        showDialog={logoutConfirm}
        onConfirm={function (status: boolean): void {
          setConfirm(false);
          if (status) {
            handleLogout();
          }
        }}
        confirmationMessage={'Are you sure want to logout?'}>
        <View style={styles.checkboxBlock}>
          <View style={styles.checkboxContainer}>
            <GCheckBox
              isChecked={isAllDevices}
              onPress={() => setAllDevices(!isAllDevices)}
            />
            <Text style={styles.textLabel}>Logout from all devices</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <GCheckBox
              isChecked={isAllEmployee}
              onPress={() => setAllEmployee(!isAllEmployee)}
            />
            <Text style={styles.textLabel}>Logout all employees account</Text>
          </View>
        </View>
      </ConfirmationDialog>
    </GScreen>
  );
};
const SettingItem = ({data}: any) => {
  return (
    <GListItem onPress={data.onPress} innerStyle={styles.innerStyle}>
      <>
        {(!data.iconType || data.iconType === 'image') && (
          <Image
            source={data.icon}
            style={{
              ...styles.imageStyle,
              ...data.iconStyle,
            }}
          />
        )}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{data.title}</Text>
          {data.subtitle !== '' && (
            <Text numberOfLines={1} style={styles.subtitle}>
              {data.subtitle}
            </Text>
          )}
        </View>
        {!data.hideArrow && (
          <View style={styles.arrowContainer}>
            <MaterialCommunityIcons
              name={'chevron-right'}
              color={'black'}
              size={20}
            />
          </View>
        )}
      </>
    </GListItem>
  );
};
export default SettingsScreen;
const styles = StyleSheet.create({
  sectionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    color: R.colors.themeCol1,
    fontFamily: R.fonts.bold,
    fontSize: 36,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: R.colors.bgCol,
  },
  titleBlock: {marginLeft: 20, width: '80%'},
  title: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.black,
  },
  subtitle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.labelCol1,
  },
  imageStyle: {height: 18, width: 18, resizeMode: 'contain'},
  s3BtnLabel: {
    color: 'white',
  },
  textLabel: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.black,
    marginVertical: 10,
  },
  arrowContainer: {flex: 1, alignItems: 'flex-end', justifyContent: 'center'},
  shadow: {
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tablePadding: {paddingBottom: 20},
  innerStyle: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    minHeight: 58,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBlock: {
    marginBottom: 10,
    marginTop: -10,
  },
});
