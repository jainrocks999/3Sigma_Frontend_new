/* eslint-disable react-hooks/exhaustive-deps */
import {View, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import GFlatList from 'library/common/GFlatList';
import TeamGroup from './Components/TeamGroup';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  getTeams,
  selectAllTeams,
  selectSubcriptionStatus,
} from '../../store/slices/user.slice';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import R from 'resources/R';
import {Team} from 'datalib/entity/team';
import HoverButton from 'library/buttons/HoverButton';
import SubscriptionTrialModal from 'library/modals/SubscriptionTrialModal';
import ga from 'library/hooks/analytics';

const Teams = (props: any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const teams = useSelector((state: RootState) => selectAllTeams(state));
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const [isSubscriptionModal, setSubscriptionModal] = useState<boolean>(false);
  const fetchTeamStatus = useSelector(
    (state: RootState) => state.user.fetchTeamStatus,
  );
  useEffect(() => {
    if (isSubscribed) {
      dispatch(getTeams({page: 1, perPage: 100}));
    }
  }, []);
  useEffect(() => {
    if (!isSubscribed && props.navigation.isFocused()) {
      setSubscriptionModal(true);
    }
  }, [props.navigation.isFocused()]);
  const handleCreateTeam = async () => {
    if (isSubscribed) {
      await ga.logEvent('Add_New_Team');
      navigation.navigate(ScreenNameEnum.ADD_TEAM_SCREEN);
    } else {
      setSubscriptionModal(true);
    }
  };
  const renderItem = ({item, index}: {item: Team; index: number}) => {
    return <TeamGroup key={index} item={item} />;
  };

  return (
    <View style={styles.container}>
      <GFlatList
        data={teams || []}
        renderItem={renderItem}
        emptyMessage={'Press + to create your first team'}
        refreshControl={
          <RefreshControl
            refreshing={fetchTeamStatus.status === ThunkStatusEnum.LOADING}
            onRefresh={() => {
              dispatch(getTeams({page: 1, perPage: 100}));
            }}
            title="Pull down to refresh"
            tintColor={R.colors.white}
            titleColor={R.colors.white}
            colors={['red', 'green', 'blue']}
          />
        }
      />
      <View style={styles.bottomFixedBtn}>
        <HoverButton style={styles.hoverBtn} right onPress={handleCreateTeam} />
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

export default Teams;
