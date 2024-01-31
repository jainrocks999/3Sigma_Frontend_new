import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../styles';
import Tag from 'library/common/Tag';
import R from 'resources/R';
import LeadSelectionModal from 'library/modals/LeadSelectionModal';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../../models/routes/screenName.enum';
import ListModal from 'library/common/ListModal';
import {CONTENT_OPTION_ACTIONS} from '../../../configs/constants';
import {useDispatch, useSelector} from 'react-redux';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import {RootDispatch} from '../../../store/app.store';
import {deleteContent, shareContent} from '../../../store/slices/content.slice';
import GAlert, {MessageType} from 'library/common/GAlert';
import Clipboard from '@react-native-clipboard/clipboard';
import WebViewModal from 'library/modals/WebViewModal';
import {ENVIRONMENT, WEBPAGE_URL} from '../../../../env';
import {ContentTypeTagsEnum} from '../../../models/common/content.enum';
import {Nillable} from '../../../models/custom.types';
import {currentUserSelector} from '../../../store/slices/user.slice';
import {User} from 'datalib/entity/user';

const ContentItem = ({item, selected, createScreen}: any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const user: Nillable<User> = useSelector(currentUserSelector);
  const [showConfirm, setConfirmation] = useState<boolean>(false);
  const [isPreview, setPreview] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const handleDelete = (confirm: boolean) => {
    setConfirmation(false);
    if (confirm) {
      dispatch(deleteContent(item._id));
    }
  };
  const [showLeadPicker, setShowLeadPicker] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const {details} = item;
  const handleLeadSelect = (leadIds: Array<string>) => {
    if (leadIds && leadIds.length) {
      setShowLeadPicker(false);
      navigation.navigate(ScreenNameEnum.SHARE_CONTENT_SCREEN, {
        leadIds,
        contentId: item._id,
        type: item.type,
        selectAll: selectAll,
      });
    } else {
      GAlert('Please select leads to continue');
    }
  };
  const handleOptionSelect = async (action: string) => {
    setShowOptionModal(false);
    switch (action) {
      case 'edit':
        navigation.navigate(createScreen, {
          contentId: item._id,
        });
        break;
      case 'share':
        setShowLeadPicker(true);
        break;
      case 'preview':
        setPreviewUrl(
          `${WEBPAGE_URL[ENVIRONMENT]}${item.type}/${
            details.uniqueLinkId || ''
          }?u=${user?._id}`,
        );
        setPreview(true);
        break;
      case 'copy_link':
        copySharableLink();
        break;
      case 'delete':
        setConfirmation(true);
        break;
    }
  };
  const copySharableLink = async () => {
    const response = await dispatch(
      shareContent({
        contentId: item._id || '',
        leadIds: [],
        performedAt: new Date().toISOString(),
        contentType: item.type,
      }),
    );
    if (response.payload.uniqueLink) {
      copyToClipboard(response.payload.uniqueLink);
    }
  };
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    GAlert('Link copied to clipboard', MessageType.SUCCESS);
  };
  return (
    <View style={selected ? styles.messageWrapper : styles.messageWrapper}>
      <Pressable
        style={styles.messageWrapperInner}
        android_ripple={R.darkTheme.grayRipple}
        onPress={() => setShowOptionModal(true)}>
        <View style={styles.middle}>
          <View style={styles.titleContainer}>
            <Text style={styles.messageTitle} numberOfLines={1}>
              {details.title}
            </Text>
            {details.tags && (
              <View style={styles.tagWrapper}>
                <Tag
                  tags={details.tags}
                  tagKey={ContentTypeTagsEnum[item.type]}
                />
              </View>
            )}
          </View>
          {details.description && (
            <Text style={styles.messageDescription} numberOfLines={2}>
              {details.description}
            </Text>
          )}
          {details.message && (
            <Text style={styles.messageDescription} numberOfLines={2}>
              {details.message}
            </Text>
          )}
          <Text style={styles.ownerDescription}>
            Created By : {item.createdBy || 'Owner'}
          </Text>
        </View>
      </Pressable>
      <LeadSelectionModal
        isVisible={showLeadPicker}
        onModalHide={setShowLeadPicker}
        onOptionSelect={handleLeadSelect}
        isMultiSelect={true}
        onSelectAll={setSelectAll}
      />
      <ListModal
        display={showOptionModal}
        onModalClose={() => setShowOptionModal(false)}
        data={CONTENT_OPTION_ACTIONS[item.type]}
        onItemSelect={handleOptionSelect}
        title={'Conetnt Options'}
      />
      <ConfirmationDialog
        showDialog={showConfirm}
        onConfirm={handleDelete}
        confirmationMessage={`Are you sure, you want to delete this ${item.type} template?`}
      />
      <WebViewModal
        weburl={previewUrl}
        isVisible={isPreview}
        handleURlChangeActions={function (weburl: string): void {}}
        onModalHide={setPreview}
      />
    </View>
  );
};

export default ContentItem;
