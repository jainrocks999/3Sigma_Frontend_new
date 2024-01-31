import {useNavigation} from '@react-navigation/native';
import GFlatList from 'library/common/GFlatList';
import GScreen from 'library/wrapper/GScreen';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppImages from 'resources/images';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
import BackButton from '../../library/common/BackButton';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {styles} from './styles';

interface ItemT {
  title: string;
  type: string;
  description: string;
  icon?: string;
  image?: any;
}
export default function ManageCustomizationScreen() {
  const navigation = useNavigation();
  const customisationScreens: Array<ItemT> = [
    {
      title: 'Lead labels',
      type: 'labels',
      description: 'create custom labels',
      image: AppImages.labels,
    },
    {
      title: 'Lead Status',
      type: 'status',
      description: 'customize stages in sales pipeline',
      image: AppImages.status,
    },
    {
      title: 'Lead activities',
      type: 'activityType',
      description: 'create custom leads activities',
      image: AppImages.activityTab,
    },
    {
      title: 'Lead form fields',
      type: 'customForm',
      description: 'customize lead form fields ',
      icon: 'clipboard-text-outline',
    },
    {
      title: "Task's",
      type: 'taskType',
      description: 'create custom task types',
      image: AppImages.activityTab,
    },
  ];
  const renderItem = ({item, index}: {item: ItemT; index: number}) => (
    <TouchableOpacity
      style={styles.itemWrapper}
      key={index}
      onPress={() =>
        navigation.navigate(ScreenNameEnum.CUSTOMIZABLE_IEEM_LIST, {
          type: item.type,
          title: item.title,
          icon: item?.icon,
          image: item?.image,
        })
      }>
      <View style={styles.contentWrapper}>
        <View style={styles.iconWrapper}>
          {item.icon ? (
            <MaterialCommunityIcons
              name={item.icon}
              size={25}
              color={R.colors.themeCol2}
            />
          ) : (
            <Image
              source={item.image}
              style={[
                styles.labelsImageStyles,
                {tintColor: R.colors.themeCol2},
              ]}
              resizeMode={'contain'}
            />
          )}
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.descriptionText} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
      </View>
      <View style={styles.arrowNavigationWrapper}>
        <MaterialCommunityIcons
          name={'greater-than'}
          size={moderateScale(15)}
          color={R.colors.black}
        />
      </View>
    </TouchableOpacity>
  );
  return (
    <GScreen>
      <View style={styles.container}>
        <BackButton title={'Customization'} />
        <Text style={styles.tagline}>Customize CRM for your needs</Text>
        <GFlatList data={customisationScreens} renderItem={renderItem} />
      </View>
    </GScreen>
  );
}
