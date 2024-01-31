import {View, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import BackButton from '../../library/common/BackButton';
import Label from 'library/common/Label';
import UploadImage, {FileRelationEnum} from '../../library/common/UploadImage';
import AddButton from '../../library/common/AddButton';
import TagPicker from 'library/common/TagPicker';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import MapsInput from 'library/form-field/MapsInput';
import GScreen from 'library/wrapper/GScreen';
import GAlert from 'library/common/GAlert';
import {isEmpty} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import {Content} from 'datalib/entity/content';
import {useDispatch, useSelector} from 'react-redux';
import {ContentTypeEnum} from '../../models/common/content.enum';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  updateContent,
  createContent,
  getContentById,
  selectContentById,
  deleteContent,
} from '../../store/slices/content.slice';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import DocumentPicker from 'react-native-document-picker';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import Helper from '../../utils/helper';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import {DeleteButton} from 'library/common/ButtonGroup';
import {Nillable} from '../../models/custom.types';
import {deleteFiles} from '../../store/slices/lead.slice';

const ManagePageScreen = (props: any) => {
  let contentId = props.route.params?.contentId || -1;
  const editItem: Nillable<Content> = useSelector((state: RootState) =>
    selectContentById(state, contentId),
  );
  const dispatch = useDispatch<RootDispatch>();
  const [showConfirm, setConfirmation] = useState<boolean>(false);
  const handleDelete = async (confirm: boolean) => {
    setConfirmation(false);
    if (confirm) {
      await dispatch(deleteContent(editItem?._id || '-1'));
      navigation.goBack();
    }
  };
  const navigation = useNavigation();
  const fileUploadStatus = useSelector(
    (state: RootState) => state.lead.fileUploadStatus,
  );
  const updateContentStatus = useSelector(
    (state: RootState) => state.content.updateContentStatus,
  );
  const [title, setTitle] = useState(editItem?.details?.title || '');
  const [address, onChangeAddress] = useState(editItem?.details?.address || '');
  const [description, setDescription] = useState(
    editItem?.details?.description || '',
  );
  const [videoUrl, setVideoUrl] = useState(editItem?.details?.videoUrl || '');
  const [mapLocation, setMapLocation] = useState(
    editItem?.details?.location || '',
  );
  const [selectedTag, setSelectedTag] = useState<Array<string>>(
    editItem?.details?.tags || ['no_tag'],
  );
  const [filesToUpload, setFilesToUpload] = useState<Array<any>>([]);
  const handleTagSelect = (_value: string) => {
    setSelectedTag([_value]);
  };
  const [images, setImages] = useState<Array<any>>(
    editItem?.files ? editItem?.files : [],
  );
  const handleSavePress = async () => {
    if (isEmpty(title)) {
      GAlert('Title cannot not empty');
      return;
    }
    if (isEmpty(description)) {
      GAlert('Desription cannot not empty');
      return;
    }
    // if (isEmpty(imageUrl)) {
    //   GAlert('Upload a file');
    //   return;
    // }
    const contentPayload: Content = {
      details: {
        title,
        tags: selectedTag,
        description,
        videoUrl,
        location: mapLocation,
        address,
      },
    };
    let response = null;
    if (editItem) {
      contentPayload._id = editItem._id;
      response = await dispatch(updateContent(contentPayload));
    } else {
      contentPayload.type = ContentTypeEnum.PAGE;
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
          <BackButton title={editItem ? 'Edit Page' : 'Add Page'} />
          {editItem ? (
            <DeleteButton onPress={() => setConfirmation(true)} />
          ) : null}
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          keyboardVerticalOffset={-100}
          style={[styles.container]}>
          <ScrollView
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <SectionedTextInput
              defaultValue={title}
              label={'Title'}
              placeholder={'Enter title'}
              onChangeText={setTitle}
            />

            <View>
              <Label text={'Tags'} />
              <TagPicker
                tagKey={PrefrenceKeyEnum.PAGE_TAG}
                tagLabel={'+ New Tag'}
                selectedTags={selectedTag}
                onTagSelect={handleTagSelect}
                showScrolView={false}
              />
            </View>
            <SectionedTextInput
              label={'Description'}
              multiLine={true}
              numberOfLines={7}
              placeholder={'Enter description'}
              containerStyle={{height: 130, paddingVertical: 10}}
              onChangeText={setDescription}
              defaultValue={description}
            />
            <SectionedTextInput
              defaultValue={videoUrl}
              label={'Youtube Embedded video urls'}
              placeholder={'Enter video url(s)...url1,url2'}
              onChangeText={setVideoUrl}
            />
            <MapsInput
              defaultAddress={address}
              defaultCoords={mapLocation}
              mapViewStyle={{height: 200}}
              onChangeCoords={setMapLocation}
              onChangeAddress={onChangeAddress}
              label={'Add Map'}
              type="map"
            />
            <UploadImage
              label={'Upload Image'}
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
              fileTypes={DocumentPicker.types.images}
              // files={editItem?.files || filesToUpload || []}
              files={[...images, ...filesToUpload]}
              multiple
              onDeletePress={handleDeleteFile}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.adButtonWrapper}>
          <AddButton
            title={editItem ? 'Save' : 'Add Page'}
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

export default ManagePageScreen;
