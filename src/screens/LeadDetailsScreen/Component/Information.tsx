/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../styles';
import HeadTitle from '../../../library/common/HeadTitle';
import {useDispatch, useSelector} from 'react-redux';
import {getLeadsById, leadByIdSelector} from '../../../store/slices/lead.slice';
import {useRoute} from '@react-navigation/native';
import {Lead} from 'datalib/entity/lead';
import {RootDispatch, RootState} from '../../../store/app.store';
import Clipboard from '@react-native-clipboard/clipboard';
import GAlert, {MessageType} from 'library/common/GAlert';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Helper from '../../../utils/helper';
import {PrefrenceObject, PrefrenceItem} from 'datalib/entity/prefrence';
import {PrefrenceKeyEnum} from '../../../models/common/preference.keys.enum';
import {Nillable} from '../../../models/custom.types';
import {
  selectPrefrence,
  selectUserById,
  userPrefrenceSelector,
} from '../../../store/slices/user.slice';
import R from 'resources/R';
import moment from 'moment';
import {User} from 'datalib/entity/user';
import {TeamMember} from 'datalib/entity/team';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
import {DEFAULT_LEAD_FORM} from '../../../configs/constants';
const directDataFild = ['website'];

const examptField = [
  'lead_label',
  'lead_status',
  'notes',
  'company_name',
  'website',
  'lead label',
  'lead source',
  'lead status',
  'company_name',
  'website',
  'api_version',
  'form_id',
  'campaign_id',
  'google_key',
  'gcl_id',
  'lead_id',
  'event_id',
  'event_type',
];
const Information = () => {
  const route = useRoute();
  const leadId: string = route?.params?.leadId || '';
  const dispatch = useDispatch<RootDispatch>();
  const {updateLeadStatus} = useSelector((state: RootState) => state.lead);
  const facebookData: Array<any> = [];
  const extraDetailsData: Array<any> = [];
  const customForm = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.LEAD_FORM),
  );
  const [fieldArray] = useState(customForm || DEFAULT_LEAD_FORM);
  // const formFields = fieldArray.map(item => item.value);
  const leadDetails: Lead | null = useSelector((state: RootState) =>
    leadByIdSelector(state, leadId),
  );
  const prefrences: Nillable<PrefrenceObject> = useSelector(
    (state: RootState) => userPrefrenceSelector(state),
  );
  const employee: Nillable<User | TeamMember> = useSelector(
    (state: RootState) => selectUserById(state, leadDetails?.createdBy),
  );
  const asignee: Nillable<User | TeamMember> = useSelector((state: RootState) =>
    selectUserById(state, leadDetails?.assignedTo),
  );
  const extraDetails = leadDetails?.extraDetails
    ? leadDetails?.extraDetails
    : {};
  useEffect(() => {
    if (leadId && updateLeadStatus.status !== ThunkStatusEnum.IDLE) {
      reloadLeadInfo();
    }
  }, [updateLeadStatus]);
  const reloadLeadInfo = () => {
    dispatch(getLeadsById(leadId));
  };
  // useEffect(() => {
  //   if (leadId) {
  //     reloadLeadInfo();
  //   }
  // }, []);
  const getPrefItem = (item: string, key: PrefrenceKeyEnum) => {
    if (prefrences) {
      const prefArray = prefrences[key];
      if (prefArray && Array.isArray(prefArray) && prefArray.length) {
        let _data = prefArray.find((p: PrefrenceItem) => p.value === item);
        if (_data) {
          return _data;
        } else {
          return {name: item, color: R.colors.themeCol2};
        }
      } else {
        return {name: item, color: R.colors.themeCol2};
      }
    }
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    GAlert('Note copied to clipboard', MessageType.SUCCESS);
  };
  if (extraDetails && 'field_data' in extraDetails) {
    let field_data = extraDetails.field_data;
    Object.keys(extraDetails.field_data).forEach(function (e, index) {
      const isEmail = Helper.validateEmail(field_data[e].values.join(','));
      const isPhone = Helper.validatePhone(
        field_data[e].values.join(',').trim(),
      );
      const isUrl = Helper.isValidURL(field_data[e].values.join(','));
      facebookData.push(
        <View key={`field_data_${index}`} style={styles.infoBox}>
          <Text style={styles.infoheading}>
            {field_data[e].name.replace(/_/g, ' ')}
          </Text>
          {isEmail || isPhone || isUrl ? (
            <TouchableOpacity>
              <Text style={[styles.detail, styles.pressable]}>
                {field_data[e].values.join(',')}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.detail}>{field_data[e].values.join(',')}</Text>
          )}
        </View>,
      );
    });
  }
  if ('user_column_data' in extraDetails) {
    let field_data: Array<any> = extraDetails.user_column_data;
    field_data.forEach(function (e, index) {
      const isEmail = Helper.validateEmail(e.string_value);
      const isPhone = Helper.validatePhone(e.string_value);
      const isUrl = Helper.isValidURL(e.string_value);
      facebookData.push(
        <View key={`user_column_data_${index}`} style={styles.infoBox}>
          <Text style={styles.infoheading}>{e.column_name}</Text>
          {isEmail || isPhone || isUrl ? (
            <TouchableOpacity>
              <Text style={[styles.detail, styles.pressable]}>
                {e.string_value}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.detail}>{e.string_value}</Text>
          )}
        </View>,
      );
    });
  }
  if ('form_response' in extraDetails) {
    let field_data: Array<any> = extraDetails.form_response.answers;
    field_data.forEach(function (e, index) {
      facebookData.push(
        <View key={`form_response_${index}`} style={styles.infoBox}>
          <Text style={styles.infoheading}>{e.type}</Text>
          <Text style={styles.detail}>{JSON.stringify(e[e.type])}</Text>
        </View>,
      );
    });
  }
  if ('forms' in extraDetails) {
    let field_data: Array<any> = extraDetails.forms;
    if (Array.isArray(field_data)) {
      field_data.map((item, index) => {
        facebookData.push(
          <View key={`form_${index}`} style={styles.infoBox}>
            <Text style={styles.infoheading}>Page Name</Text>
            <Text style={styles.detail}>{item?.name}</Text>
          </View>,
        );
      });
    } else if (field_data?.name) {
      facebookData.push(
        <View key={'form_fb'} style={styles.infoBox}>
          <Text style={styles.infoheading}>Page Name</Text>
          <Text style={styles.detail}>{field_data?.name}</Text>
        </View>,
      );
    }
  }
  if ('page' in extraDetails) {
    let field_data: Array<any> | any = extraDetails.page;
    if (Array.isArray(field_data)) {
      field_data.map((item, index) => {
        facebookData.push(
          <View key={`page_${index}`} style={styles.infoBox}>
            <Text style={styles.infoheading}>Page Name</Text>
            <Text style={styles.detail}>{item?.name}</Text>
          </View>,
        );
      });
    } else if (field_data?.name) {
      facebookData.push(
        <View key={'page_fb'} style={styles.infoBox}>
          <Text style={styles.infoheading}>Page Name</Text>
          <Text style={styles.detail}>{field_data?.name}</Text>
        </View>,
      );
    }
  }
  const printAddressField = (coords: any, address: string, key: string) => {
    try {
      const url = Platform.select({
        ios:
          'maps:' + coords.latitude + ',' + coords.longitude + '?q=' + address,
        android:
          'geo:' + coords.latitude + ',' + coords.longitude + '?q=' + address,
      });
      return (
        <View key={`address_field_${key}`} style={styles.infoBox}>
          <Text style={[styles.infoheading, {marginBottom: 10}]}>
            {(key || 'Address').replace(/_/g, ' ')}
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(
                  `http://maps.google.com/?q=${coords.latitude},${coords.longitude}`,
                );
              }}>
              <MaterialCommunityIcons
                name="content-copy"
                size={20}
                color={'blue'}
              />
            </TouchableOpacity>
          </Text>
          <TouchableOpacity onPress={() => navigateToUrl(url)}>
            <Text style={[styles.detail, {color: 'blue'}]}>{address}</Text>
          </TouchableOpacity>
        </View>
      );
    } catch (error) {
      console.log('Error while parsing data');
      return null;
    }
  };
  const printNestedObject = (object: any, key: string = null) => {
    let extraField = Object.keys(object);
    extraField.map((e, index) => {
      if (
        object[e] &&
        (typeof object[e] === 'string' || typeof object[e] === 'number') &&
        !examptField.includes(e)
      ) {
        const isEmail = Helper.validateEmail(object[e].toString());
        const isPhone = Helper.validatePhone(object[e].toString());
        const isUrl = Helper.isValidURL(object[e].toString());
        const isDate =
          typeof object[e] === 'string' && object[e].length > 10
            ? Helper.isValidDate(object[e].toString())
            : false;
        if (e === 'address') {
          if (object.coords) {
            if (object[e] !== '') {
              extraDetailsData.push(
                printAddressField(object.coords, object[e], key),
              );
            }
          } else {
            if (object[e] !== '') {
              extraDetailsData.push(
                <View
                  key={`facebook_field_b_${index}_${Math.random()}`}
                  style={styles.infoBox}>
                  <Text style={styles.infoheading}>{e.replace(/_/g, ' ')}</Text>
                  <Text style={styles.detail}>{object[e]}</Text>
                </View>,
              );
            }
          }
        } else {
          if (object[e] !== '') {
            extraDetailsData.push(
              <View
                key={`facebook_field_a_${index}_${Math.random()}`}
                style={styles.infoBox}>
                <Text style={styles.infoheading}>{e.replace(/_/g, ' ')}</Text>
                {isEmail || isPhone || isUrl ? (
                  <TouchableOpacity>
                    <Text style={[styles.detail, styles.pressable]}>
                      {object[e]}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.detail}>
                    {isDate
                      ? moment(object[e]).format('DD MMM YYYY')
                      : object[e]}
                  </Text>
                )}
              </View>,
            );
          }
        }
      } else if (object[e] && typeof object[e] === 'object') {
        object[e] && printNestedObject(object[e], e);
      }
    });
  };
  function navigateToUrl(url: string) {
    Linking.openURL(url);
  }

  const setSourceName = (_leadDetail: any) => {
    if (_leadDetail) {
      if (
        'customSource' in _leadDetail &&
        _leadDetail.customSource &&
        _leadDetail.customSource !== null
      ) {
        return (
          getPrefItem(
            _leadDetail.customSource,
            PrefrenceKeyEnum.LEAD_CUSTOM_SOURCES,
          )?.name || _leadDetail.customSource
        );
      } else if (
        _leadDetail?.integration &&
        typeof _leadDetail?.integration === 'string'
      ) {
        return _leadDetail?.integration;
      } else if (
        _leadDetail?.integration &&
        typeof _leadDetail?.integration === 'object'
      ) {
        return _leadDetail?.integration.name;
      } else {
        return 'Unknown';
      }
    } else {
      return 'Unknown';
    }
  };
  printNestedObject(extraDetails);
  console.log(extraDetails, fieldArray);
  return (
    <View style={styles.actiVityContainer}>
      <ScrollView>
        <View style={styles.contentWrapper}>
          <HeadTitle screenTitle={'Lead Information'} />
          <View style={styles.informationWrapper}>
            <Text style={styles.leadTitle}>Phone</Text>
            <Text style={styles.leadInformation}>
              {leadDetails?.phone || ''}
            </Text>
          </View>
          {leadDetails && leadDetails.address
            ? printAddressField(
                leadDetails.address?.coords,
                leadDetails.address?.address,
                'Address',
              )
            : null}
          {facebookData || null}
          {extraDetailsData || null}
          {leadDetails &&
            directDataFild.map(
              (item, index) =>
                (item in leadDetails &&
                  leadDetails[item] &&
                  leadDetails[item] != '' && (
                    <View key={index} style={styles.infoBox}>
                      <Text style={styles.infoheading}>
                        {item.replace(/_/g, ' ')}
                      </Text>
                      <Text style={styles.detail}>{leadDetails[item]}</Text>
                    </View>
                  )) ||
                null,
            )}
          <View style={styles.informationWrapper}>
            <Text style={styles.leadTitle}>Lead Source</Text>
            <Text style={styles.leadInformation}>
              {setSourceName(leadDetails)}
            </Text>
          </View>

          {leadDetails?.note && (
            <View style={styles.informationWrapper}>
              <Text style={styles.leadTitle}>Lead Note</Text>
              <Text style={styles.leadInformation}>{leadDetails?.note}</Text>
            </View>
          )}
          {asignee && (
            <View style={styles.informationWrapper}>
              <Text style={styles.leadTitle}>Lead Assigned to</Text>
              <Text style={styles.leadInformation}>
                {asignee?.firstName} {asignee?.lastName}
              </Text>
            </View>
          )}
          <View style={styles.informationWrapper}>
            <Text style={styles.leadTitle}>Lead Owner</Text>
            <Text style={styles.leadInformation}>
              {employee?.firstName || ''}
              {employee?.lastName || ''}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Information;
