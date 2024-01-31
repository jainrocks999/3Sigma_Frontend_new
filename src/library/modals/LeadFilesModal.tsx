import React, {useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import GFlatList from '../common/GFlatList';
import GModal from '../wrapper/GModal';
// import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlob from 'react-native-blob-util';
import ConfirmationDialog from './ConfirmationDialog';
import GAlert, {MessageType} from '../common/GAlert';
import {moderateScale} from 'resources/responsiveLayout';
import {useDispatch, useSelector} from 'react-redux';
import {selectPermissions, selectUserById} from '../../store/slices/user.slice';
import {RootDispatch, RootState} from '../../store/app.store';
import {ENVIRONMENT, S3_URL} from '../../../env';

import DocumentPicker from 'react-native-document-picker';
import {
  deleteFiles,
  getLeadsById,
  uploadFile,
} from '../../store/slices/lead.slice';
import Helper from '../../utils/helper';
import moment from 'moment';
import {fileType} from '../../utils/formatter';

const LeadFilesModal = ({
  isVisible,
  onModalHide,
  files = [],
  leadId,
}: {
  isVisible: boolean;
  onModalHide: (isVisible: boolean) => void;
  files: Array<any>;
  leadId: string;
}) => {
  const dispatch = useDispatch<RootDispatch>();

  const handleFileUpload = async () => {
    try {
      let selectedFile = await Helper.pickFile(
        DocumentPicker.types.allFiles,
        true,
      );
      if (selectedFile && selectedFile.length) {
        if (selectedFile.length <= 5) {
          const formData = new FormData();
          formData.append('type', 'lead');
          formData.append('lead', leadId);
          selectedFile.forEach((file: any) => {
            formData.append('files', {
              ...file,
              uri:
                Platform.OS === 'android'
                  ? file.uri
                  : file.uri.replace('file://', ''),
            });
          });
          // formData.append('files', {
          //   ...selectedFile[0],
          //   uri:
          //     Platform.OS === 'android'
          //       ? selectedFile[0].uri
          //       : selectedFile[0].uri.replace('file://', ''),
          // });
          const response = await dispatch(uploadFile(formData));
          if (response.meta.requestStatus === 'fulfilled') {
            await dispatch(getLeadsById(leadId));
          }
        } else {
          GAlert('Maximum 5 files allowed to upload');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFileDelete = async (fileName: string) => {
    const payload = {
      type: 'lead',
      lead: leadId,
      filePaths: [fileName],
    };
    const response = await dispatch(deleteFiles(payload));
    if (response.meta.requestStatus === 'fulfilled') {
      dispatch(getLeadsById(leadId));
    }
  };
  return (
    <GModal isVisible={isVisible} onModalHide={() => onModalHide(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.modalTitle}>Files ({files.length})</Text>
          <TouchableOpacity
            style={styles.addListButton}
            onPress={() => handleFileUpload && handleFileUpload()}>
            <Text style={styles.addButtonText}>+ Add New</Text>
          </TouchableOpacity>
        </View>
        <GFlatList
          data={files}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}: any) => (
            <FileItem
              item={item}
              key={index}
              handleFileDelete={handleFileDelete}
              leadId={leadId}
            />
          )}
          emptyMessage={'No files found'}
        />
      </View>
    </GModal>
  );
};

export default LeadFilesModal;
const FileItem = ({item, handleFileDelete}: any) => {
  const permission: Array<string> = useSelector(selectPermissions);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expand, setExpand] = useState<boolean>(false);
  const FILE_URL = `${S3_URL[ENVIRONMENT]}${item.filePath}`;
  const user = useSelector((state: RootState) =>
    selectUserById(state, item?.uploadedBy),
  );
  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile();
        } else {
          // If permission denied then show alert
          GAlert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
      }
    }
  };
  const downloadFile = () => {
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir + '/' + item?.fileName,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        GAlert('File downloaded successfully', MessageType.SUCCESS);
      })
      .catch(_e => {
        GAlert('Error in downloading file');
      });
  };

  // const handleFileShare = async () => {
  //   const result = await Share.share({
  //     title: 'File Share',
  //     message: `Please check out this file \n ${FILE_URL}`,
  //     url: FILE_URL,
  //   });
  //   if (result.action === Share.sharedAction) {
  //     DeviceEventEmitter.emit('refreshQuotationList');
  //   } else if (result.action === Share.dismissedAction) {
  //     console.log('dismissed', result);
  //   }
  // };

  const ext = Helper.getFileExtention(FILE_URL);
  const icon = fileType(ext[0] || '');
  return (
    <View style={styles.itemContainer}>
      <Pressable
        android_ripple={R.darkTheme.grayRipple}
        onPress={() => setExpand(!expand)}>
        <View style={styles.itemInnerContainer}>
          <View style={styles.imageContainer}>
            <View>{icon}</View>
          </View>
          <View style={styles.titleContainer}>
            <View>
              <Text style={styles.titleText}>{item?.fileName}</Text>
              <Text style={styles.detailText}>
                {item?.fileSize} -{' '}
                {moment(item?.uploadedAt).format('DD MMM YYYY')}
              </Text>
              <Text style={styles.createdByText}>
                Uploaded by : {user?.firstName} {user?.lastName}
              </Text>
            </View>
            {expand && (
              <View style={styles.actionButtons}>
                {/* <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => checkPermission()}>
                  <MaterialCommunityIcons
                    name={'eye'}
                    color={R.colors.black}
                    size={25}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => checkPermission()}>
                  <MaterialCommunityIcons
                    name={'download'}
                    color={R.colors.green}
                    size={25}
                  />
                </TouchableOpacity>
                {!permission.includes(
                  'lead_profile_screen > files > delete',
                ) ? (
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => setShowDeleteConfirm(true)}>
                    <MaterialCommunityIcons
                      name={'trash-can-outline'}
                      color={R.colors.IndianRed}
                      size={25}
                    />
                  </TouchableOpacity>
                ) : null}
                {/* <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleFileShare}>
                  <MaterialCommunityIcons
                    name={'share'}
                    color={R.colors.themeCol2}
                    size={25}
                  />
                </TouchableOpacity> */}
              </View>
            )}
          </View>
        </View>
        {!expand && (
          <View style={styles.fixedTriangle}>
            <TouchableOpacity style={styles.actionBtn}>
              <MaterialCommunityIcons
                name={'triangle'}
                color={R.colors.black}
                size={15}
              />
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
      <ConfirmationDialog
        showDialog={showDeleteConfirm}
        onConfirm={status => {
          setShowDeleteConfirm(false);
          if (status) {
            handleFileDelete(item.filePath);
          }
        }}
        confirmationMessage={'Are you sure want to delete this file?'}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: R.colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '80%',
  },
  itemContainer: {
    backgroundColor: R.colors.inputGrey1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  itemInnerContainer: {
    flexDirection: 'row',
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageContainer: {},
  titleContainer: {
    marginLeft: 10,
    flex: 1,
  },
  titleText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.black,
  },
  modalTitle: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
    marginBottom: 10,
  },
  detailText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  createdByText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  actionBtn: {
    padding: 3,
    borderRadius: 10,
  },
  fixedTriangle: {
    position: 'absolute',
    right: 10,
    top: 25,
    transform: [{rotate: '90deg'}],
  },
  addListButton: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(5),
    backgroundColor: R.colors.themeCol2,
    marginHorizontal: moderateScale(5),
  },
  addButtonText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.white,
  },
});
