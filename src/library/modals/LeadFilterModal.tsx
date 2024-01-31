/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {
  getFilterLeads,
  getLeads,
  selectFilterMetaData,
} from '../../store/slices/lead.slice';
import R from 'resources/R';
import {
  currentUserSelector,
  getOrganisation,
  selectPermissions,
  selectPrefrence,
  selectUserByTeam,
  selectUserIntegrationIds,
} from '../../store/slices/user.slice';
import {RootDispatch, RootState} from '../../store/app.store';
import GModal from '../wrapper/GModal';
import {User} from 'datalib/entity/user';
import DropDown from '../form-field/DropDown';

import {LeadFilterMetadata} from 'datalib/entity/paginatedResult';
import {PastDateOptions} from '../../configs/constants';
import DateSelect from '../form-field/DateSelect';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import Button from '../common/ButtonGroup';
import DropDownWithOption from '../form-field/DropDownWithOption';
import {ScrollView} from 'react-native-gesture-handler';
import {LeadListEnum} from '../../models/common/thunkStatus.enum';
import {Nillable} from '../../models/custom.types';

const LeadFilterModal = (props: any) => {
  let {isModal, onModalClose, onFilterSelect} = props;
  const permission: Array<string> = useSelector(selectPermissions);
  const user: Nillable<User> = useSelector(currentUserSelector);
  const organizationRoles = useSelector(
    (state: RootState) => state.user?.user?.organizationRoles || [],
  );
  const dispatch = useDispatch<RootDispatch>();
  const filterMetaData: LeadFilterMetadata = useSelector((state: RootState) =>
    selectFilterMetaData(state),
  );
  const organisation = useSelector(getOrganisation);
  const userIntegrations = useSelector(selectUserIntegrationIds);

  const customSources = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.LEAD_CUSTOM_SOURCES),
  );
  const [teams, setTeams] = useState(
    filterMetaData.teams ? filterMetaData.teams[0] : null,
  );
  const employees = useSelector((state: RootState) =>
    selectUserByTeam(state, teams || null),
  );
  const {leadPaginationMetadata, leadFilterMetadata, leadListType} =
    useSelector((state: RootState) => state.lead);

  const [fromDate, setFromDate] = useState(
    filterMetaData?.date?.startedAt || new Date(),
  );
  const [toDate, setToDate] = useState(
    filterMetaData?.date?.endedAt || new Date(),
  );
  const [selectedLabels, setSelectedLabels] = useState<Array<string>>(
    filterMetaData.label || [],
  );
  const [selectedStatus, setSelectedStatus] = useState<Array<string>>(
    filterMetaData.status || [],
  );
  const [selectedSource, setSelectedSource] = useState<Array<string>>(
    filterMetaData.source || [],
  );
  const [selectedDate, setSelectedDate] = useState<string | number | null>();
  const [sortByColumn, setSortingColumn] = useState({
    orderBy: filterMetaData.sort.orderBy || 'createdDate',
    isAscending: filterMetaData.sort.isAscending,
  });
  const [teamMembers, setteamMembers] = useState(
    filterMetaData.teamMembers ? filterMetaData.teamMembers[0] : null,
  );
  const [customField, setCustomField] = useState(
    filterMetaData.customField || [],
  );

  const resetButtonPress = (reloadLeads = true) => {
    setSelectedLabels([]);
    setSelectedStatus([]);
    setSelectedSource([]);
    setSortingColumn({
      orderBy: 'createdDate',
      isAscending: false,
    });
    setTeams(null);
    setteamMembers(null);
    setSelectedDate(null);
    setToDate(new Date());
    setFromDate(new Date());
    if (reloadLeads) {
      const payload = {...leadPaginationMetadata};
      if (leadFilterMetadata.list) {
        payload.list = leadFilterMetadata.list;
      }
      payload.page = 1;
      dispatch(getLeads(payload));
    }
  };

  useEffect(() => {
    if (isModal && leadListType !== LeadListEnum.FILTERED_LEADS) {
      resetButtonPress(false);
    }
  }, [isModal]);
  const filterLeadSearch = () => {
    const filterInfo: LeadFilterMetadata = {
      ...filterMetaData,
    };
    if (selectedDate === 'custom') {
      filterInfo.date = {
        startedAt: moment(fromDate).utc().toISOString(),
        endedAt: moment(toDate).utc().toISOString(),
      };
    } else if (selectedDate) {
      const filterDate = moment().utc().subtract(selectedDate, 'd');

      filterInfo.date = {
        startedAt: filterDate.utc().toISOString(),
        endedAt:
          selectedDate === 1
            ? filterDate.utc().toISOString()
            : moment().utc().toISOString(),
      };
    }

    filterInfo.sort = sortByColumn;
    if (selectedLabels.length) {
      filterInfo.label = selectedLabels;
    } else {
      delete filterInfo.label;
    }

    if (selectedStatus.length) {
      filterInfo.status = selectedStatus;
    } else {
      delete filterInfo.status;
    }

    if (selectedSource.length) {
      filterInfo.source = selectedSource;
    } else {
      delete filterInfo.source;
    }

    if (teams && teams.length && teams !== 'organisation') {
      filterInfo.teams = [teams];
    } else if (teams === 'organisation') {
      filterInfo.byOrganization = true;
      delete filterInfo.teams;
    } else {
      delete filterInfo.teams;
      delete filterInfo.byOrganization;
    }

    if (teamMembers && teamMembers.length) {
      filterInfo.teamMembers = [teamMembers];
    } else {
      delete filterInfo.teamMembers;
      if (!teams) {
        filterInfo.teamMembers = [user?._id];
      }
    }

    dispatch(getFilterLeads(filterInfo));
    onFilterSelect();
  };
  if (!user) {
    return null;
  }
  let integrations: Array<any> = [];
  if (user?.systemIntegration) {
    integrations = user?.systemIntegration
      .filter(_i => userIntegrations.includes(_i._id))
      .map(_i => ({
        name: _i.name,
        value: _i._id,
      }));
  }
  const setTeamName = (teamId: string, roleId: string) => {
    if (roleId && teamId) {
      const team = (user?.organizationTeams || []).find(
        _i => _i._id === teamId,
      );
      const role = organizationRoles.find(_i => _i._id === roleId);
      return `${team?.name || ''} - ${role?.displayName || 'Admin'}`;
    } else if (roleId) {
      const role = organizationRoles.find(_i => _i._id === roleId);
      return `${user?.organization?.name || ''} - ${
        role?.displayName || 'Admin'
      }`;
    } else {
      return `${user?.organization?.name || ''} Employee`;
    }
  };
  return (
    <GModal isVisible={isModal} onModalHide={onModalClose}>
      <View style={styles.modalView}>
        <View style={styles.modalHeader}>
          <Text style={styles.modaleTitle}>Lead Filter</Text>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                resetButtonPress();
              }}>
              <Text style={[styles.buttonText, {color: R.colors.themeCol2}]}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{maxHeight: 600, paddingHorizontal: 10}}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.labelStyle}>Select lead sorting</Text>
          <DropDownWithOption
            defaultOption={sortByColumn}
            title={'Select lead sorting'}
            options={[
              {name: 'Created Date', value: 'createdDate'},
              {name: 'Name', value: 'name'},
              {name: 'Sale Value', value: 'saleValue'},
              {name: 'Followup Date', value: 'followupDate'},
              {name: 'Activity Date', value: 'activityDate'},
            ]}
            placeholder={'Select lead sorting'}
            onChangeVal={setSortingColumn}
          />
          <Text style={styles.labelStyle}>Date lead added</Text>
          {isModal && (
            <DropDown
              defaultOption={selectedDate}
              title={'Date lead added'}
              options={PastDateOptions}
              placeholder={'Date Lead Added'}
              onChangeVal={setSelectedDate}
            />
          )}
          {selectedDate && selectedDate === 'custom' ? (
            <View>
              <Text style={styles.labelStyle}>Custom Date</Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: '48%'}}>
                  <DateSelect
                    type="date"
                    placeholder={'From Date'}
                    style={{
                      ...R.generateFontStyle(
                        FontSizeEnum.BASE,
                        FontWeightEnum.MEDIUM,
                      ),
                      color: R.colors.labelCol1,
                    }}
                    defaultValue={fromDate}
                    onChangeText={(value: Date) => {
                      setFromDate(value);
                    }}
                  />
                </View>
                <View style={{width: '48%'}}>
                  <DateSelect
                    type="date"
                    placeholder={'To Date'}
                    style={{
                      ...R.generateFontStyle(
                        FontSizeEnum.BASE,
                        FontWeightEnum.MEDIUM,
                      ),
                      color: R.colors.labelCol1,
                    }}
                    defaultValue={toDate}
                    onChangeText={(value: Date) => {
                      setToDate(value);
                    }}
                  />
                </View>
              </View>
            </View>
          ) : null}
          <Text style={styles.labelStyle}>Lead labels</Text>
          {isModal && (
            <DropDown
              defaultOption={selectedLabels}
              title={'Labels'}
              multiSelectEnabled
              options={user.userPreference?.labels || []}
              placeholder={'Select labels'}
              onChangeVal={setSelectedLabels}
            />
          )}
          <Text style={styles.labelStyle}>Lead Status</Text>
          <DropDown
            defaultOption={selectedStatus}
            title={'Status'}
            multiSelectEnabled
            options={user.userPreference?.status || []}
            placeholder={'Select status'}
            onChangeVal={setSelectedStatus}
          />
          <Text style={styles.labelStyle}>Lead Sources</Text>
          <DropDown
            defaultOption={selectedSource}
            title={'Source'}
            multiSelectEnabled
            options={[...integrations, ...customSources]}
            placeholder={'Select Source'}
            onChangeVal={_source => {
              setSelectedSource(_source);
            }}
          />

          {!permission.includes('home_screen > filter_modal_team_field') ? (
            <>
              <Text style={styles.labelStyle}>Team</Text>
              <DropDown
                defaultOption={teams}
                title={'Teams'}
                options={[
                  ...(user.organizationTeams?.map(_i => ({
                    name: `${_i.name}`,
                    value: _i._id,
                  })) || []),
                  {value: 'organisation', name: organisation?.name},
                ]}
                placeholder={'Select Team'}
                onChangeVal={val => {
                  setTeams(val);
                  setteamMembers(null);
                }}
              />
            </>
          ) : null}
          {!permission.includes(
            'home_screen > filter_modal_employees_field',
          ) ? (
            <>
              <Text style={styles.labelStyle}>Employee</Text>
              <DropDown
                defaultOption={teamMembers}
                title={'Team Member'}
                options={
                  employees?.map(_i => ({
                    description: setTeamName(_i.team, _i.role),
                    name: `${_i.firstName} ${_i.lastName || ''}`,
                    value: _i._id,
                  })) || []
                }
                placeholder={'Select Team member'}
                onChangeVal={setteamMembers}
              />
            </>
          ) : null}

          {/* <Text style={styles.labelStyle}>Custom form fields</Text>
          <DropDown
            defaultOption={teamMembers}
            title={'Custom fields'}
            options={
              user.userPreference[PrefrenceKeyEnum.LEAD_FORM]
                .map(_i => ({
                  name: _i.name,
                  value: _i.value,
                }))
                .filter(
                  _f =>
                    ![
                      '_id',
                      'name',
                      'email',
                      'phone',
                      'label',
                      'status',
                      'saleValue',
                      'address',
                      'website',
                      'notes',
                      'customSource',
                      'extraDetails',
                      'companyName',
                    ].includes(_f.value),
                ) || []
            }
            placeholder={'Select custom fields'}
            onChangeVal={(field: any) => {
              setCustomField({key: field, value: field});
            }}
          /> */}
        </ScrollView>
        <Button onPress={filterLeadSearch} label={'APPLY'} />
      </View>
    </GModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: R.colors.transparentBlack,
  },
  modalView: {
    width: '100%',
    bottom: 0,
    backgroundColor: R.colors.bgCol,
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    padding: moderateScale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  labelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modaleTitle: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol1,
    padding: moderateScale(10),
  },
  closeButton: {
    alignSelf: 'center',
    marginRight: moderateScale(15),
  },
  scrollStyle: {
    width: '100%',
  },
  rowWrapper: {
    borderBottomColor: R.colors.disabledGrey,
    borderBottomWidth: 1,
    paddingVertical: moderateScale(15),
    width: '100%',
    paddingLeft: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    height: moderateScale(10),
    width: moderateScale(10),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(8),
  },
  itemText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
  },
  buttonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    textTransform: 'uppercase',
  },
});

export default LeadFilterModal;
