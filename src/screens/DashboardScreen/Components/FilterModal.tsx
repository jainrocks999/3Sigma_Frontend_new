/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {useSelector} from 'react-redux';

import R from 'resources/R';
import {User} from 'datalib/entity/user';

import {ScrollView} from 'react-native-gesture-handler';
import GModal from 'library/wrapper/GModal';
import DateSelect from 'library/form-field/DateSelect';
import DropDown from 'library/form-field/DropDown';
import {Button} from 'library/common/ButtonGroup';
import {PastDaysOptions} from '../../../configs/constants';
import {
  currentUserSelector,
  getOrganisation,
  selectUserByTeam,
} from '../../../store/slices/user.slice';
import {RootState} from '../../../store/app.store';
import {Nillable} from '../../../models/custom.types';
import {TeamMember} from 'datalib/entity/team';
import {DashboardFilterParams} from 'datalib/entity/dashBoard';
import {initialFilterValues} from '../../../store/slices/dashboard.slice';
import moment from 'moment';
interface FilterProps {
  onSubmit: (filterParams: DashboardFilterParams) => void;
  isVisible: boolean;
  onModalClose: () => void;
}

const FilterModal = (
  {onSubmit, isVisible, onModalClose}: FilterProps,
  ref: any,
) => {
  const user: Nillable<User> = useSelector(currentUserSelector);
  const organizationRoles = useSelector(
    (state: RootState) => state.user?.user?.organizationRoles || [],
  );

  const organisation = useSelector(getOrganisation);

  const [filterValues, setFilterValues] =
    useState<DashboardFilterParams>(initialFilterValues);

  const handleValueChange = (item: {field: string; value: string}) => {
    const newFilterValues = {...filterValues, [item.field]: item.value};
    if (item.field === 'duration' && newFilterValues.duration !== 'custom') {
      newFilterValues.fromDate = moment()
        .subtract(newFilterValues.duration, 'days')
        .utc()
        .toISOString();
      newFilterValues.toDate = moment().utc().toISOString();
    }
    setFilterValues(newFilterValues);
  };

  const employees: Array<TeamMember> = useSelector((state: RootState) =>
    selectUserByTeam(state, filterValues?.teams || null),
  );

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
  const resetButtonPress = () => {
    setFilterValues(initialFilterValues);
  };
  useImperativeHandle(ref, () => ({
    onReset: () => {
      resetButtonPress();
    },
  }));
  return (
    <GModal isVisible={isVisible} onModalHide={onModalClose}>
      {isVisible ? (
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modaleTitle}>Select Filters</Text>
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
            style={{maxHeight: 600, paddingHorizontal: 10, marginBottom: 10}}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.labelStyle}>Date lead added</Text>
            <DropDown
              defaultOption={filterValues.duration}
              title={'Duration'}
              options={PastDaysOptions}
              placeholder={'Duration'}
              onChangeVal={option => {
                handleValueChange({
                  field: 'duration',
                  value: option,
                });
              }}
            />
            {filterValues.duration && filterValues.duration === 'custom' ? (
              <View>
                <Text style={styles.labelStyle}>Custom Date</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: '48%'}}>
                    <DateSelect
                      type="date"
                      placeholder={'From Date'}
                      disableFutureDate
                      style={{
                        ...R.generateFontStyle(
                          FontSizeEnum.BASE,
                          FontWeightEnum.MEDIUM,
                        ),
                        color: R.colors.labelCol1,
                      }}
                      defaultValue={filterValues.fromDate}
                      onChangeText={(value: Date) => {
                        handleValueChange({
                          field: 'fromDate',
                          value: value.toISOString(),
                        });
                      }}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <DateSelect
                      type="date"
                      placeholder={'To Date'}
                      disableFutureDate
                      style={{
                        ...R.generateFontStyle(
                          FontSizeEnum.BASE,
                          FontWeightEnum.MEDIUM,
                        ),
                        color: R.colors.labelCol1,
                      }}
                      defaultValue={filterValues.toDate}
                      onChangeText={(value: Date) => {
                        handleValueChange({
                          field: 'toDate',
                          value: value.toISOString(),
                        });
                      }}
                    />
                  </View>
                </View>
              </View>
            ) : null}
            <Text style={styles.labelStyle}>Team</Text>
            <DropDown
              defaultOption={filterValues.teams}
              title={'Teams'}
              options={[
                ...(user?.organizationTeams?.map(_i => ({
                  name: `${_i.name}`,
                  value: _i._id,
                })) || []),
                {value: 'organisation', name: organisation?.name},
              ]}
              placeholder={'Select Team'}
              onChangeVal={val => {
                handleValueChange({
                  field: 'teams',
                  value: val,
                });
              }}
            />

            <Text style={styles.labelStyle}>Employee</Text>
            <DropDown
              defaultOption={filterValues.userId}
              title={'Team Member'}
              options={
                employees?.map(_i => ({
                  description: setTeamName(_i.team, _i.role),
                  name: `${_i.firstName} ${_i.lastName || ''}`,
                  value: _i._id,
                })) || []
              }
              placeholder={'Select Team member'}
              onChangeVal={val => {
                handleValueChange({
                  field: 'userId',
                  value: val,
                });
              }}
            />
          </ScrollView>
          <Button
            onPress={() => {
              onSubmit(filterValues);
              onModalClose();
            }}
            label={'APPLY'}
          />
        </View>
      ) : null}
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

export default forwardRef(FilterModal);
