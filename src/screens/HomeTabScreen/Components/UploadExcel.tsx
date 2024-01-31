import {View, Text, ScrollView, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../styles';
import BackButton from 'library/common/BackButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDown from 'library/form-field/DropDown';
import AddButton from 'library/common/AddButton';
import UploadImage from 'library/common/UploadImage';
import {DEFAULT_LEAD_FORM} from '../../../configs/constants';
import GAlert, {MessageType} from 'library/common/GAlert';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {uploadCsvLeads} from '../../../store/slices/lead.slice';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../../store/app.store';
import GScreen from 'library/wrapper/GScreen';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
import {useNavigation} from '@react-navigation/native';
import {PrefrenceKeyEnum} from '../../../models/common/preference.keys.enum';
import {selectPrefrence} from '../../../store/slices/user.slice';
import R from 'resources/R';

const UploadExcel = () => {
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const uploadLeadStatus = useSelector(
    (state: RootState) => state.lead.uploadLeadStatus,
  );
  const {leadFilterMetadata} = useSelector((state: RootState) => state.lead);
  const customForm = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.LEAD_FORM),
  );
  const [fileheaders, setFileHeaders] = useState<Array<any>>([]);
  const [file, setFile] = useState<any>(null);
  const [selectedHeaderMapping, setHeaderMapping] = useState<any>({});

  const [fieldArray] = useState(customForm || DEFAULT_LEAD_FORM);
  useEffect(() => {
    if (fileheaders && fileheaders.length) {
      const headerMapping: any = {};
      const selectedHeader: Array<string> = [];
      fieldArray.map((field: any) => {
        let foundHeader = fileheaders.filter(i =>
          (field.similarNames || []).includes(i.value),
        );
        if (
          foundHeader &&
          foundHeader.length &&
          !selectedHeader.includes(foundHeader[0].name.toLowerCase())
        ) {
          headerMapping[field.value] = foundHeader[0].name.toLowerCase();
          selectedHeader.push(foundHeader[0].name.toLowerCase());
        }
      });
      setHeaderMapping(headerMapping);
    }
  }, [fieldArray, fileheaders]);
  const onCsvUpload = async (selectedFile: any) => {
    selectedFile = selectedFile[0];
    if (
      selectedFile &&
      selectedFile.type !== 'text/csv' &&
      selectedFile.type !== 'application/octet-stream' &&
      selectedFile.type !== 'text/comma-separated-values'
    ) {
      GAlert('Only CSV file is allowed');
      return;
    }
    setFile(selectedFile);
    if (selectedFile) {
      RNFS.readFile(selectedFile.uri, 'ascii')
        .then((data: any) => {
          const _index_n = data.indexOf('\n');
          const _index_r = data.indexOf('\r');
          const _index_rn = data.indexOf('\r\n');
          let leads: Array<any> = [];
          if (_index_n !== -1) {
            leads = data.split('\n');
          } else if (_index_r !== -1) {
            leads = data.split('\r');
          } else if (_index_rn !== -1) {
            leads = data.split('\r\n');
          } else {
            GAlert('Unable to detect line break or file empty');
            return;
          }

          leads = leads.map(i => i.replace(/"/g, ''));
          let header: Array<string> = leads[0]
            .toLocaleLowerCase()
            .replace(/"/g, '')
            .split(',');
          if (leads.length > 10000) {
            GAlert('You exceeded the file size record limit of 10000.');
            return;
          }
          const headerName = leads[0].split(',');
          setFileHeaders(
            header.map((item: string, index: number) => ({
              name: headerName[index],
              value: item,
            })),
          );
        })
        .catch(err => {});
    }
  };
  const handleSaveLeads = async () => {
    try {
      if (file) {
        if (!selectedHeaderMapping.name) {
          GAlert('Lead name not mapped with any column');
          return;
        }
        if (!selectedHeaderMapping.phone) {
          GAlert('Phone not mapped with any column');
          return;
        }
        const formData = new FormData();
        if (Object.keys(selectedHeaderMapping).length) {
          Object.keys(selectedHeaderMapping).map((key: string) => {
            formData.append(key, selectedHeaderMapping[key]);
          });
        } else {
          GAlert('Please map CSV columns with form field');
          return;
        }
        if (leadFilterMetadata.list) {
          formData.append('list', leadFilterMetadata.list);
        }
        formData.append('csv', {
          ...file,
          uri:
            Platform.OS === 'android'
              ? file.uri
              : file.uri.replace('file://', ''),
        });
        const response = await dispatch(uploadCsvLeads(formData));
        if (response.meta.requestStatus === 'fulfilled') {
          GAlert(
            'We will send a notification once csv records are inserted ,you can refresh leads based on that notification',
            MessageType.SUCCESS,
          );
          navigation.goBack();
        }
      } else {
        GAlert('Please select a CSV file first');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFieldSelect = (fieldName: string, mappedColumn: string) => {
    setHeaderMapping({
      ...selectedHeaderMapping,
      [fieldName]: mappedColumn.toLowerCase(),
    });
  };
  const getSuggestedHeader = (similaNames: Array<string>, item: string) => {
    if (selectedHeaderMapping[item]) {
      return selectedHeaderMapping[item];
    } else {
      let foundHeader = fileheaders.filter(i => similaNames.includes(i.value));
      if (foundHeader && foundHeader.length) {
        if (selectedHeaderMapping[item] === foundHeader[0].value) {
          return foundHeader[0].value;
        }
      }
    }

    return null;
  };
  const handleDeletePress = () => {
    setFile(null);
  };
  const getUnmappedHeader = (item: any) => {
    const mappedFields = Object.values(selectedHeaderMapping) || [];
    return fileheaders.filter(
      _i => _i.value === item.value || !mappedFields.includes(_i.value),
    );
  };
  return (
    <GScreen loading={uploadLeadStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.backgroundContainer}>
        <View style={styles.backButtonWrapper}>
          <BackButton title={'Upload CSV file'} />
        </View>
        <ScrollView>
          <View style={styles.tagWrapper}>
            <UploadImage
              label={'Upload CSV'}
              onFileSelect={onCsvUpload}
              fileTypes={DocumentPicker.types.allFiles}
              files={file ? [file] : []}
              onDeletePress={handleDeletePress}
            />
          </View>
          <View style={styles.fileUploadHeader}>
            <Text style={styles.fieldHeadTitles}>CRM fields</Text>
            <Text style={styles.fieldHeadTitles}>File fields</Text>
          </View>

          {file &&
            fieldArray.map((item: any, index: number) => (
              <View style={styles.fileUploadHeader} key={index}>
                <Text style={styles.fieldTitles}>{item.label}</Text>
                <MaterialCommunityIcons
                  name={'arrow-right'}
                  size={21}
                  color={R.colors.black}
                />
                <View style={styles.dropdownWrapper}>
                  <DropDown
                    options={getUnmappedHeader(item)}
                    defaultOption={getSuggestedHeader(
                      item.similarNames || [],
                      item.value,
                    )}
                    placeholder={'Select'}
                    onChangeVal={(val: any) => {
                      handleFieldSelect(item.value, val);
                    }}
                  />
                </View>
              </View>
            ))}
        </ScrollView>
        <View style={styles.headerWrapper}>
          <AddButton title={'Uplaod file'} onPress={() => handleSaveLeads()} />
        </View>
      </View>
    </GScreen>
  );
};

export default UploadExcel;
