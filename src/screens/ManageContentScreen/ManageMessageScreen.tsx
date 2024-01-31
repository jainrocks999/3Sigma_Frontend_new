import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import BackButton from '../../library/common/BackButton';
import Label from 'library/common/Label';

import AddButton from '../../library/common/AddButton';
import TagPicker from 'library/common/TagPicker';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import GScreen from 'library/wrapper/GScreen';
import GAlert from 'library/common/GAlert';
import {isEmpty} from 'lodash';
import {ContentTypeEnum} from '../../models/common/content.enum';
import {useNavigation} from '@react-navigation/native';
import {Content} from 'datalib/entity/content';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  updateContent,
  createContent,
  selectContentById,
  deleteContent,
  getContentById,
} from '../../store/slices/content.slice';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import {DeleteButton} from 'library/common/ButtonGroup';

const ManageMessageScreen = (props: any) => {
  let contentId = props.route.params?.contentId || -1;
  const editItem = useSelector((state: RootState) =>
    selectContentById(state, contentId),
  );
  const dispatch = useDispatch<RootDispatch>();
  const [showConfirm, setConfirmation] = useState<boolean>(false);
  const handleDelete = async (confirm: boolean) => {
    setConfirmation(false);
    if (confirm) {
      await dispatch(deleteContent(editItem?._id || ''));
      navigation.goBack();
    }
  };
  const navigation = useNavigation();
  const updateContentStatus = useSelector(
    (state: RootState) => state.content.updateContentStatus,
  );
  const [title, setTitle] = useState(editItem?.details?.title || '');
  const [cursorPosition, setCursorPosition] = useState({end: 0});
  const [message, setMessage] = useState(editItem?.details?.message || '');
  const [selectedTag, setSelectedTag] = useState<Array<string>>(
    editItem?.details?.tags || ['no_tag'],
  );
  const handleTagSelect = (_value: string) => {
    setSelectedTag([_value]);
  };
  const handleSavePress = async () => {
    if (isEmpty(title)) {
      GAlert('Title cannot not empty');
      return;
    }
    if (isEmpty(message)) {
      GAlert('Message cannot not empty');
      return;
    }
    const contentPayload: Content = {
      details: {
        title,
        tags: selectedTag,
        message,
      },
    };
    let response = null;
    if (editItem) {
      contentPayload._id = editItem._id;
      response = await dispatch(updateContent(contentPayload));
    } else {
      contentPayload.type = ContentTypeEnum.MESSAGE;
      response = await dispatch(createContent(contentPayload));
    }
    if (response && response.meta.requestStatus === 'fulfilled') {
      dispatch(getContentById(editItem ? editItem._id : response.payload?._id));
      navigation.goBack();
    }
  };
  const handleAddLeadName = () => {
    setMessage(
      `${message.slice(0, cursorPosition.end)} @lead name ${message.slice(
        cursorPosition.end,
      )}`,
    );
  };

  return (
    <GScreen loading={updateContentStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.container}>
        <View style={styles.backButtonBox}>
          <BackButton title={editItem ? 'Edit Message' : 'Add Message'} />
          {editItem ? (
            <DeleteButton onPress={() => setConfirmation(true)} />
          ) : null}
        </View>
        <ScrollView contentContainerStyle={styles.containerStyle}>
          <SectionedTextInput
            label={'Title'}
            placeholder={'Enter title'}
            onChangeText={setTitle}
            defaultValue={title}
          />
          <View>
            <Label text={'Tags'} />
            <TagPicker
              tagKey={PrefrenceKeyEnum.MESSAGE_TAG}
              tagLabel={'+ New Tag'}
              selectedTags={selectedTag}
              onTagSelect={handleTagSelect}
              showScrolView={false}
            />
          </View>
          <SectionedTextInput
            label={'Message'}
            multiLine={true}
            numberOfLines={7}
            height={200}
            blurOnSubmit={false}
            showCharacterCount
            characterCount={message.length}
            placeholder={'Enter your message'}
            onChangeText={setMessage}
            value={message}
            onSelectionChange={(event: any) =>
              setCursorPosition(event.nativeEvent.selection)
            }
          />
          <TouchableOpacity
            onPress={handleAddLeadName}
            style={styles.addLeadCont}>
            <Text style={styles.addLeadText}>Add @lead name</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.adButtonWrapper}>
          <AddButton
            title={editItem ? 'Edit Message' : 'Add Message'}
            onPress={handleSavePress}
          />
        </View>
      </View>
      <ConfirmationDialog
        showDialog={showConfirm}
        onConfirm={handleDelete}
        confirmationMessage={'Are you sure want to delete?'}
      />
    </GScreen>
  );
};

export default ManageMessageScreen;
