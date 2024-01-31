/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import AddList from '../../screens/LeadListScreen/AddList';
import R from 'resources/R';
import GModal from '../wrapper/GModal';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {getAllList, selectAllLists} from '../../store/slices/list.slice';
import GFlatList, {FooterLoader} from '../common/GFlatList';
import {List} from 'datalib/entity/List';
import {LeadFilterMetadata} from 'datalib/entity/paginatedResult';
import {
  getFilterLeads,
  getLeads,
  initialLeadFilterMetaData,
  selectFilterMetaData,
  setCallLogs,
} from '../../store/slices/lead.slice';
import {isEmpty} from 'lodash';
import {
  LeadListEnum,
  ThunkStatusEnum,
} from '../../models/common/thunkStatus.enum';
import {Nillable} from '../../models/custom.types';
import {selectPermissions} from '../../store/slices/user.slice';

const LeadListModal = ({
  isVisible,
  onModalHide,
}: {
  isVisible: boolean;
  onModalHide: (isVisible: boolean) => void;
}) => {
  const dispatch = useDispatch<RootDispatch>();

  const [addListModal, setAddListModal] = useState(false);
  const [editItem, setEditItem] = useState<Nillable<List>>(null);
  const {leadListType, leadPaginationMetadata} = useSelector(
    (state: RootState) => state.lead,
  );
  const {displayCallLogs} = useSelector((state: RootState) => state.lead);
  const {findListsStatus} = useSelector((state: RootState) => state.list);
  const permission: Array<string> = useSelector(selectPermissions);
  const leadLists: Array<List> = useSelector((state: RootState) =>
    selectAllLists(state),
  );
  const filterMetaData: LeadFilterMetadata = useSelector((state: RootState) =>
    selectFilterMetaData(state),
  );
  useEffect(() => {
    dispatch(getAllList({perPage: 100}));
  }, []);
  // useEffect(() => {
  //   if (isVisible) {
  //     dispatch(getAllList({perPage: 100}));
  //   }
  // }, [isVisible]);
  const onListSelection = (list: string | null) => {
    if (list === 'call-log') {
      dispatch(setCallLogs(true));
    } else {
      dispatch(setCallLogs(false));
      if (leadListType === LeadListEnum.ALL_LEADS) {
        const payload = {...leadPaginationMetadata};
        if (list) {
          payload.list = list;
          payload.page = 1;
        }
        dispatch(getLeads(payload));
      } else {
        const filters = {...initialLeadFilterMetaData};
        if (list) {
          filters.list = list;
        }
        dispatch(getFilterLeads(filters));
      }
    }
    onModalHide(false);
  };
  const handleListEditPress = (list: List) => {
    setEditItem(list);
    setAddListModal(true);
  };

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.rowWrapper,
          {
            backgroundColor:
              filterMetaData.list === item._id
                ? R.colors.textColor3
                : R.colors.InputGrey3,
          },
        ]}
        onPress={() => onListSelection(item._id)}>
        <View>
          <Text style={styles.itemText}>
            {item?.name}
            {/* ({item.leadCount || 0}) */}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButtonWrapper}
          onPress={() => handleListEditPress(item)}>
          <MaterialCommunityIcons
            name={'pencil'}
            color={R.colors.themeCol2}
            size={moderateScale(20)}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <GModal isVisible={isVisible} onModalHide={() => onModalHide(false)}>
        <View style={styles.modalView}>
          <View style={styles.headerWrapper}>
            <View style={styles.headerSubWrapper}>
              <View style={styles.titleView}>
                <Text style={styles.popupHeader}>Lead List</Text>
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name={'youtube'}
                    color={R.colors.IndianRed}
                    size={moderateScale(35)}
                  />
                </TouchableOpacity>
              </View>
              {!permission.includes(
                'home_screen > manage_lead_list_modal > add > new >',
              ) ? (
                <TouchableOpacity
                  style={styles.addListButton}
                  onPress={() => {
                    setEditItem(null);
                    setAddListModal(!addListModal);
                  }}>
                  <Text style={styles.addButtonText}>+ Add New</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          {findListsStatus.status === ThunkStatusEnum.LOADING ? (
            <FooterLoader isVisible />
          ) : null}
          <GFlatList
            data={leadLists || []}
            style={styles.fullWidth}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <TouchableOpacity
                onPress={() => onListSelection(null)}
                style={[
                  styles.rowWrapper,
                  {
                    backgroundColor: isEmpty(filterMetaData.list) && !displayCallLogs
                      ? R.colors.textColor3
                      : R.colors.InputGrey3,
                  },
                ]}>
                <Text style={styles.itemText}>Leads</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={() => (
              <TouchableOpacity
                onPress={() => onListSelection('call-log')}
                style={[
                  styles.rowWrapper,
                  {
                    backgroundColor: displayCallLogs
                      ? R.colors.textColor3
                      : R.colors.InputGrey3,
                  },
                ]}>
                <Text style={styles.itemText}>Call Logs</Text>
              </TouchableOpacity>
            )}
            renderItem={renderItem}
            // keyExtractor={item => item.id}
          />
        </View>
      </GModal>

      <AddList
        editItem={editItem}
        isVisible={addListModal}
        onModalHide={() => setAddListModal(!addListModal)}
        onDeleteList={onListSelection}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(5),
    marginBottom: 10,
  },
  fullWidth: {width: '100%'},
  titleView: {flexDirection: 'row', alignItems: 'center'},
  headerSubWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalView: {
    width: '100%',
    bottom: 0,
    backgroundColor: 'white',
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    padding: moderateScale(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
    minHeight: '80%',
  },

  popupHeader: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),

    color: R.colors.themeCol1,
    marginHorizontal: moderateScale(5),
  },
  addListButton: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(5),
    backgroundColor: R.colors.themeCol2,
    marginHorizontal: moderateScale(5),
  },
  addButtonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.white,
  },
  scrollStyle: {
    width: '100%',
  },
  rowWrapper: {
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: moderateScale(10),
    width: '100%',
    marginBottom: 10,
  },
  itemText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.black,
  },
  editButtonWrapper: {
    backgroundColor: R.colors.blueTransparent,
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: R.colors.blueTransparent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LeadListModal;
