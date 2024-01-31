/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import GListItem from 'library/wrapper/GListItem';
import GScreen from 'library/wrapper/GScreen';

import {FlatList, Image, Platform, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import AppImages from 'resources/images';
import BackButton from 'library/common/BackButton';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import {AuthFunctions, AuthContext} from '../../store/contexts/AuthContext';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch} from '../../store/app.store';
import {Nillable} from '../../models/custom.types';
import {
  currentUserSelector,
  deleteMyAccount,
} from '../../store/slices/user.slice';
import {User} from 'datalib/entity/user';

const GeneralSettingScreen = () => {
  const navigation = useNavigation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const authContext: AuthFunctions = useContext(AuthContext);
  const user: Nillable<User> = useSelector(currentUserSelector);
  const dispatch = useDispatch<RootDispatch>();
  const settingsNavItems = [
    {
      id: 1,
      title: 'My Account',
      subtitle: 'Manage Account information',
      icon: AppImages.userSettings,
      titleStyle: {fontSize: 18},
      notVisibleTo: [],
      onPress: () => {
        navigation.navigate(ScreenNameEnum.UPDATE_USER_PROFILE_SCREEN);
      },
    },
    {
      id: 2,
      title: 'Notifications',
      subtitle: 'Leads, Activities Notification',
      icon: AppImages.integrationSetting,
      titleStyle: {fontSize: 18},
      notVisibleTo: [],
      onPress: () => {
        navigation.navigate(ScreenNameEnum.MANAGE_NOTIFICATION_SCREEN);
      },
    },

    {
      id: 11,
      title: 'Delete My Account',
      subtitle: '',
      icon: AppImages.logoutSetting,
      titleStyle: {color: 'red'},
      iconStyle: {tintColor: 'red'},
      hideArrow: true,
      notVisibleTo: ['admin', 'employee', 'team_leader'],

      onPress: () => setShowDeleteConfirm(true),
    },
  ];
  const renderItem = ({item}: any) => {
    return (
      <SettingItem
        data={item}
        onPress={() => {
          item.onPress();
        }}
      />
    );
  };

  const keyExtractor = ({id}: any) => {
    return id.toString();
  };
  const handleDeleteAccount = async (status: boolean) => {
    setShowDeleteConfirm(false);
    if (status) {
      const response = await dispatch(deleteMyAccount());
      if (response.meta.requestStatus === 'fulfilled') {
        authContext.signOut();
      }
    }
  };
  return (
    <GScreen>
      <View style={styles.container}>
        <BackButton title="General Settigns" />
        <Text style={styles.textLabel}>
          {user?.role?.displayName || 'Owner'} account for{' '}
          {user?.organization?.name || ''}
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tablePadding}
          data={settingsNavItems.filter(
            _i => !_i.notVisibleTo.includes(user?.role.name),
          )}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
      <ConfirmationDialog
        showDialog={showDeleteConfirm}
        onConfirm={handleDeleteAccount}
        confirmationMessage={'Are you sure want to delete your account?'}
      />
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
            style={[styles.imageStyle, data.iconStyle]}
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
export default GeneralSettingScreen;
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
    paddingTop: 10,
    backgroundColor: R.colors.bgCol,
  },
  titleBlock: {marginLeft: 20, width: '80%'},
  title: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.black,
  },
  subtitle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.black,
  },
  imageStyle: {height: 18, width: 18, resizeMode: 'contain'},
  textLabel: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
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
  tablePadding: {paddingTop: 20, paddingBottom: 20},
  innerStyle: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
