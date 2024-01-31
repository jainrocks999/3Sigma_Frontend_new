/* eslint-disable react-hooks/exhaustive-deps */
import {View, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import BackButton from 'library/common/BackButton';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import DynamicForm, {FormField} from 'library/form-field/DynamicForm';
import GScreen from 'library/wrapper/GScreen';
import {
  createActivity,
  getActivityById,
  updateActivity,
} from '../../store/slices/activity.slice';
import {Activity} from 'datalib/entity/activity';
import {selectPrefrence} from '../../store/slices/user.slice';
import {RootDispatch, RootState} from '../../store/app.store';
import {isEmpty} from '../../utils/validators';
import GAlert from 'library/common/GAlert';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import R from 'resources/R';
import Geolocation from '@react-native-community/geolocation';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';

const ManageActivityScreen = (props: any) => {
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const leadIds: Array<string> = props.route.params?.leadIds;
  const editItem: Activity = props.route.params;
  const activityTypes: Array<any> = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.ACTIVITY_TYPE),
  );
  const {updateActivitysStatus} = useSelector(
    (state: RootState) => state.activity,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [customFields, setCustomFields] = useState([]);
  const [activity, setActivityData] = useState(
    editItem._id
      ? {
          date: editItem.performedAt,
          time: editItem.performedAt,
          type: editItem.type,
          notes: editItem.notes,
          _id: editItem._id,
        }
      : {
          date: new Date(),
          time: new Date().getTime(),
          type: '',
          notes: '',
        },
  );
  useEffect(() => {
    if (activity.type) {
      const activityType = activityTypes.find(
        item => item.value === activity.type,
      );
      if (
        activityType &&
        activityType.customFields &&
        activityType.customFields.length
      ) {
        setCustomFields(activityType.customFields);
      }
      if (editItem && editItem.customFields) {
        const _customFields = {};
        editItem.customFields.map((item: FormField) => {
          _customFields[item.field] = item.value;
        });
        setActivityData({...activity, ..._customFields});
      }
    }
  }, [activity?.type]);
  const addActivity = async () => {
    var timeAndDate = moment(
      moment(activity.date).format('YYYY-MM-DD') +
        ' ' +
        moment(activity.time).format('HH:mm'),
    );
    if (isEmpty(activity.type)) {
      GAlert('Please sleect activity type');
      return;
    }

    try {
      const payload: Activity = {
        type: activity.type,
        performedAt: timeAndDate.utc().toISOString(),
        extraDetails: {},
        createdTimestamp: new Date().getTime(),
      };
      if (activity.notes) {
        payload.notes = activity.notes;
      }
      if (customFields) {
        const fields = customFields.map((item: FormField) => {
          return {
            label: item.name,
            field: item.value,
            value: activity[item.value] || '',
          };
        });
        payload.customFields = fields;
      }
      let request = null;
      if (editItem._id) {
        payload._id = editItem._id;
        request = dispatch(updateActivity(payload));
      } else {
        payload.leadIds = leadIds;
        if (payload.type === 'checkin') {
          const location = await getCurrentLocation();
          payload.extraDetails = {coords: location};
        }
        request = dispatch(createActivity(payload));
      }
      request.then(_response => {
        if (_response.meta.requestStatus === 'fulfilled') {
          // if (editItem._id) {
          //   dispatch(getActivityById(editItem._id));
          // }
          navigation.goBack();
        }
      });
    } catch (error) {}

    // navigation.goBack();
  };
  const handleValueChange = (item: {field: string; value: string}) => {
    setActivityData({...activity, [item.field]: item.value});
  };
  const formFields: Array<FormField> = [
    {
      value: 'type',
      isRequired: true,
      type: 'selection',
      label: 'Type',
      options: activityTypes || [],
    },
    {
      value: 'date',
      isRequired: true,
      type: 'date',
      label: 'Activity Date',
      disableFutureDate: true,
    },
    {
      value: 'time',
      isRequired: true,
      type: 'time',
      label: 'Activity Time',
    },
    {
      value: 'notes',
      type: 'suggestion_input',
      label: 'Notes',
      multiLine: true,
      numberOfLines: 5,
      suggestion: [
        'Not interested',
        'Did not pick',
        'Meeting arranged',
        'Follow up',
      ],
    },
  ];
  if (customFields && customFields.length) {
    customFields.map((field: any) => {
      const newField: FormField = {...field};
      newField.label = newField.name;
      if (newField.fieldOptions) {
        newField.options = newField.fieldOptions;
      }
      formFields.push(newField);
    });
  }
  const getCurrentLocation = () =>
    new Promise<any>((resolve, reject) => {
      setLoading(true);
      Geolocation.getCurrentPosition(
        async position => {
          setLoading(false);
          resolve({
            latitude: parseFloat(`${position.coords.latitude}`),
            longitude: parseFloat(`${position.coords.longitude}`),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0922,
          });
        },
        _error => {
          GAlert('Timeout, Not able to fetch current location');
          reject(_error);
          // setCurrentLication(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 10000,
        },
      );
    });
  formFields[0].disable = editItem?.type ? true : false;
  return (
    <GScreen
      loading={
        loading || updateActivitysStatus.status === ThunkStatusEnum.LOADING
      }
      loadingText={loading ? 'Fetching location' : ''}>
      <View style={styles.container}>
        <View style={styles.backButtonWrapper}>
          <BackButton title={editItem._id ? 'Edit Activity' : 'Add Activity'} />
        </View>
        <DynamicForm
          formFields={formFields}
          fieldValues={activity}
          handleValueChange={handleValueChange}
          buttonPress={addActivity}
          buttonTitle={'ADD ACTIVITY'}
          containerStyle={styles.formContainer}
        />
      </View>
    </GScreen>
  );
};

export default ManageActivityScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  formContainer: {
    marginHorizontal: 20,
  },
});
