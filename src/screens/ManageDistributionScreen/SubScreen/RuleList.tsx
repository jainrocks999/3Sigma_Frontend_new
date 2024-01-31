/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import HoverButton from 'library/buttons/HoverButton';
import GFlatList from 'library/common/GFlatList';
import GSwitch from 'library/common/GSwitch';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
import ScreenNameEnum from '../../../models/routes/screenName.enum';
import {RootDispatch, RootState} from '../../../store/app.store';
import {
  getDistributionRules,
  selectDustributionRules,
  updateDistributionRule,
} from '../../../store/slices/list.slice';
import {
  selectSubcriptionStatus,
  selectUserById,
  seletIntegration,
} from '../../../store/slices/user.slice';
import SubscriptionTrialModal from 'library/modals/SubscriptionTrialModal';
import ga from 'library/hooks/analytics';

export default function RuleList() {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const distributionRules = useSelector(selectDustributionRules);
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const [isSubscriptionModal, setSubscriptionModal] = useState<boolean>(false);
  const {fetchDistributionRuleStatus} = useSelector(
    (state: RootState) => state.list,
  );
  useEffect(() => {
    dispatch(getDistributionRules());
  }, []);
  const handleAddPress = async () => {
    if (isSubscribed) {
      await ga.logEvent('Add_New_Rule');
      navigation.navigate(ScreenNameEnum.UPDATE_DISTRIBUTION_RULE);
    } else {
      setSubscriptionModal(true);
    }
  };
  return (
    <View style={styles.container}>
      <GFlatList
        data={distributionRules || []}
        renderItem={({item}) => <RuleItem item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={
              fetchDistributionRuleStatus.status === ThunkStatusEnum.LOADING
            }
            onRefresh={() => dispatch(getDistributionRules())}
            title="Pull down to refresh"
            tintColor={R.colors.white}
            titleColor={R.colors.white}
            colors={['red', 'green', 'blue']}
          />
        }
        emptyMessage="0 Rules found"
      />
      <HoverButton right style={styles.hoverBtn} onPress={handleAddPress} />
      {isSubscriptionModal && (
        <SubscriptionTrialModal
          screenTitle={'Distribution rules'}
          isVisible={isSubscriptionModal}
          onModalHide={setSubscriptionModal}
        />
      )}
    </View>
  );
}
const RuleItem = ({item}: any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const [selected, setSelected] = useState(item?.status || false);
  const integration = useSelector((state: RootState) =>
    seletIntegration(state, item.integration),
  );
  const user = useSelector((state: RootState) =>
    selectUserById(state, item.createdBy),
  );
  const handleDistributionRuleStatus = async (status: boolean) => {
    await dispatch(
      updateDistributionRule({
        _id: item._id,
        status: status,
      }),
    );
    setSelected(status);
    //await dispatch(getDistributionRules());
  };
  return (
    <View style={styles.itemContainer}>
      <Pressable
        onPress={() =>
          navigation.navigate(ScreenNameEnum.UPDATE_DISTRIBUTION_RULE, {
            editItem: item,
          })
        }
        style={styles.itemInner}
        android_ripple={R.darkTheme.grayRipple}>
        <View style={styles.textContainer}>
          <View style={{flex: 2}}>
            <Text style={styles.nameText}>{item?.name}</Text>
            <Text style={styles.integrationText}>{integration?.name}</Text>
            <Text style={styles.createdText}>
              Created By : {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <View style={styles.deleteBtn}>
            <GSwitch
              isEnabled={selected}
              toggleSwitch={() => handleDistributionRuleStatus(!selected)}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.bgCol,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  hoverBtn: {
    ...Platform.select({
      ios: {bottom: 45},
      android: {bottom: 25},
    }),
    opacity: 1,
  },
  itemContainer: {
    backgroundColor: R.colors.white,
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 1,
  },
  imageStyle: {
    height: 30,
    width: 30,
  },
  imageContainer: {
    backgroundColor: R.colors.bgCol,
    padding: 5,
    borderRadius: 10,
  },
  itemInner: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  nameText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.black,
  },
  descriptionText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.black,
  },
  integrationText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.SEMI_BOLD),
    color: R.colors.black,
  },
  createdText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.labelCol1,
  },
  circleBtn: {
    borderRadius: 20,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    flex: 0.2,
  },
});
