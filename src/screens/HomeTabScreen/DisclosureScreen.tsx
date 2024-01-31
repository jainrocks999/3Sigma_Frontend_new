import GListItem from 'library/wrapper/GListItem';
import GScreen from 'library/wrapper/GScreen';
import React from 'react';
import {
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import AppImages from 'resources/images';
import R from 'resources/R';
import BackButton from 'library/common/BackButton';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user.slice';
import {Nillable} from '../../models/custom.types';
import {User} from 'datalib/entity/user';
const DisclosureScreen = () => {
  const user: Nillable<User> = useSelector(currentUserSelector);

  const settingsNavItems = [
    {
      id: 1,
      title: 'Privacy Policy',
      subtitle: '',
      icon: AppImages.referralSetting,
      notVisibleTo: [],
      onPress: () => {
        let URL = 'https://www.3sigmacrm.com/privacy/';
        Linking.openURL(URL);
      },
    },
    {
      id: 2,
      title: 'Terms of use',
      subtitle: '',
      icon: AppImages.referralSetting,
      notVisibleTo: [],
      onPress: () => {
        let URL = 'https://www.3sigmacrm.com/terms-of-use/';
        Linking.openURL(URL);
      },
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
          data={settingsNavItems}
          renderItem={renderItem}
        />
      </View>
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
export default DisclosureScreen;
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
});
