/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackButton from 'library/common/BackButton';
import {styles} from './styles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  getLeadsById,
  leadByIdSelector,
  updateLeadLabels,
  updateLeadStatus,
} from '../../store/slices/lead.slice';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from 'resources/responsiveLayout';
import {currentUserSelector} from '../../store/slices/user.slice';
import {RootDispatch, RootState} from '../../store/app.store';
import {BulkActionPayload, Lead} from 'datalib/entity/lead';
import QuickLeadOptions from './Component/QuickLeadOptions';
import OptionsPopup from 'library/form-field/OptionsPopup';
import LeadOptionActions from './Component/LeadOptionActions';
import GTopTabViewer from 'library/common/GTopTabViewer';

import ActivityTimeLine from './Component/ActivityTimeLine';
import Information from './Component/Information';
import Notes from './Component/Notes';
import Task from './Component/Task';
import Helper from '../../utils/helper';
import GScreen from 'library/wrapper/GScreen';
import R from 'resources/R';
import {Nillable} from '../../models/custom.types';

const LeadDetailsScreen = () => {
  const route: any = useRoute();
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const leadId: string = route?.params?.id || '';
  const resetNavigator: boolean = route?.params?.resetNavigator || false;

  const tabRoutes = [
    {
      name: 'Timeline',
      component: ActivityTimeLine,
      params: {
        leadId,
      },
    },
    {
      name: 'Task',
      component: Task,
      params: {
        leadId,
      },
    },
    {
      name: 'Notes',
      component: Notes,
      params: {
        leadId,
      },
    },
    {
      name: 'Info',
      component: Information,
      params: {
        leadId,
      },
    },
  ];
  const [optionModal, setOptionModal] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState<boolean>(false);
  const [showLabelOptions, setShowLabelOptions] = useState<boolean>(false);

  const leadDetails: Nillable<Lead> = useSelector((state: RootState) =>
    leadByIdSelector(state, leadId),
  );

  const user = useSelector((state: RootState) => currentUserSelector(state));

  //lead fetch
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // if (!leadDetails) {

      // }
      dispatch(getLeadsById(leadId));
    });
    return unsubscribe;
  }, [leadId]);

  const onStatusSelect = async (selectionOptions: any) => {
    if (selectionOptions && leadDetails?.status[0] !== selectionOptions.value) {
      const payload: BulkActionPayload = {
        leadIDs: [leadId],
        status: selectionOptions.value,
      };
      await dispatch(updateLeadStatus(payload));
      await dispatch(getLeadsById(leadId));
    }
  };
  const onLabelSelect = async (selectionOptions: Array<any>) => {
    if (
      selectionOptions &&
      selectionOptions.length &&
      JSON.stringify(selectionOptions) !==
        JSON.stringify(leadDetails?.label || [])
    ) {
      const payload: BulkActionPayload = {
        leadIDs: [leadId],
        label: selectionOptions.filter(a => a !== ''),
      };
      await dispatch(updateLeadLabels(payload));
      await dispatch(getLeadsById(leadId));
    }
  };
  return (
    <GScreen>
      <View style={styles.container}>
        <View style={styles.backButtonWrapper}>
          <BackButton resetNavigator={resetNavigator} />
          <TouchableOpacity
            style={styles.optionButtonWrapper}
            onPress={() => setOptionModal(!optionModal)}>
            <Text style={styles.optionText}>Options</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.titleWrapper}>
          <Text style={styles.nameTitle}>
            {leadDetails?.name || 'Name Unavailable'}
          </Text>
          {leadDetails?.companyName && (
            <Text style={styles.priceTitle}>{leadDetails?.companyName}</Text>
          )}
          {leadDetails?.saleValue && leadDetails?.saleValue > 0 ? (
            <Text style={styles.priceTitle}>
              <Text style={styles.rupeeSymbol}>₹ </Text>
              {Helper.currencyFormate(leadDetails?.saleValue || null)}
            </Text>
          ) : null}
        </View>
        <View style={styles.leadCategoryWrapper}>
          <View style={[styles.leadCategoryInfo, styles.borderSeparation]}>
            <Text style={styles.leadSubTitle}>Status</Text>
            <View style={styles.valuesWrapper}>
              <TouchableOpacity
                style={styles.editIconWrapper}
                onPress={() => setShowStatusOptions(!showStatusOptions)}>
                <View style={styles.editItem}>
                  {leadDetails?.status &&
                    leadDetails.status.map((item, _index) => {
                      return (
                        <Text key={_index} style={styles.status}>
                          {item?.split('_').join(' ')}
                        </Text>
                      );
                    })}
                  <MaterialCommunityIcons
                    name={'pencil-outline'}
                    color={R.colors.themeCol2}
                    size={moderateScale(18)}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.leadCategoryInfo}>
            <Text style={styles.leadSubTitle}>Label</Text>
            <View style={styles.valuesWrapper}>
              <TouchableOpacity
                style={styles.editIconWrapper}
                onPress={() => setShowLabelOptions(!showLabelOptions)}>
                <View style={styles.editItem}>
                  <Text numberOfLines={3}>
                    {leadDetails?.label && Array.isArray(leadDetails?.label)
                      ? leadDetails.label.map((item, _index) => {
                          return _index < 5 ? (
                            <Text key={_index} style={styles.status}>
                              {item?.split('_').join(' ')}
                              {_index === 4 && leadDetails?.label?.length > 5
                                ? ` +${leadDetails.label.length - 5} others`
                                : leadDetails.label.length > _index + 1
                                ? ',  '
                                : ''}
                            </Text>
                          ) : null;
                        })
                      : null}
                  </Text>
                  <MaterialCommunityIcons
                    name={'pencil-outline'}
                    color={R.colors.themeCol2}
                    size={moderateScale(18)}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <QuickLeadOptions
          phoneNumber={leadDetails?.phone || ''}
          email={leadDetails?.email || ''}
          location={null}
          files={leadDetails?.files || []}
          leadId={leadDetails?._id}
        />

        <View style={styles.activityWrapper}>
          <GTopTabViewer
            initialRouteName={'Timeline'}
            tabBarStyle={styles.tabBarStyle}
            routes={tabRoutes}
          />
        </View>
        <LeadOptionActions
          leadId={leadId}
          list={leadDetails?.list}
          phone={leadDetails?.phone || ''}
          name={leadDetails?.name || ''}
          showOptionModal={optionModal}
          onModalHide={setOptionModal}
        />
        <OptionsPopup
          title={'Select status'}
          showOptionPopup={showStatusOptions}
          options={user?.userPreference?.status || []}
          selectedOptions={leadDetails?.status}
          displayColor
          onSelection={onStatusSelect}
          toggleOptionPopup={setShowStatusOptions}
          dataKeys={{
            itemIdKey: 'value',
            itemTitleKey: 'name',
            itemDescriptionKey: 'description',
          }}
        />
        <OptionsPopup
          title={'Select labels'}
          showOptionPopup={showLabelOptions}
          options={user?.userPreference?.labels || []}
          selectedOptions={leadDetails?.label}
          multiSelectEnabled
          displayColor
          onSelection={onLabelSelect}
          toggleOptionPopup={setShowLabelOptions}
          dataKeys={{
            itemIdKey: 'value',
            itemTitleKey: 'name',
            itemDescriptionKey: 'description',
          }}
        />
      </View>
    </GScreen>
  );
};

export default LeadDetailsScreen;
