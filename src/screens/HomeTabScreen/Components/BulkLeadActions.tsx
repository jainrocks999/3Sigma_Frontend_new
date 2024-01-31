/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import {BulkActionPayload, BulkSelectionMetadata} from 'datalib/entity/lead';
import HoverButton from 'library/buttons/HoverButton';
import GAlert from 'library/common/GAlert';
import ListModal from 'library/common/ListModal';
import OptionsPopup from 'library/form-field/OptionsPopup';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import ListSelectionModal from 'library/modals/ListSelectionModal';
import UserSelectionModal from 'library/modals/UserSelectionModal';
import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {LEAD_BULK_ACTIONS} from '../../../configs/constants';
import {ContentTypeEnum} from '../../../models/common/content.enum';
import {ListActionEnum} from '../../../models/common/list.action.enum';
import {PrefrenceKeyEnum} from '../../../models/common/preference.keys.enum';
import {
  LeadListEnum,
  ThunkStatusEnum,
} from '../../../models/common/thunkStatus.enum';
import {Nillable} from '../../../models/custom.types';
import ScreenNameEnum from '../../../models/routes/screenName.enum';
import {RootDispatch, RootState} from '../../../store/app.store';
import {
  getAllContents,
  selectAllContentByType,
} from '../../../store/slices/content.slice';
import {
  bulkAssignLeads,
  copyLeadsInList,
  deleteMultiLeads,
  getFilterLeads,
  getLeads,
  moveLeadsInList,
  resetBulkSelection,
  selectBulkMetadata,
  updateLeadLabels,
  updateLeadStatus,
} from '../../../store/slices/lead.slice';
import {getAllList} from '../../../store/slices/list.slice';
import {
  currentUserSelector,
  selectPrefrence,
} from '../../../store/slices/user.slice';

interface BulkLeadActions {}
const BulkLeadActions = ({}: BulkLeadActions) => {
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const [showOptionModal, setShowOptionModal] = useState<boolean>(false);
  const bulkMetadata: BulkSelectionMetadata = useSelector(selectBulkMetadata);
  const user: Nillable<User> = useSelector(currentUserSelector);
  const {leadFilterMetadata, leadListType, leadPaginationMetadata} =
    useSelector((state: RootState) => state.lead);

  const statusList = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.STATUS),
  );
  const pages = useSelector((state: RootState) =>
    selectAllContentByType(state, ContentTypeEnum.PAGE),
  );
  const messages = useSelector((state: RootState) =>
    selectAllContentByType(state, ContentTypeEnum.MESSAGE),
  );
  const files = useSelector((state: RootState) =>
    selectAllContentByType(state, ContentTypeEnum.FILE),
  );
  const labelList = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.LABELS),
  );
  const [bulkOptions] = useState(
    LEAD_BULK_ACTIONS.filter(
      i => !i.restrictedRole.includes(user?.role?.name || ''),
    ),
  );
  const {fetchContentStatus} = useSelector((state: RootState) => state.content);

  const [showDeleteConfirmation, setDeleteConfirmation] =
    useState<boolean>(false);
  const [sharableContentType, setSharableContentType] =
    useState<Nillable<ContentTypeEnum>>();
  const [sharableContent, setSharableContent] = useState<Array<any>>([]);
  const [showUserOptions, setShowUserOptions] = useState<boolean>(false);
  const [showSharableContent, setShowSharableContent] =
    useState<boolean>(false);
  const [quickShareOptions, setQuickShareOptions] = useState<Array<any>>([]);
  const [showShareOptions, setShowShareOptions] = useState<boolean>(false);
  const [showStatusOptions, setShowStatusOptions] = useState<boolean>(false);
  const [showLabelOptions, setShowLabelOptions] = useState<boolean>(false);
  const [showListOptions, setShowListOptions] = useState<boolean>(false);
  const [listAction, setListAction] = useState<ListActionEnum | null>(null);
  useEffect(() => {
    if (showOptionModal && fetchContentStatus.status === ThunkStatusEnum.IDLE) {
      dispatch(
        getAllContents({
          orderBy: 'createdAt',
          isAscending: true,
          page: 1,
          perPage: 500,
        }),
      );
    }
  }, [showOptionModal]);
  const handleOptionSelect = (action: string) => {
    setShowOptionModal(false);
    switch (action) {
      case 'share':
        const shareOptions = [];
        let isBlank = true;
        if (pages && pages.length) {
          isBlank = false;
          shareOptions.push({
            name: 'Page',
            value: 'page',
            icon: 'page-layout-header',
          });
        }
        if (messages && messages.length) {
          isBlank = false;
          shareOptions.push({
            name: 'Message',
            value: 'message',
            icon: 'android-messages',
          });
        }
        if (files && files.length) {
          isBlank = false;
          shareOptions.push({
            name: 'Files',
            value: 'files',
            icon: 'file-multiple',
          });
        }
        if (isBlank) {
          GAlert('You currently have no shareable content');
        } else {
          setQuickShareOptions(shareOptions);
        }
        setShowShareOptions(true);
        break;
      case 'status':
        setShowStatusOptions(true);
        break;
      case 'label':
        setShowLabelOptions(true);
        break;
      case 'copy_list':
        setListAction(ListActionEnum.COPY);
        setShowListOptions(true);
        break;
      case 'move_list':
        setListAction(ListActionEnum.MOVE);
        setShowListOptions(true);
        break;
      case 'assign':
        setShowUserOptions(true);
        break;
      case 'delete':
        setDeleteConfirmation(true);
        break;
      case 'task':
        const selectedLeadIds = [...bulkMetadata.leadIds];
        dispatch(resetBulkSelection());
        navigation.navigate(ScreenNameEnum.CREATE_TASK_SCREEN, {
          leadIds: selectedLeadIds,
        });
        break;
    }
  };
  useEffect(() => {
    dispatch(resetBulkSelection());
  }, [leadFilterMetadata?.list]);
  const onStatusSelect = async (selectionOptions: any) => {
    if (selectionOptions) {
      const payload: BulkActionPayload = {
        leadIDs: bulkMetadata.leadIds,
        status: selectionOptions.value,
      };
      if (bulkMetadata.selectAllStatus) {
        payload.filterPrams = leadFilterMetadata;
        // payload.leadIDs = leadIds;
      }
      await dispatch(updateLeadStatus(payload));
      reloadLeads();
      dispatch(resetBulkSelection());
    }
  };
  const onLabelSelect = async (selectionOptions: Array<any>) => {
    if (selectionOptions.length) {
      const payload: BulkActionPayload = {
        leadIDs: bulkMetadata.leadIds,
        label: selectionOptions,
      };
      if (bulkMetadata.selectAllStatus) {
        payload.filterPrams = leadFilterMetadata;
        // payload.leadIDs = leadIds;
      }
      await dispatch(updateLeadLabels(payload));
      reloadLeads();
      dispatch(resetBulkSelection());
    }
  };
  const onUserSelect = async (selectionOptions: Array<any>) => {
    if (selectionOptions) {
      const payload: BulkActionPayload = {
        leadIds: bulkMetadata.leadIds,
        assignToUser: selectionOptions?._id || '',
      };
      if (bulkMetadata.selectAllStatus) {
        payload.filterPrams = leadFilterMetadata;
        // payload.leadIds = leadIds;
      }
      await dispatch(bulkAssignLeads(payload));
      reloadLeads();
      dispatch(resetBulkSelection());
      setShowUserOptions(false);
    }
  };
  const onListSelect = async (selectionOptions: Array<any>) => {
    if (selectionOptions) {
      setShowListOptions(false);
      const payload: BulkActionPayload = {
        targetListId: selectionOptions._id,
        leadIDs: bulkMetadata.leadIds,
      };
      if (bulkMetadata.selectAllStatus) {
        payload.filterPrams = leadFilterMetadata;
        payload.isAll = bulkMetadata.selectAllStatus;
      }
      if (listAction === ListActionEnum.COPY) {
        await dispatch(copyLeadsInList(payload));
      } else if (listAction === ListActionEnum.MOVE) {
        await dispatch(moveLeadsInList(payload));
      }
      await reloadLeads();
      dispatch(resetBulkSelection());
      await dispatch(getAllList({perPage: 100}));
    }
  };
  const onDeleteConfirmation = async (confirmation: boolean) => {
    setDeleteConfirmation(false);
    if (confirmation) {
      const payload: BulkActionPayload = {
        leadIDs: bulkMetadata.leadIds,
      };
      if (bulkMetadata.selectAllStatus) {
        payload.filterPrams = leadFilterMetadata;
        // payload.leadIDs = leadIds;
      }
      await dispatch(deleteMultiLeads(payload));
      reloadLeads();
      dispatch(resetBulkSelection());
    }
  };
  const reloadLeads = () => {
    if (leadListType === LeadListEnum.ALL_LEADS) {
      const payload = {...leadPaginationMetadata};
      if (leadFilterMetadata.list) {
        payload.list = leadFilterMetadata.list;
      }
      payload.page = 1;
      dispatch(getLeads(payload));
    } else {
      leadFilterMetadata.paginationParams.page = 1;
      dispatch(getFilterLeads(leadFilterMetadata));
    }
  };
  const handleShareContentSelect = (contentId: string) => {
    dispatch(resetBulkSelection());
    navigation.navigate(ScreenNameEnum.SHARE_CONTENT_SCREEN, {
      leadIds: bulkMetadata.leadIds,
      contentId: contentId,
      type: sharableContentType,
    });
  };
  return (
    <>
      {bulkMetadata.leadIds.length || bulkMetadata.selectAllStatus ? (
        <>
          <View style={styles.bottomFixedBtn}>
            <HoverButton
              style={styles.hoverBtn}
              right
              type={'share'}
              onPress={() => setShowOptionModal(!showOptionModal)}
            />
            <HoverButton
              style={styles.hoverBtn}
              right
              type={'refresh'}
              onPress={() => dispatch(resetBulkSelection())}
            />
          </View>

          <ListModal
            display={showOptionModal}
            onModalClose={() => setShowOptionModal(!showOptionModal)}
            data={bulkOptions}
            onItemSelect={handleOptionSelect}
            title={'Bulk Actions'}
          />
          <ListModal
            display={showShareOptions}
            onModalClose={() => setShowShareOptions(!showShareOptions)}
            data={quickShareOptions}
            onItemSelect={(itemAction: string) => {
              if (itemAction === ContentTypeEnum.PAGE) {
                setSharableContentType(ContentTypeEnum.PAGE);
                setSharableContent(pages);
              }
              if (itemAction === ContentTypeEnum.FILE) {
                setSharableContentType(ContentTypeEnum.FILE);
                setSharableContent(files);
              }
              if (itemAction === ContentTypeEnum.MESSAGE) {
                setSharableContentType(ContentTypeEnum.MESSAGE);
                setSharableContent(messages);
              }
              setShowSharableContent(true);
            }}
            title={'Select content type'}
            emptyMessage={'You are not having sharable content'}
          />
          <ListModal
            display={showSharableContent}
            onModalClose={() => setShowSharableContent(!showSharableContent)}
            data={sharableContent.map(_i => ({
              name: _i?.details?.title,
              value: _i._id,
            }))}
            onItemSelect={handleShareContentSelect}
            title={`Select ${sharableContentType}`}
          />
          <UserSelectionModal
            isVisible={showUserOptions}
            onModalHide={setShowUserOptions}
            onOptionSelect={onUserSelect}
          />
          <ListSelectionModal
            isVisible={showListOptions}
            onModalHide={setShowListOptions}
            onOptionSelect={onListSelect}
            excludeOptions={
              leadFilterMetadata.list
                ? [leadFilterMetadata.list]
                : ['default_list']
            }
          />
          <OptionsPopup
            title={'Select status'}
            showOptionPopup={showStatusOptions}
            options={statusList || []}
            displayColor
            onSelection={onStatusSelect}
            toggleOptionPopup={setShowStatusOptions}
          />
          <OptionsPopup
            title={'Select labels'}
            showOptionPopup={showLabelOptions}
            options={labelList || []}
            multiSelectEnabled
            displayColor
            onSelection={onLabelSelect}
            toggleOptionPopup={setShowLabelOptions}
            dataKeys={{
              itemIdKey: 'value',
              itemTitleKey: 'name',
              itemDescriptionKey: 'description',
            }}
          />
          <ConfirmationDialog
            showDialog={showDeleteConfirmation}
            onConfirm={onDeleteConfirmation}
            confirmationMessage={'Are you sure you want to delete?'}
          />
        </>
      ) : null}
    </>
  );
};
export default BulkLeadActions;
const styles = StyleSheet.create({
  hoverBtn: {
    opacity: 1,
    position: 'relative',
    marginBottom: 10,
  },
  bottomFixedBtn: {
    position: 'absolute',
    zIndex: 999,
    right: 0,
    ...Platform.select({
      ios: {bottom: 45},
      android: {bottom: 25},
    }),
  },
});
