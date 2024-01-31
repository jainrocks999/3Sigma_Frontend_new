import {useNavigation} from '@react-navigation/native';
import {BulkActionPayload, Lead} from 'datalib/entity/lead';
import ListModal from 'library/common/ListModal';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import ListSelectionModal from 'library/modals/ListSelectionModal';
import UserSelectionModal from 'library/modals/UserSelectionModal';
import React, {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  LEAD_OPTION_ACTIONS,
  LEAD_OPTION_ACTIONS_NON_DELETABLE,
} from '../../../configs/constants';
import {ListActionEnum} from '../../../models/common/list.action.enum';
import ScreenNameEnum from '../../../models/routes/screenName.enum';
import {RootDispatch, RootState} from '../../../store/app.store';
import {
  bulkAssignLeads,
  copyLeadsInList,
  deleteMultiLeads,
  leadByIdSelector,
  moveLeadsInList,
} from '../../../store/slices/lead.slice';
import Contacts, {Contact} from 'react-native-contacts';
import {
  currentUserSelector,
  selectPermissions,
} from '../../../store/slices/user.slice';
import {Nillable} from '../../../models/custom.types';
import {User} from 'datalib/entity/user';
import {ContentTypeEnum} from '../../../models/common/content.enum';
import {selectAllContentByType} from '../../../store/slices/content.slice';
import GAlert from 'library/common/GAlert';
import ga from 'library/hooks/analytics';
interface LeadOptionActions {
  leadId: string;
  list?: string;
  phone: string;
  name: string;
  showOptionModal: boolean;
  onModalHide: (showOptionModal: boolean) => void;
}
const LeadOptionActions = ({
  leadId,
  list,
  phone,
  name,
  showOptionModal,
  onModalHide,
}: LeadOptionActions) => {
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const user: Nillable<User> = useSelector(currentUserSelector);
  const permission: Array<string> = useSelector(selectPermissions);
  const [showDeleteConfirmation, setDeleteConfirmation] =
    useState<boolean>(false);
  const [showUserOptions, setShowUserOptions] = useState<boolean>(false);
  const [quickShareOptions, setQuickShareOptions] = useState<Array<any>>([]);
  const [showShareOptions, setShowShareOptions] = useState<boolean>(false);
  const [sharableContentType, setSharableContentType] =
    useState<Nillable<ContentTypeEnum>>();
  const [showSharableContent, setShowSharableContent] =
    useState<boolean>(false);
  const [sharableContent, setSharableContent] = useState<Array<any>>([]);
  const leadDetails: Nillable<Lead> = useSelector((state: RootState) =>
    leadByIdSelector(state, leadId),
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
  const [showListOptions, setShowListOptions] = useState<boolean>(false);
  const [listAction, setListAction] = useState<ListActionEnum | null>(null);
  const handleOptionSelect = (action: string) => {
    onModalHide(false);
    switch (action) {
      case 'edit':
        navigation.navigate(ScreenNameEnum.UPDATE_LEAD_SCREEN, {
          leadId: leadId,
        });
        break;
      case 'phonebook':
        handleAddToPhonebook();
        break;
      case 'checkin':
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
      case 'add_quotation':
        ga.logEvent('Add_New_Quotation');
        navigation.navigate(ScreenNameEnum.CREATE_QUOTATION_SCREEN, {
          leadId: leadId,
        });
        break;
      case 'quick_share':
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
    }
  };

  const onUserSelect = async (selectionOptions: any) => {
    setShowUserOptions(false);
    const payload: BulkActionPayload = {
      leadIds: [leadId],
      assignToUser: selectionOptions?._id,
    };

    await dispatch(bulkAssignLeads(payload));
    // if (response.meta.requestStatus === 'fulfilled') {
    //   await dispatch(getLeadsById(leadId));
    // }
  };
  const onListSelect = (selectionOptions: any) => {
    setShowListOptions(false);
    const payload: BulkActionPayload = {
      targetListId: selectionOptions?._id,
      leadIDs: [leadId],
    };
    if (listAction === ListActionEnum.COPY) {
      dispatch(copyLeadsInList(payload));
    } else if (listAction === ListActionEnum.MOVE) {
      dispatch(moveLeadsInList(payload));
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };
  const onDeleteConfirmation = async (confirmation: boolean) => {
    setDeleteConfirmation(false);
    if (confirmation) {
      const payload: BulkActionPayload = {
        leadIDs: [leadId],
      };
      await dispatch(deleteMultiLeads(payload));
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
    onModalHide(false);
  };
  const handleAddToPhonebook = () => {
    var newPerson: Partial<Contact> = {
      phoneNumbers: [
        {
          label: 'mobile',
          number: phone,
        },
      ],
      displayName: name,
    };

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          title: 'Contacts',
          message: '3sigma wants to access your phonebook',
          buttonPositive: 'Please accept',
        },
      ).then(() => {
        Contacts.openContactForm(newPerson).then(contact => {
          console.log('Contact added to your phonebook', contact);
        });
      });
    } else {
      Contacts.openContactForm(newPerson).then(contact => {
        console.log('Contact added to your phonebook', contact);
      });
    }
  };
  const handleShareContentSelect = (contentId: string) => {
    navigation.navigate(ScreenNameEnum.SHARE_CONTENT_SCREEN, {
      leadIds: [leadId],
      contentId: contentId,
      type: sharableContentType,
    });
  };
  const isDeletable =
    !permission.includes('lead_profile_screen > options_modal > delete') ||
    leadDetails?.createdBy === user?._id;
  return (
    <>
      <ListModal
        display={showOptionModal}
        onModalClose={() => onModalHide(!showOptionModal)}
        data={
          isDeletable ? LEAD_OPTION_ACTIONS : LEAD_OPTION_ACTIONS_NON_DELETABLE
        }
        // onItemSelect={handleOptionSelect}
        onItemSelect={(arg: string) => {
          onModalHide(false);
          setTimeout(() => {
            handleOptionSelect(arg);
          }, 400);
        }}
        title={'Lead Options'}
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
        excludeOptions={list ? [list] : ['default_list']}
      />
      <ConfirmationDialog
        showDialog={showDeleteConfirmation}
        onConfirm={onDeleteConfirmation}
        confirmationMessage={'Are you sure you want to delete?'}
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
    </>
  );
};
export default LeadOptionActions;
