/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import {DistributionRule} from 'datalib/entity/distribution';
import {TeamMember} from 'datalib/entity/team';
import DistributionApi from 'datalib/services/distribution.api';
import AddButton from 'library/common/AddButton';
import BackButton from 'library/common/BackButton';
import {DeleteButton} from 'library/common/ButtonGroup';
import GAlert from 'library/common/GAlert';
import DropDown from 'library/form-field/DropDown';
import SectionedTextInput from 'library/form-field/SectionedTextInput';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import GScreen from 'library/wrapper/GScreen';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  createDistributionRule,
  updateDistributionRule,
  deleteDistributionRule,
  getDistributionRules,
} from '../../store/slices/list.slice';
import {selectAllUsers} from '../../store/slices/user.slice';
import {UserItem} from './SubScreen/RoundRobin';

const AddDistributionScreen = (props: any) => {
  const naviation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const editItem = props.route.params?.editItem || null;
  const updateDistributionRuleStatus = useSelector(
    (state: RootState) => state.list.updateDistributionRuleStatus,
  );

  const teamMembers = useSelector((state: RootState) => selectAllUsers(state));
  const integrations = [
    {
      value: '64109561e6c7e737227a6384',
      name: 'Facebook',
      key: 'facebook',
      type: 'webhooks',
      fieldNames: ['Page', 'Form'],
    },
    {
      value: '64109561e6c7e737227a6383',
      name: 'Indiamart',
      key: 'indiamart',
      type: 'manual',
      fieldNames: [
        {name: 'ENQ_CITY', value: 'ENQ_CITY'},
        {name: 'ENQ_STATE', value: 'ENQ_STATE'},
        {name: 'PRODUCT_NAME', value: 'PRODUCT_NAME'},
      ],
    },
    {
      value: '64109561e6c7e737227a6385',
      name: 'Tradeindia',
      key: 'tradeindia',
      type: 'manual',
      fieldNames: ['sender_state', 'sender_city'],
    },
  ];

  const [dynamicFields, setDynamicFields] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [ruleName, setRuleName] = useState<string>(editItem?.name || '');
  const [fieldOptions, setFieldOptions] = useState<Array<any>>([]);
  const [fieldOptionsValues, setFieldOptionsValues] = useState<Array<any>>([]);
  const [integrationId, setIntegrationId] = useState<string>(
    editItem ? editItem?.integration : null,
  );
  const [fieldName, setFieldName] = useState<string>(
    editItem?.ruleConfig?.fieldName || '',
  );
  const [fieldValue, setFieldValue] = useState<string>(
    editItem?.ruleConfig?.fieldValue || '',
  );
  const [recipientsIds, setReceipantsIds] = useState(
    editItem ? editItem?.recipientsIds?.ids || {} : {},
  );

  const handleConfirm = (status: boolean) => {
    setShowConfirm(false);
    if (status) {
      dispatch(deleteDistributionRule(editItem?._id));
      naviation.goBack();
    }
  };
  useEffect(() => {
    if (dynamicFields && fieldName.toLocaleLowerCase() === 'form') {
      setFieldOptionsValues([
        ...dynamicFields.forms.map((_v: any) => ({
          name: _v.name,
          value: _v.id,
        })),
      ]);
    } else if (dynamicFields && fieldName.toLocaleLowerCase() === 'page') {
      setFieldOptionsValues([
        ...dynamicFields.pages.map((_v: any) => ({
          name: _v.pageName || _v.pageId,
          value: _v.pageId,
        })),
      ]);
    }
  }, [fieldName, dynamicFields]);

  const loadFacebookFieldOptions = async () => {
    const response: any = await new DistributionApi().getDistributionOptions();
    if (response) {
      setDynamicFields(response);
    }
  };
  useEffect(() => {
    setFieldOptions(
      integrations.find(_i => _i.value === integrationId)?.fieldNames || [],
    );
    // if (integrationId === '634ecebb4c3a82ac7e3ec217') {
    //   loadFacebookFieldOptions();
    // }
  }, [integrationId]);
  useEffect(() => {
    loadFacebookFieldOptions();
  }, []);
  const handleUserSelection = (id: string, status: boolean) => {
    const newRecipientsIds = {...recipientsIds};
    if (newRecipientsIds[id]) {
      newRecipientsIds[id] = {
        ...newRecipientsIds[id],
        waitage: status ? 1 : 0,
        status: status,
      };
    } else {
      newRecipientsIds[id] = {
        waitage: status ? 1 : 0,
        status: status,
      };
    }
    setReceipantsIds({...newRecipientsIds});
  };

  const handleSaveBtnPress = async () => {
    if (ruleName === '') {
      GAlert('Please enter rule name');
      return;
    }
    if (integrationId === '') {
      GAlert('Please select lead source');
      return;
    }
    if (fieldName === '') {
      GAlert('Please select field');
      return;
    }
    if (fieldValue === '') {
      GAlert('Please enter field value');
      return;
    }
    if (recipientsIds && recipientsIds.length <= 0) {
      GAlert('Please select atleast one member');
      return;
    }
    let receipants = {};
    if (editItem) {
      receipants = {
        ids: recipientsIds,
        cursor: editItem.recipientsIds.cursor || '',
        current_distribution: editItem.recipientsIds.current_distribution || '',
      };
    } else {
      receipants = {
        cursor: '',
        current_distribution: '',
        ids: recipientsIds,
      };
    }

    const payload: DistributionRule = {
      ruleConfig: {
        fieldName,
        fieldValue,
      },
      integration: integrationId,
      name: ruleName,
      recipientsIds: receipants,
    };
    let response = null;
    if (editItem) {
      payload._id = editItem._id;
      response = await dispatch(updateDistributionRule(payload));
    } else {
      response = await dispatch(createDistributionRule(payload));
    }
    if (response && response.meta.requestStatus === 'fulfilled') {
      dispatch(getDistributionRules());
      naviation.goBack();
    }
  };
  return (
    <GScreen
      loading={updateDistributionRuleStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.container}>
        <View style={styles.btnWrapper}>
          <BackButton
            title={
              editItem ? 'Edit Distribution Rule' : 'Add Distribution Rule'
            }
          />
          {editItem && <DeleteButton onPress={() => setShowConfirm(true)} />}
        </View>
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}>
          <SectionedTextInput
            label={'Rule Name'}
            isRequired={true}
            placeholder={'Enter Rule name'}
            leftContent={
              <MaterialCommunityIcons
                name={'cog'}
                size={22}
                color={R.colors.themeCol2}
              />
            }
            defaultValue={ruleName.trim()}
            onChangeText={(name: string) => setRuleName(name)}
            maxLength={50}
          />
          <View>
            <Text style={styles.headingStyle}>Rule Condition</Text>
            <View style={styles.conditionContainer}>
              <View style={styles.flexLeft}>
                <Text style={styles.labelStyle}>If lead source is</Text>
                <DropDown
                  options={integrations || []}
                  defaultOption={integrationId}
                  onChangeVal={selection => {
                    setIntegrationId(selection);
                    setFieldName('');
                    setFieldValue('');
                  }}
                  placeholder={'Select'}
                />
              </View>
              <View style={[styles.flexRight]}>
                <Text style={styles.labelStyle}>And field is</Text>
                <DropDown
                  options={fieldOptions}
                  onChangeVal={_name => setFieldName(_name)}
                  defaultOption={fieldOptions.length ? fieldName : null}
                  placeholder={'Select'}
                />
              </View>
            </View>
            {integrationId === '64109561e6c7e737227a6384' && fieldName ? (
              <View>
                <Text style={styles.labelStyle}>And value is</Text>
                <DropDown
                  options={fieldOptionsValues}
                  onChangeVal={(_value: string) => setFieldValue(_value)}
                  defaultOption={fieldValue}
                  placeholder={'Select lead source'}
                />
              </View>
            ) : (
              <SectionedTextInput
                label={'Field Value'}
                isRequired={true}
                placeholder={'Enter field value'}
                leftContent={
                  <MaterialCommunityIcons
                    name={'cog'}
                    size={22}
                    color={R.colors.themeCol2}
                  />
                }
                defaultValue={fieldValue}
                onChangeText={(_value: string) => setFieldValue(_value)}
                maxLength={50}
              />
            )}
          </View>
          <Text style={styles.labelStyle}>Then Distribute lead to</Text>
          {teamMembers.map((item: TeamMember, index: number) => (
            <UserItem
              item={item}
              key={index}
              selected={recipientsIds[item._id]?.status || false}
              onSelectionUpdate={handleUserSelection}
            />
          ))}
        </ScrollView>

        <AddButton title={'SAVE RULE'} onPress={handleSaveBtnPress} />
      </View>
      <ConfirmationDialog
        showDialog={showConfirm}
        onConfirm={handleConfirm}
        confirmationMessage={'Are you sure you want to delete?'}
      />
    </GScreen>
  );
};
export default AddDistributionScreen;
const styles = StyleSheet.create({
  labelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 10,
  },
  headingStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    marginTop: 20,
  },

  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: R.colors.bgCol,
    flex: 1,
  },
  conditionContainer: {
    flexDirection: 'row',
  },
  flexLeft: {
    flex: 1,
    marginRight: 10,
  },
  flexRight: {
    flex: 1,
    marginLeft: 10,
  },
  formContainer: {
    paddingVertical: 0,
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
