import {TouchableOpacity, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {moderateScale} from '../../resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

import Helper from '../../utils/helper';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ENVIRONMENT, S3_URL} from '../../../env';
import GImage from './GImage';
import {ScrollView} from 'react-native-gesture-handler';

export enum FileRelationEnum {
  'lead' = 'lead',
  'content' = 'content',
  'product' = 'product',
  'deal' = 'deal',
  'activity' = 'activity',
  'user' = 'user',
}
interface UploadImageProps {
  label?: string;
  onFileSelect: (files: Array<any>) => void;
  fileTypes?: string;
  relationId?: string;
  relation?: string;
  multiple?: boolean;
  hideNames?: boolean;
  files?: Array<any>;
  onDeletePress?: (index: any) => void;
}

const UploadImage = ({
  onFileSelect,
  label = 'Upload files',
  fileTypes = DocumentPicker.types.allFiles,
  files = [],
  multiple = false,
  hideNames = false,
  onDeletePress,
}: UploadImageProps) => {
  const handleOnPress = async () => {
    let selectedFile: DocumentPickerResponse[] | null = await Helper.pickFile(
      fileTypes,
      multiple,
    );
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>{label || 'Upload files'}</Text>
      <View style={styles.flexRow}>
        {(multiple || files.length === 0) && (
          <TouchableOpacity
            style={styles.uploadImageButton}
            onPress={handleOnPress}>
            <MaterialIcons name={'add'} size={35} color={R.colors.themeCol2} />
          </TouchableOpacity>
        )}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {files.map((i, index) => (
            <FileItem
              key={index}
              file={i}
              onDeletePress={onDeletePress}
              index={index}
              hideNames={hideNames}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default UploadImage;
const FileItem = ({file, onDeletePress, index, hideNames}: any) => {
  let fileName = '';
  if (typeof file === 'string') {
    fileName = file;
  } else if ('fileName' in file) {
    fileName = `${S3_URL[ENVIRONMENT]}${file.filePath}`;
  }
  const fileExt = Helper.getExtension(fileName);
  if (['jpg', 'png', 'jpeg'].includes(fileExt)) {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.fileIconWraper}>
          <View style={styles.imageContainer}>
            <GImage
              uri
              imageName={`${S3_URL[ENVIRONMENT]}${file.filePath}`}
              style={styles.imageStyle}
            />
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDeletePress && onDeletePress(file)}>
            <MaterialCommunityIcons name={'close'} size={20} color={'white'} />
          </TouchableOpacity>
        </View>
        {!hideNames ? (
          <Text style={styles.fileName}>{file.fileName}</Text>
        ) : null}
      </View>
    );
  } else {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.fileIconWraper}>
          {file.uri ? (
            <View style={styles.imageContainer}>
              <GImage uri imageName={file.uri} style={styles.imageStyle} />
            </View>
          ) : (
            <MaterialCommunityIcons
              name={'file'}
              size={35}
              color={R.colors.themeCol2}
            />
          )}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDeletePress && onDeletePress(index)}>
            <MaterialCommunityIcons name={'close'} size={20} color={'white'} />
          </TouchableOpacity>
        </View>
        {!hideNames ? <Text style={styles.fileName}>{file.name}</Text> : null}
      </View>
    );
  }
};
const styles = StyleSheet.create({
  uploadImageButton: {
    height: moderateScale(62),
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: R.colors.themeCol2,
    borderStyle: 'dashed',
    backgroundColor: R.colors.BgCol2,
    marginTop: 10,
    marginRight: 10,
  },
  fileIconWraper: {
    height: moderateScale(62),
    width: moderateScale(62),
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(14),
    borderColor: R.colors.themeCol2,
    backgroundColor: R.colors.BgCol2,
    marginTop: 10,
    marginRight: 10,
  },
  imageContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: moderateScale(14),
    borderColor: R.colors.themeCol2,
  },
  labelText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  fileName: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  container: {
    marginVertical: 10,
  },
  flexRow: {
    flexDirection: 'row',
  },
  deleteBtn: {
    position: 'absolute',
    backgroundColor: R.colors.IndianRed,
    right: -10,
    borderRadius: 15,
    top: -10,
  },
  imageStyle: {
    width: 60,
    height: 60,
  },
});
