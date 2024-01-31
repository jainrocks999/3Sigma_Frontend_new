/* eslint-disable react-hooks/exhaustive-deps */
import {View, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import UserGroup from './Components/UserGroup';
import GFlatList from 'library/common/GFlatList';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  getTeamMembers,
  selectAllEmployees,
  selectSubcriptionStatus,
} from '../../store/slices/user.slice';
import {User} from 'datalib/entity/user';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import R from 'resources/R';
import HoverButton from 'library/buttons/HoverButton';
import SubscriptionTrialModal from 'library/modals/SubscriptionTrialModal';
import ga from 'library/hooks/analytics';

const TeamMembers = (props: any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const [isSubscriptionModal, setSubscriptionModal] = useState<boolean>(false);
  const teamMembers = useSelector((state: RootState) =>
    selectAllEmployees(state),
  );
  const fetchTeamMemberStatus = useSelector(
    (state: RootState) => state.user.fetchTeamMemberStatus,
  );

  useEffect(() => {
    if (isSubscribed) {
      dispatch(getTeamMembers({page: 1, perPage: 100}));
    }
  }, []);
  useEffect(() => {
    if (!isSubscribed && props.navigation.isFocused()) {
      setSubscriptionModal(true);
    }
  }, [props.navigation.isFocused()]);
  const renderItem = ({item, index}: {item: User; index: number}) => {
    return (
      <UserGroup
        key={index}
        item={item}
        onPress={(_item: User) =>
          navigation.navigate(ScreenNameEnum.ADD_TEAM_MEMBER_SCREEN, {
            isEdit: true,
            editItem: _item,
          })
        }
      />
    );
  };
  const handleCreateTeamMember = async () => {
    if (isSubscribed) {
      await ga.logEvent('Add_New_Team_Member');
      navigation.navigate(ScreenNameEnum.ADD_TEAM_MEMBER_SCREEN);
    } else {
      setSubscriptionModal(true);
    }
  };
  return (
    <View style={styles.container}>
      <GFlatList
        data={teamMembers || []}
        renderItem={renderItem}
        emptyMessage={'Press + to add your first team member'}
        contentContainerStyle={{paddingVertical: 10}}
        refreshControl={
          <RefreshControl
            refreshing={
              fetchTeamMemberStatus.status === ThunkStatusEnum.LOADING
            }
            onRefresh={() => {
              dispatch(getTeamMembers({page: 1, perPage: 100}));
            }}
            title="Pull down to refresh"
            tintColor={R.colors.white}
            titleColor={R.colors.white}
            colors={['red', 'green', 'blue']}
          />
        }
      />

      <View style={styles.bottomFixedBtn}>
        <HoverButton
          style={styles.hoverBtn}
          right
          onPress={handleCreateTeamMember}
        />
      </View>
      {isSubscriptionModal && (
        <SubscriptionTrialModal
          screenTitle={'Teams'}
          isVisible={isSubscriptionModal}
          onModalHide={setSubscriptionModal}
        />
      )}
    </View>
  );
};

export default TeamMembers;
