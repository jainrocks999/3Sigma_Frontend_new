/* eslint-disable react-hooks/exhaustive-deps */
import {Team, TeamMember} from 'datalib/entity/team';
import GAlert, {MessageType} from 'library/common/GAlert';
import GFlatList from 'library/common/GFlatList';
import GSwitch from 'library/common/GSwitch';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import AppImages from 'resources/images';
import R from 'resources/R';
import {Nillable} from '../../../models/custom.types';
import {RootDispatch, RootState} from '../../../store/app.store';
import {
  getDistributionConfig,
  selectDustributionConfig,
  updateDistributionConfig,
} from '../../../store/slices/list.slice';
import {
  getOrganisation,
  selectAllEmployees,
  selectSubcriptionStatus,
  seletTeamById,
} from '../../../store/slices/user.slice';
import SubscriptionTrialModal from 'library/modals/SubscriptionTrialModal';
import {Organisation} from 'datalib/entity/user';

const RoundRobin = () => {
  const dispatch = useDispatch<RootDispatch>();
  const teamMembers = useSelector(selectAllEmployees);
  const distribution = useSelector(selectDustributionConfig);
  const isSubscribed = useSelector(selectSubcriptionStatus);
  const [isSubscriptionModal, setSubscriptionModal] = useState<boolean>(false);
  const [recipientsIds, setReceipantsIds] = useState(
    distribution ? distribution.recipientsIds.ids || {} : {},
  );
  useEffect(() => {
    dispatch(getDistributionConfig());
  }, []);
  useEffect(() => {
    if (distribution) {
      setReceipantsIds(distribution.recipientsIds.ids || {});
    }
  }, [distribution]);
  const handleUserSelection = async (id: string, status: boolean) => {
    if (!isSubscribed) {
      setSubscriptionModal(true);
      return;
    }
    const newRecepients = {...recipientsIds};
    if (newRecepients[id]) {
      newRecepients[id] = {
        ...newRecepients[id],
        waitage: status ? 1 : 0,
        status: status,
      };
    } else {
      newRecepients[id] = {
        waitage: status ? 1 : 0,
        status: status,
      };
    }
    setReceipantsIds({...newRecepients});
    let receipants = null;
    if (distribution && distribution.length) {
      receipants = {
        ids: newRecepients,
        cursor: distribution.recipientsIds.cursor || '',
        current_distribution:
          distribution.recipientsIds.current_distribution || '',
      };
    } else {
      receipants = {
        cursor: '',
        current_distribution: '',
        ids: newRecepients,
      };
    }
    const payload = {
      configType: 'round-robin',
      recipientsIds: receipants,
      status: true,
    };
    const response = await dispatch(updateDistributionConfig(payload));
    if (response && response.meta.requestStatus === 'fulfilled') {
      GAlert('Updated Successfully', MessageType.SUCCESS);
    }
  };
  return (
    <View style={styles.container}>
      <GFlatList
        data={teamMembers}
        renderItem={({item}) => (
          <UserItem
            item={item}
            onSelectionUpdate={handleUserSelection}
            selected={recipientsIds[item._id]?.status || false}
          />
        )}
        emptyMessage="Add your team to enable lead distribution"
      />
      {isSubscriptionModal && (
        <SubscriptionTrialModal
          screenTitle={'Distribution rules'}
          isVisible={isSubscriptionModal}
          onModalHide={setSubscriptionModal}
        />
      )}
    </View>
  );
};
export const UserItem = ({
  selected = false,
  item,
  onSelectionUpdate,
}: {
  selected: boolean;
  item: TeamMember;
  onSelectionUpdate: (item: string, status: boolean) => void;
}) => {
  const userTeam: Nillable<Team> = useSelector((state: RootState) =>
    seletTeamById(state, item?.team || ''),
  );
  const organisation: Nillable<Organisation> = useSelector(getOrganisation);
  const [checked, setSelected] = useState(selected);
  const organizationRoles = useSelector(
    (state: RootState) => state.user?.user?.organizationRoles || [],
  );
  useEffect(() => {
    if (selected !== checked) {
      setSelected(selected);
    }
  }, [selected]);
  const setTeamName = (roleId: string) => {
    if (roleId && userTeam) {
      const role = organizationRoles.find(_i => _i._id === roleId);
      return `${userTeam?.name || ''} - ${role?.displayName || 'Admin'}`;
    } else if (roleId) {
      const role = organizationRoles.find(_i => _i._id === roleId);
      return `${organisation?.name || ''} - ${role?.displayName || 'Admin'}`;
    } else {
      return `${organisation?.name || ''} Employee`;
    }
  };
  return (
    <View style={styles.itemContainer}>
      <Pressable
        style={styles.itemInner}
        android_ripple={R.darkTheme.grayRipple}>
        <View style={styles.imageContainer}>
          <Image
            source={AppImages.userSetting}
            style={styles.imageStyle}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.nameText}>
              {item.firstName} {item.lastName}
            </Text>

            <Text style={styles.descriptionText}>
              {setTeamName(item?.role)}
            </Text>
          </View>
          <GSwitch
            isEnabled={checked}
            toggleSwitch={() => {
              onSelectionUpdate && onSelectionUpdate(item?._id, !checked);
              setSelected(!checked);
            }}
          />
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
    height: 45,
  },
  itemInner: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  nameText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
  },
  teamText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.black,
  },
  descriptionText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.black,
    textTransform: 'capitalize',
  },
});
export default RoundRobin;
