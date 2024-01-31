import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../styles';
import {Organisation, User} from 'datalib/entity/user';
import R from 'resources/R';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../../store/app.store';
import {
  deleteEmployeeAccount,
  getOrganisation,
  seletTeamById,
  updateTeamMember,
} from '../../../store/slices/user.slice';
import {Team, TeamMember} from 'datalib/entity/team';
import GAlert, {MessageType} from 'library/common/GAlert';
import {Nillable} from '../../../models/custom.types';
import {DeleteButton} from 'library/common/ButtonGroup';
interface UserGroup {
  item: User;
  onPress: (item: User) => void;
}
const UserGroup = ({item, onPress}: UserGroup) => {
  const dispatch = useDispatch<RootDispatch>();
  const userTeam: Nillable<Team> = useSelector((state: RootState) =>
    seletTeamById(state, item?.team || ''),
  );
  const organisation: Nillable<Organisation> = useSelector(getOrganisation);
  const [showConfirmation, setConfirmation] = useState<boolean>(false);
  const organizationRoles = useSelector(
    (state: RootState) => state.user?.user?.organizationRoles || [],
  );
  const getUserRole = (roleId: string) => {
    if (roleId && userTeam && organizationRoles) {
      const role = organizationRoles.find(_i => _i._id === roleId);
      return `${userTeam?.name || ''} - ${role?.displayName || 'Admin'}`;
    } else if (roleId && organizationRoles) {
      const role = organizationRoles.find(_i => _i._id === roleId);
      return `${organisation?.name || ''} - ${role?.displayName || 'Admin'}`;
    } else {
      return `${organisation?.name || ''} Employee`;
    }
  };
  const handleOnDelete = async () => {
    const response = await dispatch(deleteEmployeeAccount(item?._id || ''));
    if (response.meta.requestStatus === 'fulfilled') {
      GAlert('Employee Account successfully deleted', MessageType.SUCCESS);
    }
    setConfirmation(false);
  };
  return (
    <View style={styles.boxContainer}>
      <Pressable
        android_ripple={R.darkTheme.grayRipple}
        style={styles.teamsItem}
        onPress={() => onPress(item)}>
        <View>
          <Text style={styles.nameText}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.smallText}>{getUserRole(item?.role)}</Text>
        </View>
        <DeleteButton onPress={() => setConfirmation(true)} />
      </Pressable>
      <ConfirmationDialog
        showDialog={showConfirmation}
        onConfirm={(status: boolean) => {
          if (status) {
            handleOnDelete();
          } else {
            setConfirmation(false);
          }
        }}
        confirmationMessage={
          item.isActive
            ? 'Are you sure want to delete?'
            : 'Are you sure want to actvate this account?'
        }
      />
    </View>
  );
};

export default UserGroup;
