import {List} from 'datalib/entity/List';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllList, selectAllLists} from '../../store/slices/list.slice';
import OptionsPopup from '../form-field/OptionsPopup';
import {SelectionModalProps} from './LeadSelectionModal';
import {RootDispatch, RootState} from '../../store/app.store';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';

const ListSelectionModal = ({
  isVisible,
  onModalHide,
  selectedOptions,
  onOptionSelect,
  excludeOptions = [],
}: SelectionModalProps) => {
  const lists: Array<List> = useSelector(selectAllLists);
  const findListsStatus = useSelector(
    (state: RootState) => state.list.findListsStatus,
  );
  const dispatch = useDispatch<RootDispatch>();
  const listsArr = lists.filter(item => !excludeOptions.includes(item?._id));
  if (isVisible && findListsStatus.status === ThunkStatusEnum.IDLE) {
    dispatch(getAllList({perPage: 100}));
  }
  return isVisible ? (
    <OptionsPopup
      title={'Select list'}
      showOptionPopup={isVisible}
      options={
        !excludeOptions.includes('default_list')
          ? [{_id: null, name: 'Default Lead'}, ...listsArr]
          : listsArr
      }
      selectedOptions={selectedOptions || []}
      onSelection={onOptionSelect}
      toggleOptionPopup={onModalHide}
      dataKeys={{
        itemIdKey: '_id',
        itemTitleKey: 'name',
        itemDescriptionKey: 'description',
      }}
    />
  ) : null;
};
export default ListSelectionModal;
