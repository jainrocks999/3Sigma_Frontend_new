import {View, Text, StyleSheet, Pressable, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GAlert from 'library/common/GAlert';

import {useDispatch, useSelector} from 'react-redux';
import GModal from 'library/wrapper/GModal';
import {
  createList,
  deleteList,
  getAllList,
  updateList,
} from '../../store/slices/list.slice';
import {List} from 'datalib/entity/List';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import R from 'resources/R';
import GSwitch from 'library/common/GSwitch';
import {RootDispatch, RootState} from '../../store/app.store';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {Nillable} from '../../models/custom.types';
import GFlatList from 'library/common/GFlatList';
import {
  getOrganisation,
  selectAllEmployees,
  selectPermissions,
  seletTeamById,
} from '../../store/slices/user.slice';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import Button, {DeleteButton, SmallButton} from 'library/common/ButtonGroup';
import {Team, TeamMember} from 'datalib/entity/team';
import {Organisation} from 'datalib/entity/user';

const AddList = ({
  editItem = null,
  isVisible,
  onModalHide,
  onDeleteList,
}: {
  editItem: Nillable<List>;
  isVisible: boolean;
  onModalHide: (isVisible: boolean) => void;
  onDeleteList: (listName: string | null) => void;
}) => {
  const dispatch = useDispatch<RootDispatch>();
  const permission: Array<string> = useSelector(selectPermissions);
  const teamMembers = useSelector(selectAllEmployees);
  const [listName, setListName] = useState<string>(editItem?.name || '');
  const [readAccess, setReadAccess] = useState<Array<string>>([]);
  const [showConfirm, setConfirmation] = useState<boolean>(false);
  const [showAccessView, setAccessView] = useState<boolean>(true);
  const handleDelete = (confirm: boolean) => {
    setConfirmation(false);
    if (confirm) {
      onModalHide(false);
      dispatch(deleteList(editItem?._id || ''));
      onDeleteList(null);
    }
  };

  const [recipientsIds, setReceipantsIds] = useState<any>(
    editItem?.recipients || {},
  );
  const [isDistributionActive, setDistributionEnable] =
    useState<boolean>(false);
  const loading = useSelector(
    (state: RootState) => state.list.updateListsStatus,
  );
  useEffect(() => {
    if (isVisible) {
      if (editItem) {
        setListName(editItem?.name);
        setReceipantsIds(editItem?.recipients?.ids || {});
        setDistributionEnable(editItem.isDistributionActive || false);
        setReadAccess(editItem.readAccess || []);
      } else {
        setListName('');
        setReceipantsIds({});
        setDistributionEnable(false);
        setReadAccess([]);
        setAccessView(false);
      }
    }
  }, [editItem, isVisible]);
  const addListItem = async () => {
    if (!listName) {
      GAlert('Please enter list name');
    }
    let listAdd: List = {
      name: listName,
      distributionType: 'round-robin',
      isDistributionActive: isDistributionActive,
      readAccess,
    };
    let response;
    if (editItem) {
      if (Object.keys(recipientsIds).length) {
        listAdd.recipients = {
          ids: recipientsIds,
          cursor: editItem?.recipients?.cursor || '',
          currentDistribution: editItem?.recipients?.currentDistribution || '',
        };
      }
      listAdd._id = editItem._id;
      response = await dispatch(updateList(listAdd));
    } else {
      if (Object.keys(recipientsIds).length) {
        listAdd.recipients = {
          cursor: '',
          currentDistribution: '',
          ids: recipientsIds,
        };
      }
      response = await dispatch(createList(listAdd));
    }
    if (response.meta.requestStatus === 'fulfilled') {
      dispatch(getAllList({perPage: 100}));
      setListName('');
      setReceipantsIds({});
      setDistributionEnable(false);
      setReadAccess([]);
      onModalHide(false);
    }
  };
  const handleUserSelection = async (id: string, status: boolean) => {
    const newRecipientsIds = {...recipientsIds};
    if (newRecipientsIds[id]) {
      newRecipientsIds[id] = {
        ...newRecipientsIds[id],
        waitage: status ? 1 : 0,
        status: status,
      };
    } else {
      newRecipientsIds[id] = {
        waitage: status ? 1 : 0,
        status: status,
      };
    }
    setReceipantsIds({...newRecipientsIds});
    // onReadAccessUpdate(id, status);
  };
  const onReadAccessUpdate = (memberId: string, checked: boolean) => {
    let newReadAccess = [...readAccess];
    if (!checked) {
      newReadAccess = newReadAccess.filter(_i => _i !== memberId);
    } else {
      newReadAccess.push(memberId);
    }
    setReadAccess(newReadAccess);
  };
  return (
    <GModal
      isVisible={isVisible}
      onModalHide={() => onModalHide(false)}
      loading={loading.status === ThunkStatusEnum.LOADING}>
      <View style={styles.modalView}>
        <View style={styles.headerWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.popupHeader}>
              {editItem ? 'Update List' : 'Add List'}
            </Text>
            <View style={{flexDirection: 'row'}}>
              {teamMembers && teamMembers.length ? (
                <SmallButton
                  onPress={() => setAccessView(!showAccessView)}
                  label={'Lead access'}
                />
              ) : null}
              {editItem && (
                <DeleteButton
                  onPress={() => setConfirmation(true)}
                  btnStyle={{marginLeft: 5}}
                />
              )}
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get('screen').width - 40,
            }}>
            <SectionedTextInput
              label={'List Name'}
              isRequired={true}
              placeholder={'Enter list name'}
              leftContent={
                <MaterialCommunityIcons
                  name={'format-list-bulleted'}
                  size={22}
                  color={R.colors.themeCol2}
                />
              }
              value={listName}
              onChangeText={(_listName: string) => {
                setListName(_listName);
              }}
            />
          </View>
          {teamMembers && teamMembers.length ? (
            <View style={{flex: 1}}>
              {showAccessView ? (
                <>
                  {!permission.includes('create_lead_list > lead_access') ? (
                    <>
                      <View
                        style={[
                          styles.enableDistribution,
                          {flexDirection: 'column'},
                        ]}>
                        <Text style={styles.accessText}>
                          List view access control
                        </Text>
                        <Text style={styles.accessText}>
                          Select users who will have access to this list
                        </Text>
                      </View>
                      <GFlatList
                        data={teamMembers}
                        renderItem={({item}) => (
                          <UserItemAccess
                            item={item}
                            onReadAccessUpdate={onReadAccessUpdate}
                            isReadAccess={readAccess.includes(item._id)}
                          />
                        )}
                      />
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  {!permission.includes(
                    'create_lead_list > enable_lead_distribution',
                  ) ? (
                    <>
                      <View style={styles.enableDistribution}>
                        <Text style={styles.distributionText}>
                          Enable lead distribution
                        </Text>
                        <GSwitch
                          isEnabled={isDistributionActive}
                          toggleSwitch={() =>
                            setDistributionEnable(!isDistributionActive)
                          }
                        />
                      </View>
                      <GFlatList
                        data={isDistributionActive ? teamMembers : []}
                        renderItem={({item}) => (
                          <UserItem
                            item={item}
                            onSelectionUpdate={handleUserSelection}
                            selected={
                              recipientsIds && recipientsIds[item._id]
                                ? recipientsIds[item._id].status
                                : false
                            }
                          />
                        )}
                      />
                    </>
                  ) : null}
                </>
              )}
              <View style={styles.btnContainer}>
                <Button
                  label={editItem ? 'UPDATE LEAD LIST' : 'ADD LEAD LIST'}
                  onPress={() => addListItem()}
                />
              </View>
            </View>
          ) : (
            <View style={styles.btnContainer}>
              <Button
                label={editItem ? 'UPDATE LEAD LIST' : 'ADD LEAD LIST'}
                onPress={() => addListItem()}
              />
            </View>
          )}
        </View>
      </View>
      <ConfirmationDialog
        showDialog={showConfirm}
        onConfirm={handleDelete}
        confirmationMessage={
          'Are you sure want to delete this list? All leads, task and activities also deleted.'
        }
      />
    </GModal>
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
  return (
    <View style={styles.itemContainer}>
      <Pressable
        style={styles.itemInner}
        android_ripple={R.darkTheme.grayRipple}>
        <View style={styles.imageContainer}>
          <MaterialCommunityIcons
            name={'face-agent'}
            size={30}
            color={R.colors.themeCol2}
          />
        </View>
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.nameText}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.descriptionText}>{getUserRole(item.role)}</Text>
          </View>
          <View style={styles.switchContainer}>
            <GSwitch
              isEnabled={selected}
              toggleSwitch={() => {
                onSelectionUpdate && onSelectionUpdate(item._id, !selected);
              }}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
};
export const UserItemAccess = ({
  isReadAccess = false,
  item,
  onReadAccessUpdate,
}: {
  isReadAccess: boolean;
  item: TeamMember;
  onReadAccessUpdate: (item: string, status: boolean) => void;
}) => {
  const userTeam: Nillable<Team> = useSelector((state: RootState) =>
    seletTeamById(state, item?.team || ''),
  );
  const organisation: Nillable<Organisation> = useSelector(getOrganisation);
  const organizationRoles = useSelector(
    (state: RootState) => state.user?.user?.organizationRoles || [],
  );
  const getUserRole = (roleId: Nillable<string>) => {
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
  return (
    <View style={styles.itemContainer}>
      <Pressable
        style={styles.itemInner}
        android_ripple={R.darkTheme.grayRipple}>
        <View style={styles.imageContainer}>
          <MaterialCommunityIcons
            name={'face-agent'}
            size={30}
            color={R.colors.themeCol2}
          />
        </View>
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.nameText}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.descriptionText}>
              {getUserRole(item?.role)}
            </Text>
          </View>
          <View style={styles.switchContainer}>
            <GSwitch
              isEnabled={isReadAccess}
              toggleSwitch={() => {
                onReadAccessUpdate(item._id, !isReadAccess);
              }}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  headerWrapper: {paddingHorizontal: 20},
  modalView: {
    backgroundColor: R.colors.bgCol,
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    minHeight: '30%',
    maxHeight: '90%',
    justifyContent: 'space-between',
    position: 'relative',
  },
  popupHeader: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  accessText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.themeCol1,
  },
  distributionText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  enableDistribution: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(20),
    marginBottom: moderateScale(20),
  },
  addlistButtonWrapper: {
    width: '100%',
    marginVertical: moderateScale(40),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer: {
    backgroundColor: R.colors.white,
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'lightgray',
  },
  imageStyle: {
    height: 30,
    width: 30,
  },
  imageContainer: {
    backgroundColor: R.colors.bgCol,
    padding: 5,
    borderRadius: 10,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInner: {
    flexDirection: 'row',
    padding: 10,
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
  descriptionText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.black,
    textTransform: 'capitalize',
  },
  label: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.black,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  btnContainer: {
    paddingTop: 20,
  },
});

export default AddList;
