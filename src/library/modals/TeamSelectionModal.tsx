import {Team} from 'datalib/entity/team';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/app.store';
import {getOrganisation, selectAllTeams} from '../../store/slices/user.slice';
import OptionsPopup from '../form-field/OptionsPopup';
import {SelectionModalProps} from './LeadSelectionModal';

const TeamSelectionModal = ({
  isVisible,
  onModalHide,
  selectedOptions,
  onOptionSelect,
  excludeOptions,
  isMultiSelect,
}: SelectionModalProps) => {
  const organisation = useSelector(getOrganisation);
  const teams: Array<Team> = useSelector((state: RootState) =>
    selectAllTeams(state),
  );
  const teamsArr = [
    ...teams,
    {_id: 'organisation', name: organisation?.name},
  ].filter(_i => !excludeOptions?.includes(_i?._id || ''));
  console.log('selectedOptions', selectedOptions);
  return isVisible ? (
    <OptionsPopup
      title={'Select team'}
      showOptionPopup={isVisible}
      options={teamsArr}
      multiSelectEnabled={isMultiSelect}
      selectedOptions={selectedOptions || []}
      onSelection={onOptionSelect}
      toggleOptionPopup={onModalHide}
    />
  ) : null;
};
export default TeamSelectionModal;
