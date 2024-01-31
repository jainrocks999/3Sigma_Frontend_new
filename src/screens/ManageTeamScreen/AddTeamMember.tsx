/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import BackButton from 'library/common/BackButton';
import {styles} from './styles';
import DynamicForm from 'library/form-field/DynamicForm';
import {ADD_TEAM_MEMBER} from '../../configs/constants';
import GScreen from 'library/wrapper/GScreen';
import Helper from '../../utils/helper';
import {RootDispatch, RootState} from '../../store/app.store';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addTeamMember,
  getTeamMembers,
  selectAllRoles,
  selectAllUsers,
  selectRoelById,
  updateTeamMember,
} from '../../store/slices/user.slice';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {Role, TeamMember} from 'datalib/entity/team';
import YouTubeLinkIcon from 'library/common/YouTubeLinkIcon';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {Nillable} from '../../models/custom.types';

const AddTeamMember = (props: any) => {
  const editItem = props.route.params?.editItem || null;
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const roles: Array<Role> = useSelector(selectAllRoles);
  const users: Nillable<Array<TeamMember>> = useSelector((state: RootState) =>
    selectAllUsers(state),
  );

  const {updateTeamMemberStatus} = useSelector(
    (state: RootState) => state.user,
  );
  const organizationRoles = useSelector(
    (state: RootState) => state.user?.user?.organizationRoles || [],
  );

  const formFields = [...ADD_TEAM_MEMBER];
  formFields[0].options = organizationRoles
    .filter(_i => _i.name !== 'super_admin')
    .map(_i => ({
      name: _i.displayName?.split('_').join(' '),
      value: _i._id,
    }));
  formFields[5].disable = editItem ? false : true;
  formFields[6].disable = editItem ? false : true;
  let teams = [];
  if (editItem) {
    if (
      editItem.team &&
      Array.isArray(editItem.team) &&
      editItem.isOrganizationMember
    ) {
      teams = [...editItem.team, 'organisation'];
    } else if (editItem.isOrganizationMember) {
      teams = ['organisation'];
    } else {
      teams = editItem.team || [];
    }
  }

  const [item, setItem] = useState<TeamMember>({
    name: editItem ? editItem?.firstName + ' ' + (editItem.lastName || '') : '',
    phone: editItem?.phone || '',
    countryCode: editItem?.countryCode || '',
    email: editItem?.email || '',
    salesTarget: editItem?.salesTarget || 0,
    role: editItem?.role || '',
    teams: teams,
    reportTo: editItem?.reportTo || null,
    isActive: editItem ? editItem?.isActive : true,
  });

  const handleValueChange = (_value: {field: string; value: any}) => {
    let updatedItem = {};
    if (_value.field === 'phone') {
      updatedItem = {
        ...item,
        phone: _value.value.phone,
        countryCode: _value.value.country.callingCode[0] || '91',
      };
    } else {
      updatedItem = {...item, [_value.field]: _value.value};
    }
    setItem(updatedItem);
    if (_value.field === 'role' && _value.value) {
      const role = organizationRoles.find(_i => _i._id === _value.value);
      formFields[1].multiSelect = role?.name === 'admin' ? true : false;
    }
  };
  const handleSavePress = async () => {
    try {
      let response = null;
      const newUser = {...item};
      if (Helper.isFormValid(ADD_TEAM_MEMBER, newUser)) {
        const firstName = (newUser?.name || '').substring(
          0,
          (newUser?.name || '').indexOf(' '),
        );
        newUser.firstName =
          firstName && firstName !== '' ? firstName : newUser.name;
        newUser.lastName =
          firstName && firstName !== ''
            ? (newUser?.name || '').substring(
                (newUser?.name || '').indexOf(' ') + 1,
              )
            : '';
        delete newUser.name;
        delete newUser.email;
        if (!newUser.lastName || newUser.lastName === '') {
          delete newUser.lastName;
        }
        if (
          !newUser.teams ||
          newUser.teams.length === 0 ||
          newUser.teams.includes('organisation')
        ) {
          newUser.isOrganizationMember = true;
          if (Array.isArray(newUser.teams)) {
            newUser.teams = newUser.teams.filter(
              (_item: any) => _item !== 'organisation',
            );
          } else if (newUser.teams) {
            newUser.teams = [];
          } else {
            newUser.teams = [];
          }
        } else {
          newUser.isOrganizationMember = false;
          delete newUser.reportTo;
          if (!Array.isArray(newUser.teams)) {
            newUser.teams = [newUser.teams];
          }
        }
        if (editItem) {
          newUser._id = editItem?._id;
          response = await dispatch(updateTeamMember(newUser));
        } else {
          delete newUser.isActive;
          response = await dispatch(addTeamMember(newUser));
        }
        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(getTeamMembers({page: 1, perPage: 100}));
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Error while saving team members', error);
    }
  };

  const role: Nillable<Role> = useSelector((state: RootState) =>
    selectRoelById(state, item.role || ''),
  );
  let roleIds: any = [];
  console.log(item.teams);
  roleIds = roles
    .filter(_u =>
      (role?.name === 'admin' ? ['employee'] : ['team_leader']).includes(
        _u?.name || 'NA',
      ),
    )
    ?.map(_i => _i._id);
  formFields[2].disable =
    !item.teams ||
    (item.teams &&
      Array.isArray(item.teams) &&
      !item.teams.includes('organisation')) ||
    role?.name === 'admin'
      ? true
      : false;
  if (editItem) {
    formFields[6].excludeOptions = [editItem._id];
    formFields[2].excludeOptions = [
      editItem._id,
      ...(users || [])
        .filter(_user => !roleIds.includes(_user.role))
        .map(_user => _user._id),
    ];
  } else {
    formFields[2].excludeOptions = [
      ...(users || [])
        .filter(_user => !roleIds.includes(_user.role))
        .map((_user: any) => _user._id),
    ];
  }
  console.log('item', item, editItem);
  return (
    <GScreen
      loading={updateTeamMemberStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.container}>
        <View style={styles.backButtonBox}>
          <BackButton title={editItem ? 'Edit User' : 'Add new user'} />
          <YouTubeLinkIcon screenName={ScreenNameEnum.MY_TEAM_SCREEN} />
        </View>
        <View style={styles.formContainer}>
          <DynamicForm
            fieldValues={item}
            formFields={formFields}
            handleValueChange={handleValueChange}
            buttonTitle={editItem ? 'Update User' : 'Add New User'}
            buttonPress={handleSavePress}
          />
        </View>
      </View>
    </GScreen>
  );
};
export default AddTeamMember;
