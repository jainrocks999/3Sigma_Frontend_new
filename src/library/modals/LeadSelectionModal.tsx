/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {LeadFilterMetadata} from 'datalib/entity/paginatedResult';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  selectAllLeads,
  selectFilterMetaData,
  getFilterLeads,
} from '../../store/slices/lead.slice';
import OptionsPopup from '../form-field/OptionsPopup';

export interface SelectionModalProps {
  isVisible: boolean;
  onModalHide: (isVisible: boolean) => void;
  selectedOptions?: Array<any> | string;
  excludeOptions?: Array<any> | string;
  isMultiSelect?: boolean;
  onOptionSelect: (selectedOptions: Array<any>) => void;
  onSelectAll?: (status: boolean) => void;
}
const LeadSelectionModal = ({
  isVisible,
  onModalHide,
  selectedOptions,
  isMultiSelect = false,
  onOptionSelect,
  onSelectAll,
}: SelectionModalProps) => {
  const dispatch = useDispatch<RootDispatch>();
  const leads = useSelector((state: RootState) => selectAllLeads(state));
  const [multiSelectEnabled, setMultiSelectEnabled] = useState(isMultiSelect);

  const filterMetaData: LeadFilterMetadata = useSelector((state: RootState) =>
    selectFilterMetaData(state),
  );

  const onSearchTextChange = (_searchText: string) => {
    let filterInfo = {
      ...filterMetaData,
    };
    if (_searchText && _searchText?.length) {
      filterInfo.search = _searchText;
    } else {
      delete filterInfo.search;
    }
    dispatch(getFilterLeads(filterInfo));
  };
  return isVisible ? (
    <OptionsPopup
      title={'Select leads'}
      showOptionPopup={isVisible}
      options={leads || []}
      selectedOptions={selectedOptions}
      onSelection={onOptionSelect}
      multiSelectEnabled={multiSelectEnabled}
      setMultiSelectEnabled={setMultiSelectEnabled}
      toggleOptionPopup={onModalHide}
      bulkSelectEnabled={isMultiSelect}
      isSearchable={true}
      onSearchTextChange={onSearchTextChange}
      buttonTitle={'NEXT'}
      onSelectAll={onSelectAll}
      contaienrStyle={{
        maxHeight: '98%',
      }}
    />
  ) : null;
};
export default LeadSelectionModal;
