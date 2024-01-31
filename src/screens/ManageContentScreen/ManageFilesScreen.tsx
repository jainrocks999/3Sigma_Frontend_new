import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
import BackButton from '../../library/common/BackButton';
import Label from 'library/common/Label';
import UploadImage, {FileRelationEnum} from '../../library/common/UploadImage';
import {styles} from './styles';
import TagPicker from 'library/common/TagPicker';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import AddButton from 'library/common/AddButton';

import GAlert from 'library/common/GAlert';
import {isEmpty} from 'lodash';
import {RootDispatch, RootState} from '../../store/app.store';
import {useDispatch, useSelector} from 'react-redux';
import {
  createContent,
  deleteContent,
  getContentById,
  selectContentById,
  updateContent,
} from '../../store/slices/content.slice';
import {Content} from 'datalib/entity/content';
import {useNavigation} from '@react-navigation/native';
import {ContentTypeEnum} from '../../models/common/content.enum';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import GScreen from 'library/wrapper/GScreen';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import DocumentPicker from 'react-native-document-picker';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import {DeleteButton} from 'library/common/ButtonGroup';
import Helper from '../../utils/helper';
import {deleteFiles} from '../../store/slices/lead.slice';

export default function ManageFilesScreen(props: any) {
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
  const updateContentStatus = useSelector(
    (state: RootState) => state.content.updateContentStatus,
  );
  const fileUploadStatus = useSelector(
    (state: RootState) => state.lead.fileUploadStatus,
  );
  const navigation = useNavigation();

  const [selectedTag, setSelectedTag] = useState<Array<string>>(
    editItem?.details?.tags || ['no_tag'],
  );
  const [title, setTitle] = useState(editItem?.details?.title || '');
  const [description, setDescription] = useState(
    editItem?.details?.description || '',
  );
  const [images, setImages] = useState<Array<any>>(
    editItem?.files ? editItem?.files : [],
  );
  const [filesToUpload, setFilesToUpload] = useState<Array<any>>([]);
  const handleTagSelect = (_value: string) => {
    setSelectedTag([_value]);
  };
  const handleSavePress = async () => {
    if (isEmpty(title)) {
      GAlert('Title cannot not empty');
      return;
    }
    // if (isEmpty(description)) {
    //   GAlert('Desription cannot not empty');
    //   return;
    // }
    const contentPayload: Content = {
      details: {
        title,
        tags: selectedTag,
        description,
      },
    };
    let response = null;
    if (editItem) {
      contentPayload._id = editItem._id;
      response = await dispatch(updateContent(contentPayload));
    } else {
      contentPayload.type = ContentTypeEnum.FILE;
      response = await dispatch(createContent(contentPayload));
      if (response.meta.requestStatus === 'fulfilled' && filesToUpload.length) {
        await Helper.handleFileUpload(
          dispatch,
          filesToUpload,
          FileRelationEnum.content,
          response.payload?._id || '',
        );
      }
    }
    if (response && response.meta.requestStatus === 'fulfilled') {
      dispatch(getContentById(editItem ? editItem._id : response.payload?._id));
      navigation.goBack();
    }
  };
  const handleDeleteFile = async (index: any) => {
    if (typeof index !== 'number') {
      const _files = images.filter(_i => _i?.fileName !== index?.fileName);
      setImages(_files);
      dispatch(
        deleteFiles({
          type: 'content',
          content: editItem?._id,
          filePaths: [index?.filePath],
        }),
      );
      await dispatch(getContentById(editItem?._id || ''));
    } else {
      const _files = [...filesToUpload];
      _files.splice(index, 1);
      setFilesToUpload(_files);
    }
  };
  return (
    <GScreen
      loading={
        updateContentStatus.status === ThunkStatusEnum.LOADING ||
        fileUploadStatus.status === ThunkStatusEnum.LOADING
      }>
      <View style={styles.container}>
        <View style={styles.backButtonBox}>
          <BackButton title={editItem ? 'Edit File' : 'Add File'} />
          {editItem ? (
            <DeleteButton onPress={() => setConfirmation(true)} />
          ) : null}
        </View>
        <ScrollView contentContainerStyle={styles.containerStyle}>
          <SectionedTextInput
            isRequired
            defaultValue={title}
            label={'Title'}
            placeholder={'Enter title'}
            onChangeText={setTitle}
          />

          <View>
            <Label text={'Tags'} />
            <TagPicker
              tagKey={PrefrenceKeyEnum.FILE_TAG}
              tagLabel={'+ New Tag'}
              firstSelected={false}
              selectedTags={selectedTag}
              onTagSelect={handleTagSelect}
              showScrolView={false}
            />
          </View>
          <SectionedTextInput
            isRequired
            label={'Description'}
            defaultValue={description}
            multiLine={true}
            numberOfLines={7}
            placeholder={'Enter description'}
            containerStyle={{height: 130}}
            onChangeText={setDescription}
          />
          <View>
            <UploadImage
              label={'Upload Files'}
              onFileSelect={(file: Array<any>) => {
                setFilesToUpload([...filesToUpload, ...file]);
                if (editItem) {
                  Helper.handleFileUpload(
                    dispatch,
                    file,
                    FileRelationEnum.content,
                    editItem._id || '',
                  );
                  dispatch(getContentById(editItem._id || ''));
                }
              }}
              multiple
              fileTypes={DocumentPicker.types.allFiles}
              files={[...images, ...filesToUpload]}
              onDeletePress={handleDeleteFile}
            />
          </View>
        </ScrollView>
        <View style={styles.adButtonWrapper}>
          <AddButton title={'Add File'} onPress={handleSavePress} />
        </View>
      </View>
      <ConfirmationDialog
        showDialog={showConfirm}
        onConfirm={handleDelete}
        confirmationMessage={'Are you sure want to delete?'}
      />
    </GScreen>
  );
}
