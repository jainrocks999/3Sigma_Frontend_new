/* Libraries */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
  StyleSheet,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import GAlert from 'library/common/GAlert';
import R from 'resources/R';
import GScreen from 'library/wrapper/GScreen';
import GFlatList from 'library/common/GFlatList';
import {Nillable} from '../../models/custom.types';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import BackButton from 'library/common/BackButton';
import {useDispatch, useSelector} from 'react-redux';
import {
  getFilterLeads,
  getLeads,
  leadByIdSelector,
  selectLeadIds,
} from '../../store/slices/lead.slice';
import {RootDispatch, RootState} from '../../store/app.store';
import {Lead} from 'datalib/entity/lead';
import ListModal from 'library/common/ListModal';
import {SHARE_VIA} from '../../configs/constants';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import {IconButton} from 'library/common/ButtonGroup';
import {ContentTypeEnum} from '../../models/common/content.enum';
import {
  selectContentById,
  shareContent,
} from '../../store/slices/content.slice';
import {Content} from 'datalib/entity/content';
import {currentUserSelector} from '../../store/slices/user.slice';
import {User} from 'datalib/entity/user';
import {
  LeadListEnum,
  ThunkStatusEnum,
} from '../../models/common/thunkStatus.enum';
import {ENVIRONMENT, WEBPAGE_URL} from '../../../env';
import {createActivity} from '../../store/slices/activity.slice';

// CONSTANTS
enum ShareMediumEnum {
  whatsapp = 'whatsapp',
  message = 'message',
  email = 'email',
}
const ShareContentScreen = (props: any) => {
  const contentId: string = props.route.params.contentId || '';
  const contentType: ContentTypeEnum = props.route.params.type || '';
  const selectAll: boolean = props.route.params.selectAll || false;
  const allLeadIds = useSelector(selectLeadIds);
  const leadIds: Array<string> = selectAll
    ? allLeadIds
    : props.route.params.leadIds || [];
  const dispatch = useDispatch<RootDispatch>();
  const user: Nillable<User> = useSelector(currentUserSelector);
  const content: Nillable<Content> = useSelector((state: RootState) =>
    selectContentById(state, contentId),
  );

  const {
    totalLeads,
    leadFilterMetadata,
    leadListType,
    findLeadsStatus,
    filterLeadsStatus,
    leadPaginationMetadata,
  } = useSelector((state: RootState) => state.lead);

  const [sharingMessage, setSharingMessage] = useState<string>(
    contentType === ContentTypeEnum.MESSAGE
      ? content?.details.message || ''
      : `Hi @lead name\n\nHere's the link to view ${content?.details.title}`,
  );
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [shareCount, setShareCount] = useState({
    [ShareMediumEnum.whatsapp]: [],
    [ShareMediumEnum.message]: [],
    [ShareMediumEnum.email]: [],
  });
  const [cursorPosition, setCursorPosition] = useState({end: 0});
  const [defaultShareOption, setDefaultShareOption] = useState<ShareMediumEnum>(
    ShareMediumEnum.whatsapp,
  );

  const resetMessage = () => {
    let _sharingMessage = '';
    if (contentType === ContentTypeEnum.MESSAGE) {
      _sharingMessage = props.route.params.message;
    } else if (contentType === ContentTypeEnum.FILE) {
      _sharingMessage = `Hi @lead name\n\nHere's the link to view ${content?.details.title}`;
    } else if (contentType === ContentTypeEnum.PAGE) {
      _sharingMessage = `Hi @lead name\n\nHere's the link to view ${content?.details.title}`;
    }
    setSharingMessage(_sharingMessage);
  };

  const getSMSDivider = () => {
    return Platform.OS === 'ios' ? '&' : '?';
  };

  const handleShareWhatsapp = (item: Lead) => {
    const numberToSend = item.phone;
    if (numberToSend) {
      let phone =
        numberToSend.length > 10 ? numberToSend : `+91${numberToSend}`;
      var linkingUrl = `whatsapp://send?phone=${phone}&text=`;
      return linkingUrl;
    } else {
      GAlert(
        "Lead's contact number is not a valid one, hence sharing via whatsapp is not possible",
      );
      return null;
    }
  };

  const handleShareMessage = (item: Lead) => {
    const numberToSend = item.phone;
    if (numberToSend) {
      var linkingUrl = `sms:${numberToSend}${getSMSDivider()}body=`;
      return linkingUrl;
    } else {
      GAlert(
        "Lead's contact number is not a valid one, hence sharing via message is not possible",
      );

      return null;
    }
  };

  const handleShareEmail = (item: Lead) => {
    const emailToSend = item.email;
    if (emailToSend) {
      var linkingUrl = `mailto:${emailToSend}${getSMSDivider()}body=`;
      return linkingUrl;
    } else {
      GAlert(
        "Lead's email is not a valid one, hence sharing via email is not possible",
      );
      return null;
    }
  };

  const handleSharing = async (item: Lead) => {
    let linkingUrl: Nillable<string> = '';
    const _shareCount = shareCount[defaultShareOption];
    _shareCount.push(item._id);
    setShareCount({
      ...shareCount,
      [defaultShareOption]: _shareCount,
    });
    switch (defaultShareOption) {
      case ShareMediumEnum.message:
        linkingUrl = handleShareMessage(item);
        break;
      case ShareMediumEnum.whatsapp:
        linkingUrl = handleShareWhatsapp(item);
        break;
      case ShareMediumEnum.email:
        linkingUrl = handleShareEmail(item);
        break;
    }
    if (linkingUrl) {
      const uniqueLinkId = `${(+new Date()).toString(36)}${user?._id}`;
      var formattedSharingMessage = sharingMessage.replace(
        new RegExp('@lead name', 'g'),
        item.name ? item.name : '',
      );
      formattedSharingMessage = formattedSharingMessage.replace(
        new RegExp('@client', 'g'),
        item.name ? item.name : '',
      );
      formattedSharingMessage = formattedSharingMessage.replace(
        new RegExp('@lead', 'g'),
        item.name ? item.name : '',
      );
      if (contentType === ContentTypeEnum.MESSAGE) {
        linkingUrl = `${linkingUrl}${formattedSharingMessage}`;
      } else if (contentType === ContentTypeEnum.FILE) {
        const response = await dispatch(
          shareContent({
            contentId: contentId || '',
            leadIds: item._id ? [item._id] : [],
            performedAt: new Date().toISOString(),
            contentType: contentType,
          }),
        );
        if (response.payload.uniqueLink) {
          linkingUrl = `${linkingUrl}${formattedSharingMessage}\n${response.payload.uniqueLink}`;
        } else {
          linkingUrl = `${linkingUrl}${formattedSharingMessage}\n${WEBPAGE_URL[ENVIRONMENT]}file/${uniqueLinkId}?u=${user?._id}`;
        }
      } else if (contentType === ContentTypeEnum.PAGE) {
        const response = await dispatch(
          shareContent({
            contentId: contentId || '',
            leadIds: item._id ? [item._id] : [],
            performedAt: new Date().toISOString(),
            contentType: contentType,
          }),
        );
        if (response.payload.uniqueLink) {
          linkingUrl = `${linkingUrl}${formattedSharingMessage}\n${response.payload.uniqueLink}`;
        } else {
          linkingUrl = `${linkingUrl}${formattedSharingMessage}\n${WEBPAGE_URL[ENVIRONMENT]}file/${uniqueLinkId}?u=${user?._id}`;
        }
      }
      if (linkingUrl) {
        Linking.canOpenURL(linkingUrl)
          .then(supported => {
            if (!supported) {
              GAlert('Unable to open default app');
            } else {
              dispatch(
                createActivity({
                  type: 'share',
                  extraDetails: {
                    contentId: contentId,
                    contentType: contentType,
                  },
                  createdTimestamp: new Date().getTime(),
                  leadIds: item._id ? [item._id] : [],
                  performedAt: new Date().toISOString(),
                }),
              );
              Linking.openURL(linkingUrl || '');
            }
          })
          .catch(_err => {
            GAlert('Unable to open default app');
          });
      } else {
        GAlert('Error while creating shareble link');
      }
    }
  };

  const inserClientName = () => {
    let newMessage = `${sharingMessage.slice(
      0,
      cursorPosition.end,
    )}${' @lead name'}${sharingMessage.slice(cursorPosition.end)}`;
    setSharingMessage(newMessage);
  };
  // END UTILITY FUNCTIONS

  const shareText = {
    [ShareMediumEnum.whatsapp]: 'Share via Whatsapp',
    [ShareMediumEnum.message]: 'Share via Message',
    [ShareMediumEnum.email]: 'Share via Email',
  };
  const handleOptionSelect = (action: ShareMediumEnum) => {
    setDefaultShareOption(action);
    setShowOptionModal(false);
  };
  const handleRefreshLeads = (page = 1) => {
    if (leadListType === LeadListEnum.ALL_LEADS) {
      const payload = {...leadPaginationMetadata};
      if (leadFilterMetadata.list) {
        payload.list = leadFilterMetadata.list;
      }
      payload.page = page;
      dispatch(getLeads(payload));
    } else {
      const filterMetadaa = {...leadFilterMetadata};
      filterMetadaa.paginationParams.page = page;
      dispatch(getFilterLeads(leadFilterMetadata));
    }
  };
  const handleEndReached = ({distanceFromEnd}: any) => {
    if (selectAll) {
      if (
        distanceFromEnd > 0 &&
        findLeadsStatus.status !== ThunkStatusEnum.LOADING
      ) {
        const page =
          leadListType === LeadListEnum.ALL_LEADS
            ? leadPaginationMetadata.page || 1
            : leadFilterMetadata.paginationParams.page;

        const maxPages = Math.ceil(totalLeads / 50);
        if (maxPages >= page + 1) {
          handleRefreshLeads(page + 1);
        }
      }
    }
  };
  return (
    <GScreen>
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <BackButton title={`Share ${contentType}`} />
        </View>

        <View style={styles.sectionContainer}>
          <SectionedTextInput
            label={'Message'}
            multiLine={true}
            numberOfLines={7}
            height={200}
            blurOnSubmit={false}
            showCharacterCount
            characterCount={sharingMessage.length}
            placeholder={'Enter message'}
            onChangeText={(_sharingMessage: string) => {
              setSharingMessage(_sharingMessage);
            }}
            value={`${sharingMessage || ''}`}
            onSelectionChange={(event: any) =>
              setCursorPosition(event.nativeEvent.selection)
            }
          />

          <TouchableOpacity onPress={inserClientName}>
            <Text style={styles.addLeadText}>Add @lead name</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectionWrappr}>
          <TouchableOpacity style={{}} onPress={() => setShowOptionModal(true)}>
            <View style={styles.selectShareOption}>
              <Text style={styles.shareLabelStyle}>
                {shareText[defaultShareOption]}
              </Text>

              <View>
                <MaterialCommunityIcons
                  name={'chevron-down'}
                  color={'grey'}
                  size={25}
                />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.countContainer}>
            <Text style={styles.labelStyle}>Share count : </Text>
            <Text style={styles.labelStyle}>
              {shareCount[defaultShareOption].length}/{leadIds.length}
            </Text>
          </View>
        </View>
        <GFlatList
          data={leadIds || []}
          renderItem={({item, index}) => (
            <LeadItem
              key={index}
              leadId={item}
              shareVia={defaultShareOption}
              onSharePress={handleSharing}
              isShared={shareCount[defaultShareOption].includes(item)}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={handleEndReached}
          style={styles.listStyle}
        />
      </View>
      <ListModal
        display={showOptionModal}
        onModalClose={() => setShowOptionModal(false)}
        data={SHARE_VIA}
        onItemSelect={(action: ShareMediumEnum) => handleOptionSelect(action)}
        title={'Conetnt Options'}
      />
    </GScreen>
  );
};
const LeadItem = ({
  leadId,
  shareVia,
  onSharePress,
  isShared = true,
}: {
  leadId: string;
  shareVia: ShareMediumEnum;
  isShared: boolean;
  onSharePress: (lead: Lead) => void;
}) => {
  const leadDetails: Nillable<Lead> = useSelector((state: RootState) =>
    leadByIdSelector(state, leadId),
  );

  const shareIcons = {
    [ShareMediumEnum.whatsapp]: 'whatsapp',
    [ShareMediumEnum.message]: 'android-messages',
    [ShareMediumEnum.email]: 'email-outline',
  };
  return (
    <View style={styles.itemRow}>
      <View style={styles.flexRow}>
        <MaterialCommunityIcons
          name={'account-arrow-left'}
          color={R.colors.themeCol2}
          size={30}
        />
        <Text style={styles.leadName} numberOfLines={2}>
          {leadDetails?.name}
        </Text>
        <IconButton
          icon={isShared ? 'check' : shareIcons[shareVia]}
          iconColor={isShared ? 'white' : R.colors.themeCol2}
          onPress={() => !isShared && onSharePress(leadDetails)}
          iconSize={20}
          btnStyle={isShared ? {backgroundColor: R.colors.themeCol2} : {}}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, paddingVertical: 10},
  sectionContainer: {marginHorizontal: 20, marginBottom: 10},
  selectionWrappr: {marginHorizontal: 20},
  listStyle: {},
  countContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: R.colors.white,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addLeadText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol2,
  },
  selectShareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
  },
  shareLabelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
  },
  leadName: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    marginLeft: 5,
    flex: 1,
  },
  buttonStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 25,
    height: 40,
    width: 40,
    padding: 0,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ShareContentScreen;
