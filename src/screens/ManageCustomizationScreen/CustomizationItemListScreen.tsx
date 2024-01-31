import {useNavigation} from '@react-navigation/native';
import AddButton from 'library/common/AddButton';
import BackButton from 'library/common/BackButton';
import GAlert, {MessageType} from 'library/common/GAlert';
import GFlatList from 'library/common/GFlatList';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import GScreen from 'library/wrapper/GScreen';
import React, {useState} from 'react';
import {View, Image, Text, Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {ScaleDecorator} from 'react-native-draggable-flatlist';
import R from 'resources/R';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  selectPrefrence,
  updateUserPrefrence,
} from '../../store/slices/user.slice';
import {styles} from './styles';
import ga from 'library/hooks/analytics';

const CustomizationItemListScreen = (props: any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const prefrenceType = props.route.params.type;
  const screenTitle = props.route.params.title;
  const icon = props.route.params.icon;
  const image = props.route.params.image;
  const [deleteItem, setDeleteItem] = useState(null);
  const prefrences: Array<object> = useSelector((state: RootState) =>
    selectPrefrence(state, prefrenceType),
  );
  const handleEditItem = async (item: any) => {
    if (!item?.read_only && !item?.readOnly) {
      await ga.logEvent('Add_New_Prefrence', {
        title: screenTitle,
        type: prefrenceType,
      });
      navigation.navigate(ScreenNameEnum.UPDATE_PREFRENCE_VALUE, {
        item,
        title: screenTitle,
        type: prefrenceType,
      });
    }
  };
  const renderItem = ({item, drag, isActive}: any) => (
    <ScaleDecorator>
      <View style={styles.leadItemOuter}>
        <Pressable
          onPress={() => handleEditItem(item)}
          onLongPress={drag}
          disabled={isActive}
          android_ripple={R.darkTheme.grayRipple}>
          <View style={styles.leadItemWrapper}>
            <View style={styles.leadTextWrapper}>
              <View style={styles.iconWrapper}>
                {icon ? (
                  <MaterialCommunityIcons
                    name={icon}
                    size={25}
                    color={item.color || R.colors.themeCol2}
                  />
                ) : (
                  <Image
                    source={image}
                    style={[
                      styles.labelsImageStyles,
                      {tintColor: item.color || R.colors.themeCol2},
                    ]}
                    resizeMode={'contain'}
                  />
                )}
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.titleText} numberOfLines={2}>
                  {item?.name}
                </Text>
              </View>
            </View>
            {!item.read_only && !item?.readOnly ? (
              <Pressable
                onPress={() => setDeleteItem(item.value)}
                android_ripple={{color: 'gray', borderless: false, radius: 18}}>
                <View style={styles.circleBtn}>
                  <MaterialCommunityIcons
                    name={'trash-can-outline'}
                    size={25}
                    color={R.colors.IndianRed}
                  />
                </View>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      </View>
    </ScaleDecorator>
  );
  const onDeleteConirm = async (status: boolean) => {
    if (status) {
      let prefArr = prefrences.filter(
        (_item: any) => _item.value !== deleteItem,
      );
      const response = await dispatch(
        updateUserPrefrence({
          key: prefrenceType,
          value: prefArr,
        }),
      );
      setDeleteItem(null);
      if (response.meta.requestStatus === 'fulfilled') {
        GAlert('Successfully deleted.', MessageType.SUCCESS);
      }
    } else {
      setDeleteItem(null);
    }
  };
  const handleDragEnd = async (data: any) => {
    await dispatch(
      updateUserPrefrence({
        key: prefrenceType,
        value: data,
      }),
    );
  };
  return (
    <GScreen>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <BackButton title={`Customize ${screenTitle.toLowerCase()}`} />
          <Text style={styles.tagline}>Customize CRM for your needs</Text>
          <View>
            <GFlatList
              dragable={true}
              renderItem={renderItem}
              data={prefrences || []}
              keyExtractor={item => item.value}
              onDragEnd={handleDragEnd}
            />
          </View>
        </View>
        <View style={styles.btnContainer}>
          <AddButton
            onPress={() => handleEditItem(null)}
            title={`Add New ${
              screenTitle === 'Lead activities'
                ? 'Custom Activity'
                : screenTitle
            }`}
          />
        </View>
      </View>
      <ConfirmationDialog
        showDialog={deleteItem ? true : false}
        onConfirm={onDeleteConirm}
        confirmationMessage={'Are you sure want to delete?'}
      />
    </GScreen>
  );
};
export default CustomizationItemListScreen;
