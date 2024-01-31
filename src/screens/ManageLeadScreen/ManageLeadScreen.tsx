/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {useNavigation, useRoute} from '@react-navigation/native';
import GScreen from 'library/wrapper/GScreen';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {selectPrefrence} from '../../store/slices/user.slice';
import {DEFAULT_LEAD_FORM, DEFAULT_LEAD_SOURCE} from '../../configs/constants';

import {
  addLeadsInformation,
  getLeadsById,
  leadByIdSelector,
  updateLeadData,
} from '../../store/slices/lead.slice';
import {Lead} from 'datalib/entity/lead';
import {isNil} from 'lodash';
import GAlert from 'library/common/GAlert';
import TagPicker from 'library/common/TagPicker';
import DynamicForm from 'library/form-field/DynamicForm';
import BackButton from 'library/common/BackButton';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {Nillable} from '../../models/custom.types';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';

const static_field = [
  '_id',
  'name',
  'email',
  'phone',
  'label',
  'status',
  'saleValue',
  'website',
  'notes',
  'customSource',
  'extraDetails',
  'companyName',
];

const ManageLeadScreen = () => {
  const route = useRoute<any>();
  const dispatch = useDispatch<RootDispatch>();
  const {leadFilterMetadata} = useSelector((state: RootState) => state.lead);
  const navigation = useNavigation();
  const leadId = route?.params?.leadId;
  const contactInfo = route?.params?.contactInfo;
  const phone = route?.params?.phone;
  const customForm = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.LEAD_FORM),
  );
  const addLeadsStatus = useSelector(
    (state: RootState) => state.lead.addLeadsStatus,
  );
  const leadData: Nillable<Lead> = useSelector((state: RootState) =>
    leadByIdSelector(state, leadId || ''),
  );
  const [fieldArray] = useState(customForm || DEFAULT_LEAD_FORM);

  let customSource = null;
  if (leadData) {
    customSource = leadData ? leadData?.customSource : null;
  } else if (contactInfo) {
    customSource = contactInfo ? 'phonebook' : 'leadForm';
  } else {
    customSource = 'leadForm';
  }

  const [leadDetail, setLeadDetail] = useState<any>({
    name: leadData?.name || contactInfo?.name || '',
    phone: leadData?.phone || contactInfo?.phone || phone || '',
    email: leadData?.email || contactInfo?.email || '',
    alternate_phone:
      leadData?.alternateNumber || contactInfo?.alternateNumber || '',
    // extraDetails: leadData?.extraDetails || {},
    // isDistributed: true,
    saleValue: leadData?.saleValue || 0,
    notes: (leadData && leadData?.note) || '',
    ...leadData?.extraDetails,
    customSource: customSource,
  });
  // useEffect(() => {
  //   const fields = {};
  //   if (leadData) {
  //     leadData?.customField.map((_i: any) => {
  //       console.log(_i);
  //     });
  //   }
  // }, [leadData]);
  const handleCustomField = (item: {field: string; value: any}) => {
    const newLeadItem = {...leadDetail};
    if (item && item.field) {
      newLeadItem[item.field] = item.value;
      setLeadDetail({...newLeadItem});
    }
  };
  const handleSourceSelect = (source: string) => {
    const newLeadDetail = {...leadDetail};
    newLeadDetail.customSource = source;
    setLeadDetail({...newLeadDetail});
  };
  const handleLeadSave = async () => {
    if (addLeadsStatus.status === ThunkStatusEnum.LOADING) {
      return;
    }
    const _leadDetail = {...leadDetail};
    if (isValidLead()) {
      const fields = Object.keys(leadDetail);
      fields.map(field => {
        if (!static_field.includes(field)) {
          _leadDetail.extraDetails = {
            ..._leadDetail.extraDetails,
            [field]: _leadDetail[field] || '',
          };
          delete _leadDetail[field];
        } else if (_leadDetail[field] === '') {
          delete _leadDetail[field];
        }
      });
      let response;
      if (!_leadDetail.notes || _leadDetail.notes.length === 0) {
        delete _leadDetail.notes;
      }
      if (
        !_leadDetail.alternate_phone ||
        _leadDetail.alternate_phone.length === ''
      ) {
        delete _leadDetail.alternate_phone;
      }
      // const fields = customForm
      //   .filter((_i: FormField) => !_i.read_only)
      //   .map((item: FormField) => {
      //     return {
      //       label: item.name,
      //       field: item.value,
      //       value: _leadDetail[item.value] || '',
      //     };
      //   });
      // if (fields.length) {
      //   _leadDetail.customField = fields;
      // }
      if (leadData) {
        _leadDetail._id = leadData._id;
        if (!_leadDetail.customSource) {
          delete _leadDetail.customSource;
        }
        response = await dispatch(updateLeadData(_leadDetail));
        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(getLeadsById(leadData?._id || ''));
          navigation.canGoBack() && navigation.goBack();
        }
      } else {
        if (leadFilterMetadata.list) {
          _leadDetail.list = leadFilterMetadata.list;
        }
        _leadDetail.integration = '634ecebb4c3a82ac7e3ec216';

        response = await dispatch(addLeadsInformation(_leadDetail));
        if (response.meta.requestStatus === 'fulfilled') {
          navigation.navigate(ScreenNameEnum.LEAD_PROFILE_SCREEN, {
            id: response.payload?._id || '',
            resetNavigator: true,
          });
          return;
        }
      }
    }
  };
  const isValidLead = () => {
    let valid = true;
    fieldArray.map((field: any) => {
      if (
        field.isRequired &&
        (leadDetail[field.value] === '' || isNil(leadDetail[field.value]))
      ) {
        if (valid) {
          GAlert(`${field.label} cannot be empty`);
        }
        valid = false;
      }
    });
    return valid;
  };
  return (
    <GScreen loading={addLeadsStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.container}>
        <BackButton
          title={leadId ? 'Update Lead' : 'Add New Lead'}
          preventBackBtn
        />
        <DynamicForm
          childrenAtTop
          formFields={fieldArray}
          fieldValues={leadDetail}
          handleValueChange={handleCustomField}
          buttonPress={handleLeadSave}>
          <View>
            <Text style={styles.labelStyle}>Lead Source</Text>
            <TagPicker
              defaultTags={DEFAULT_LEAD_SOURCE}
              tagKey={PrefrenceKeyEnum.LEAD_CUSTOM_SOURCES}
              tagLabel={'+ New Source'}
              selectedTags={[leadDetail.customSource]}
              onTagSelect={handleSourceSelect}
              tagContainer={{marginBottom: 0}}
            />
          </View>
        </DynamicForm>
      </View>
    </GScreen>
  );
};

export default ManageLeadScreen;
