import ScreenNameEnum from '../models/routes/screenName.enum';
import WelcomeSliderScreen from '../screens/WelcomeScreen/WelcomeSliderScreen';
import ContentHomeScreen from '../screens/HomeTabScreen/ContentHomeScreen';
import DashboadScreen from '../screens/DashboardScreen/DashboadScreen';
import FollowUpHomeScreen from '../screens/HomeTabScreen/FollowUpHomeScreen';
import LeadHomeScreen from '../screens/HomeTabScreen/LeadHomeScreen';
import SettingsScreen from '../screens/HomeTabScreen/SettingsScreen';

import BottomTabNavigator from '../navigators/BottomNavigation';
import LeadDetailsScreen from '../screens/LeadDetailsScreen/LeadDetailsScreen';
import ManageFilesScreen from '../screens/ManageContentScreen/ManageFilesScreen';
import ManageMessageScreen from '../screens/ManageContentScreen/ManageMessageScreen';
import ManagePageScreen from '../screens/ManageContentScreen/ManagePageScreen';
import ManageCustomizationScreen from '../screens/ManageCustomizationScreen/ManageCustomizationScreen';
import ManageDistributionScreen from '../screens/ManageDistributionScreen/ManageDistributionScreen';
import ManageActivityScreen from '../screens/ManageFollowUpScreen/ManageActivityScreen';
import ManageTaskScreen from '../screens/ManageFollowUpScreen/ManageTaskScreen';
import ManageIntegrationScreen from '../screens/ManageIntegrationScreen/ManageIntegrationScreen';
import ManageLeadScreen from '../screens/ManageLeadScreen/ManageLeadScreen';
import AddProductScreen from '../screens/ManageProductsScreen/AddProductScreen';
import AddQuotationScreen from '../screens/ManageQuotationScreen/AddQuotationScreen';
import AddTeamMember from '../screens/ManageTeamScreen/AddTeamMember';
import ManageTeamsAndMembers from '../screens/ManageTeamScreen/ManageTeamsAndMembers';
import OtpVerificationScreen from '../screens/RegistrationScreen/OtpVerificationScreen';
import UserRegistrationScreen from '../screens/RegistrationScreen/UserRegistrationScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen/SubscriptionScreen';
import UpdateUserProfile from '../screens/UserProfileScreen/UpdateUserProfile';
import AppPermissionScreen from '../screens/WelcomeScreen/AppPermissionScreen';
import SelectLanguageScreen from '../screens/WelcomeScreen/SelectLanguageScreen';
import UpdateBasicProfileScreen from '../screens/WelcomeScreen/UpdateBasicProfileScreen';

import QuotationListScreen from '../screens/ManageQuotationScreen/QuotationListScreen';
import UploadExcel from '../screens/HomeTabScreen/Components/UploadExcel';
import CustomizationItemListScreen from '../screens/ManageCustomizationScreen/CustomizationItemListScreen';
import UpdatePrefrenceValue from '../screens/ManageCustomizationScreen/UpdatePrefrenceValue';
import AddTeam from '../screens/ManageTeamScreen/AddTeam';
import ManageNoteScreen from '../screens/ManageFollowUpScreen/ManageNoteScreen';
import GeneralSettingScreen from '../screens/ManageSettingScreen/GeneralSettingScreen';
import NotificationScreen from '../screens/ManageSettingScreen/NotificationScreen';
import ManageDistributionRuleScreen from '../screens/ManageDistributionScreen/ManageDistributionRuleScreen';
import AutomationListScreen from '../screens/ManageAutomationScreen/AutomationListScreen';
import ManageAutomationRuleSceen from '../screens/ManageAutomationScreen/ManageAutomationRuleSceen';
import InvoiceListScreen from '../screens/ManageInvoiceScreen/InvoiceListScreen';
import ManageInvoiceScreen from '../screens/ManageInvoiceScreen/ManageInvoiceScreen';
import DealsListScreen from '../screens/ManageDealsScreen/DealsListScreen';
import ManageDealScreen from '../screens/ManageDealsScreen/ManageDealScreen';
import ProductListScreen from '../screens/ManageProductsScreen/ProductListScreen';
import ShareContentScreen from '../screens/ManageContentScreen/ShareContentScreen';
import QuotationDetailScreen from '../screens/ManageQuotationScreen/QuotationDetailScreen';
import DisclosureScreen from '../screens/HomeTabScreen/DisclosureScreen';
import MoreSettingsScreen from '../screens/HomeTabScreen/MoreSettingsScreen';
import CallLogsScreen from '../screens/CallLogScreen/CallLogsScreen';
import ActivityScreen from '../screens/ActivityScreen/ActivityScreen';
import ManageDigitalCardScreen from '../screens/DigitalCardScreen/ManageDigitalCardScreen';
import DigitalCardHomeScreen from '../screens/DigitalCardScreen/DigitalCardHomeScreen';
import ReferralsScreen from '../screens/ReferralsScreen/ReferralsScreen';
// import IniializeData from '../screens/WelcomeScreen/IniializeData';

const _routes = {
  REGISTRATION_ROUTE: [
    {
      name: ScreenNameEnum.REGISTRATION_SCREEN,
      Component: UserRegistrationScreen,
    },
    { name: ScreenNameEnum.ENTER_OTP_SCREEN, Component: OtpVerificationScreen },
    {
      name: ScreenNameEnum.WELCOME_SLIDER_SCREEN,
      Component: WelcomeSliderScreen,
    },
  ],
  FEATURE_ROUTE: [
    { name: ScreenNameEnum.HOME_TAB_SCREEN, Component: BottomTabNavigator },
    { name: ScreenNameEnum.LEAD_PROFILE_SCREEN, Component: LeadDetailsScreen },
    { name: ScreenNameEnum.CREATE_LEAD_SCREEN, Component: ManageLeadScreen },
    { name: ScreenNameEnum.UPDATE_LEAD_SCREEN, Component: ManageLeadScreen },
    { name: ScreenNameEnum.CREATE_TASK_SCREEN, Component: ManageTaskScreen },
    { name: ScreenNameEnum.UPDATE_TASK_SCREEN, Component: ManageTaskScreen },
    {
      name: ScreenNameEnum.CREATE_ACTIVITY_SCREEN,
      Component: ManageActivityScreen,
    },
    {
      name: ScreenNameEnum.UPDATE_ACTIVITY_SCREEN,
      Component: ManageActivityScreen,
    },
    {
      name: ScreenNameEnum.CREATE_MESSAGE_SCREEN,
      Component: ManageMessageScreen,
    },
    {
      name: ScreenNameEnum.CREATE_NOTE_SCREEN,
      Component: ManageNoteScreen,
    },
    {
      name: ScreenNameEnum.UPDATE_NOTE_SCREEN,
      Component: ManageNoteScreen,
    },
    { name: ScreenNameEnum.CREATE_FILE_SCREEN, Component: ManageFilesScreen },
    { name: ScreenNameEnum.CREATE_PAGE_SCREEN, Component: ManagePageScreen },
    { name: ScreenNameEnum.CREATE_PRODUCT_SCREEN, Component: AddProductScreen },
    { name: ScreenNameEnum.PRODUCT_LIST_SCREEN, Component: ProductListScreen },
    {
      name: ScreenNameEnum.CREATE_QUOTATION_SCREEN,
      Component: AddQuotationScreen,
    },
    {
      name: ScreenNameEnum.QUOTATION_DETAIL_SCREEN,
      Component: QuotationDetailScreen,
    },
    {
      name: ScreenNameEnum.UPDATE_USER_PROFILE_SCREEN,
      Component: UpdateUserProfile,
    },
    { name: ScreenNameEnum.SUBSCRIPTION_SCREEN, Component: SubscriptionScreen },
    {
      name: ScreenNameEnum.DISTRIBUTION_SETTING_SCREEN,
      Component: ManageDistributionScreen,
    },
    {
      name: ScreenNameEnum.MANAGE_INTEGRATION_SCREEN,
      Component: ManageIntegrationScreen,
    },
    {
      name: ScreenNameEnum.MANAGE_CUSTOMIZATION,
      Component: ManageCustomizationScreen,
    },
    { name: ScreenNameEnum.MY_TEAM_SCREEN, Component: ManageTeamsAndMembers },
    { name: ScreenNameEnum.ADD_TEAM_MEMBER_SCREEN, Component: AddTeamMember },
    { name: ScreenNameEnum.ADD_TEAM_SCREEN, Component: AddTeam },
    {
      name: ScreenNameEnum.SELECT_LANGUAGE_SCREEN,
      Component: SelectLanguageScreen,
    },
    {
      name: ScreenNameEnum.UPDATE_BASIC_PROFILE_SCREEN,
      Component: UpdateBasicProfileScreen,
    },
    {
      name: ScreenNameEnum.APP_PERMISSION_SCREEN,
      Component: AppPermissionScreen,
    },
    {
      name: ScreenNameEnum.QUOTATION_LIST_SCREEN,
      Component: QuotationListScreen,
    },
    {
      name: ScreenNameEnum.UPLOAD_EXCEL_FILE_SCREEN,
      Component: UploadExcel,
    },
    {
      name: ScreenNameEnum.CUSTOMIZABLE_IEEM_LIST,
      Component: CustomizationItemListScreen,
    },
    {
      name: ScreenNameEnum.UPDATE_PREFRENCE_VALUE,
      Component: UpdatePrefrenceValue,
    },
    {
      name: ScreenNameEnum.GENERAL_SETTINGS_SCREEN,
      Component: GeneralSettingScreen,
    },
    {
      name: ScreenNameEnum.MANAGE_NOTIFICATION_SCREEN,
      Component: NotificationScreen,
    },
    {
      name: ScreenNameEnum.UPDATE_DISTRIBUTION_RULE,
      Component: ManageDistributionRuleScreen,
    },
    {
      name: ScreenNameEnum.AUTOMATION_LIST_SCREEN,
      Component: AutomationListScreen,
    },
    {
      name: ScreenNameEnum.UPDATE_AUTOMATION_RULE_SCREEN,
      Component: ManageAutomationRuleSceen,
    },
    {
      name: ScreenNameEnum.INVOICE_LIST_SCREEN,
      Component: InvoiceListScreen,
    },
    {
      name: ScreenNameEnum.UPDATE_INVOICE_SCREEN,
      Component: ManageInvoiceScreen,
    },
    {
      name: ScreenNameEnum.DEALS_LIST_SCREEN,
      Component: DealsListScreen,
    },
    {
      name: ScreenNameEnum.UPDATE_DEAL_SCREEN,
      Component: ManageDealScreen,
    },
    {
      name: ScreenNameEnum.SETTINGS_HOME_SCREEN,
      Component: SettingsScreen,
    },
    {
      name: ScreenNameEnum.SHARE_CONTENT_SCREEN,
      Component: ShareContentScreen,
    },
    {
      name: ScreenNameEnum.DISCLOSURE_SCREEN,
      Component: DisclosureScreen,
    },
    {
      name: ScreenNameEnum.CALL_LOG_SCREEN,
      Component: CallLogsScreen,
    },
    {
      name: ScreenNameEnum.ACTIVITY_LIST_SCREEN,
      Component: ActivityScreen,
    },
    {
      name: ScreenNameEnum.DIGITAL_CARD_HOME_SCREEN,
      Component: DigitalCardHomeScreen,
    },
    {
      name: ScreenNameEnum.MANAGE_DIGITAL_CARD_SCREEN,
      Component: ManageDigitalCardScreen,
    },
    {
      name: ScreenNameEnum.REFERRAL_SCREEN,
      Component: ReferralsScreen,
    }
  ],
  BOTTOM_ROUTE: [
    {
      name: ScreenNameEnum.LEAD_HOME_SCREEN,
      Component: LeadHomeScreen,
      icon: 'home',
      title: 'Leads',
    },
    {
      name: ScreenNameEnum.CONTENT_HOME_SCREEN,
      Component: ContentHomeScreen,
      icon: 'text-box',
      title: 'Content',
    },
    {
      name: ScreenNameEnum.DASHBOARD_SCREEN,
      Component: DashboadScreen,
      icon: 'view-dashboard',
      title: 'Dashbaord',
    },
    {
      name: ScreenNameEnum.FOLLOW_UP_HOME_SCREEN,
      Component: FollowUpHomeScreen,
      icon: 'calendar-outline',
      title: 'Tasks',
    },
    {
      name: ScreenNameEnum.SETTINGS_TAB_SCREEN,
      Component: MoreSettingsScreen,
      icon: 'dots-horizontal',
      title: 'More',
    },
  ],
};

export default _routes;
