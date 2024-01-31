import {useNavigation} from '@react-navigation/native';
import BackButton from 'library/common/BackButton';
import GAlert from 'library/common/GAlert';
import DynamicForm from 'library/form-field/DynamicForm';
import GScreen from 'library/wrapper/GScreen';
import {isNil} from 'lodash';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {PREF_FORMS_FIELDS} from '../../configs/constants';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {ThunkStatus} from '../../models/common/thunkStatus.interface';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  selectPrefrence,
  updateUserPrefrence,
} from '../../store/slices/user.slice';
import {styles} from './styles';

const UpdatePrefrenceValue = (props: any) => {
  const dispatch = useDispatch<RootDispatch>();
  const prefrenceType: PrefrenceKeyEnum = props.route.params.type;
  const screenTitle = props.route.params.title;
  const editItem = props.route.params.item || null;
  const prefrences: Array<object> = useSelector((state: RootState) =>
    selectPrefrence(state, prefrenceType),
  );
  const udatePrefranceStatus: ThunkStatus = useSelector(
    (state: RootState) => state.user.udatePrefranceStatus,
  );

  const navigation = useNavigation();

  const [item, setItemVaue] = useState(editItem || {});
  const handleValueChange = (_value: {
    field: string;
    value: string;
    options?: any;
  }) => {
    let updateItem = {...item};
    updateItem[_value.field] = _value.value;
    if (_value.field === 'name') {
      updateItem.name = _value.value;
      updateItem.value = _value.value.trim().toLowerCase().split(' ').join('_');
      if (prefrenceType === PrefrenceKeyEnum.LEAD_FORM) {
        updateItem.label = _value.value;
      }
    }
    if (_value.options && _value.options.length) {
      updateItem.options = _value.options;
    }
    setItemVaue(updateItem);
  };
  const handleSavePrefrence = async () => {
    try {
      if (isValidLead()) {
        let response;
        const newPrefrence = prefrences
          .map((_i: any) => {
            let i = {..._i};
            if (item.isDefault) {
              i.isDefault = false;
            }
            if (item.isSaleStatus) {
              i.isSaleStatus = false;
            }
            delete i.idDefault;
            delete i.address;
            return i;
          })
          .filter((_item: any) =>
            editItem ? editItem.value !== _item.value : true,
          );
        delete item.idDefault;
        if (!item.customFields || item.customFields.length === 0) {
          delete item.customFields;
        }
        console.log(newPrefrence, item);
        const duplicateName = newPrefrence.find(
          (_item: any) => _item.name === item.name,
        );

        if (duplicateName) {
          GAlert('Cannot create duplicate ' + screenTitle.toLowerCase());
          return;
        }
        if (editItem) {
          response = await dispatch(
            updateUserPrefrence({
              key: prefrenceType,
              value: [...newPrefrence, item],
            }),
          );
        } else {
          response = await dispatch(
            updateUserPrefrence({
              key: prefrenceType,
              value: [...newPrefrence, item],
            }),
          );
        }
        if (response && response.meta.requestStatus === 'fulfilled') {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isValidLead = () => {
    let valid = true;
    PREF_FORMS_FIELDS[prefrenceType].map((field: any) => {
      if (
        field.isRequired &&
        ((item as any)[field.value] === '' || isNil((item as any)[field.value]))
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
    <GScreen loading={udatePrefranceStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.container}>
        <BackButton
          title={
            editItem
              ? `Update ${screenTitle.toLowerCase()}`
              : `Add ${
                  screenTitle === 'Lead activities'
                    ? 'custom activity'
                    : screenTitle.toLowerCase()
                }`
          }
        />
        <DynamicForm
          fieldValues={item}
          formFields={PREF_FORMS_FIELDS[prefrenceType] || []}
          handleValueChange={handleValueChange}
          containerStyle={styles.headerWrapper}
          buttonPress={handleSavePrefrence}
        />
      </View>
    </GScreen>
  );
};
export default UpdatePrefrenceValue;
