/* eslint-disable react-hooks/exhaustive-deps */
import {TeamMember} from 'datalib/entity/team';
import {User} from 'datalib/entity/user';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Nillable} from '../../models/custom.types';
import {RootState} from '../../store/app.store';
import {
  currentUserSelector,
  selectAllEmployees,
} from '../../store/slices/user.slice';
import OptionsPopup from '../form-field/OptionsPopup';
export interface SelectionModalProps {
  isVisible: boolean;
  onModalHide: (isVisible: boolean) => void;
  selectedOptions?: Array<any> | string | number;
  additionalOptions?: Array<any>;
  excludeUsers?: Array<any>;
  isMultiSelect?: boolean;
  includeCurrentUser?: boolean;
  onOptionSelect: (selectedOptions: Array<any>) => void;
}
const UserSelectionModal = ({
  isVisible,
  onModalHide,
  selectedOptions,
  onOptionSelect,
  includeCurrentUser = false,
  additionalOptions = [],
  excludeUsers = [],
}: SelectionModalProps) => {
  const organizationRoles = useSelector(
    (state: RootState) => state.user?.user?.organizationRoles || [],
  );
  const user: Nillable<User> = useSelector(currentUserSelector);
  const [selOptions, setOptions] =
    useState<Nillable<Array<any> | string | number>>(null);

  const employees: Array<TeamMember> = useSelector((state: RootState) =>
    selectAllEmployees(state),
  );
  const users = [...employees];
  if (includeCurrentUser && user) {
    const ifExist = employees.find((_i: any) => _i.id === user?._id);
    if (!ifExist) {
      users.push(user);
    }
  }

  const setTeamName = (teamId: string, roleId: string) => {
    if (roleId && teamId) {
      const team = user?.organizationTeams?.find(_i => _i._id === teamId);
      const role = organizationRoles.find(_i => _i._id === roleId);
      return `${team?.name} - ${role?.name || ''}`.split('_').join(' ');
    } else if (roleId) {
      const role = organizationRoles.find(_i => _i._id === roleId);
      return `${user?.organization?.name} - ${role?.name || 'Admin'}`
        .split('_')
        .join(' ');
    } else {
      return `${user?.organization?.name} Admin`.split('_').join(' ');
    }
  };
  useEffect(() => {
    if (selectedOptions && selectedOptions !== selOptions) {
      setOptions(selectedOptions);
      const elem = userArray.find(item => item._id === selectedOptions);
      if (elem) {
        onOptionSelect(elem);
      }
    }
  }, [selectedOptions]);
  // useEffect(() => {
  //   if (users.length) {
  //     setUserArray(
  //       users.map(_i => ({
  //         _id: _i._id,
  //         name: `${_i.firstName} ${_i.lastName || ''}`,
  //         role: _i.role,
  //         description: getUserRole(_i.role || ''),
  //       })),
  //     );
  //   }
  // }, [users]);
  const [userArray, setUserArray] = useState([
    ...additionalOptions,
    ...users
      .filter(_u => !excludeUsers.includes(_u._id))
      .map(_i => ({
        _id: _i._id,
        name: `${_i.firstName} ${_i.lastName || ''}`,
        role: _i.role,
        description: setTeamName(_i?.team || '', _i.role || ''),
      })),
  ]);
  const handleSearch = (text: string) => {
    setUserArray(users.filter(_u => (_u?.firstName || '').includes(text)));
  };
  return isVisible ? (
    <OptionsPopup
      title={'Select User'}
      showOptionPopup={isVisible}
      options={[
        ...additionalOptions,
        ...users
          .filter(_u => !excludeUsers.includes(_u._id))
          .map(_i => ({
            _id: _i._id,
            name: `${_i.firstName} ${_i.lastName || ''}`,
            role: _i.role,
            description: setTeamName(_i?.team || '', _i.role || ''),
          })),
      ]}
      dataKeys={{
        itemIdKey: '_id',
        itemTitleKey: 'name',
        itemDescriptionKey: 'description',
      }}
      selectedOptions={selOptions || []}
      onSelection={onOptionSelect}
      toggleOptionPopup={onModalHide}
      onSearchTextChange={handleSearch}
    />
  ) : null;
};
export default UserSelectionModal;
