import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import BackButton from 'library/common/BackButton';
import {useNavigation} from '@react-navigation/native';
import GAlert, {MessageType} from 'library/common/GAlert';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {moderateScale} from 'resources/responsiveLayout';
import {RootDispatch, RootState} from '../../store/app.store';
import DynamicForm, {FormField} from 'library/form-field/DynamicForm';
import GScreen from 'library/wrapper/GScreen';
import {
  DEFAULT_TASK_TYPES,
  DueDateOptions,
  RepeatOptions,
} from '../../configs/constants';
import {
  currentUserSelector,
  selectPrefrence,
} from '../../store/slices/user.slice';
import {
  createTask,
  deleteTask,
  getAllTask,
  getTaskById,
  updateTask,
} from '../../store/slices/task.slice';
import {Task} from 'datalib/entity/task';
import {User} from 'datalib/entity/user';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import {DeleteButton} from 'library/common/ButtonGroup';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import {Nillable} from '../../models/custom.types';

const ManageTaskScreen = (props: any) => {
  const dispatch = useDispatch<RootDispatch>();
  const leadIds: string = props.route.params?.leadIds || [];
  const isEdit: string = props.route.params?.isEdit || false;
  const editItem: Task = props.route.params?.task || null;
  const user: Nillable<User> = useSelector(currentUserSelector);
  const {taskPaginationMetadata, filterMetadata, activeTab} = useSelector(
    (state: RootState) => state.task,
  );
  const navigation = useNavigation();
  const [showConfirm, setConfirmation] = useState<boolean>(false);
  const handleDelete = async (confirm: boolean) => {
    setConfirmation(false);
    if (confirm) {
      await dispatch(deleteTask(editItem._id || ''));
      const filterPayload = {
        ...filterMetadata,
        ...taskPaginationMetadata[activeTab],
      };
      await dispatch(getAllTask(filterPayload));
      navigation.goBack();
    }
  };
  const taskType: Array<any> = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.TASK_TYPE),
  );
  const updateTasksStatus = useSelector(
    (state: RootState) => state.task.updateTasksStatus,
  );
  const [task, setTaskData] = useState(
    isEdit
      ? {
          leadIds: [editItem.lead],
          type: editItem.type,
          dateOption: 'custom',
          date: editItem.toBePerformAt || new Date(),
          time: editItem.toBePerformAt,
          repeat: editItem.repeat,
          assignedTo: editItem?.assignedTo[0] || [],
          notes: editItem?.extraDetails?.description || editItem?.notes,
          isCompleted: editItem.isCompleted || false,
          _id: editItem._id,
        }
      : {
          leadIds: leadIds ? leadIds : [],
          time: new Date(),
        },
  );

  const [ADD_TASK_FORM, setTaskForm] = useState<Array<FormField>>([
    {
      value: 'leadIds',
      type: 'lead_picker',
      label: 'Select Leads',
      isRequired: true,
      multiSelect: true,
      disable: isEdit || leadIds.length ? true : false,
    },
    {
      value: 'type',
      isRequired: true,
      type: 'selection',
      label: 'Task Type',
      options: taskType || DEFAULT_TASK_TYPES,
    },
    {
      value: 'dateOption',
      isRequired: true,
      type: 'selection',
      label: 'Due date',
      options: DueDateOptions,
    },
    {
      value: 'date',
      isRequired: true,
      type: 'date',
      label: 'Custom Date',
      disable: isEdit ? false : true,
      disablePastDate: true,
    },
    {
      value: 'time',
      isRequired: true,
      type: 'time',
      label: 'Time',
    },

    {
      value: 'repeat',
      type: 'selection',
      label: 'Repeat',
      options: RepeatOptions,
    },
    {
      value: 'assignedTo',
      type: 'user_picker',
      excludeOptions: user?._id ? [user?._id] : [],
      label: 'Assign To',
      options: [],
    },
    {
      value: 'notes',
      type: 'suggestion_input',
      label: 'Note',
      multiLine: true,
      numberOfLines: 5,
    },
    {
      value: 'isCompleted',
      type: 'checkbox',
      label: 'Is Completed',
      disable: isEdit ? false : true,
    },
  ]);

  const addTask = async () => {
    if (!task.type) {
      GAlert('Please Select Task Type', MessageType.DANGER);
      return;
    } else if (!task.dateOption) {
      GAlert('Please Select Due Date', MessageType.DANGER);
      return;
    } else if (!task.time) {
      GAlert('Please Select Time', MessageType.DANGER);
      return;
    }
    // else if (!task.repeat) {
    //   GAlert('Please Select Repeat Type', MessageType.DANGER);
    //   return;
    // } else if (!task.assignedTo) {
    //   GAlert('Please Select Assigned To', MessageType.DANGER);
    //   return;
    // } else if (!task.note) {
    //   GAlert('Cannot save empty note', MessageType.DANGER);
    //   return;
    // }
    let toBePerformAt = null;
    let response = null;
    if (task.dateOption === 'custom') {
      let dt = moment(task.date).format('YYYY-MM-DD');
      let tm = moment(task.time).format('HH:mm');
      const timeAndDate = moment(dt + ' ' + tm);
      toBePerformAt = timeAndDate.toISOString();
    } else {
      let dt = moment().add(task.dateOption, 'days').format('YYYY-MM-DD');
      let tm = moment(task.time).format('HH:mm');
      const timeAndDate = moment(dt + ' ' + tm);
      toBePerformAt = timeAndDate.toISOString();
    }
    // return;
    const assignedTo =
      typeof task.assignedTo === 'string'
        ? task.assignedTo
        : task.assignedTo?._id || null;

    const payload: Task = {
      type: task.type,
      toBePerformAt: toBePerformAt,
      extraDetails: {},
    };
    if (assignedTo) {
      payload.assignedTo = [assignedTo];
    }
    if (task.notes && task.notes !== '') {
      payload.notes = task.notes;
    }
    if (task.repeat && task.repeat !== '') {
      payload.repeat = task.repeat;
    }
    if (task.isCompleted === true || task.isCompleted === false) {
      payload.isCompleted = task.isCompleted;
    }

    if (isEdit) {
      payload._id = editItem._id;
      response = await dispatch(updateTask(payload));
    } else {
      payload.leadIds = Array.isArray(task.leadIds)
        ? task.leadIds
        : [task.leadIds];

      response = await dispatch(createTask(payload));
    }
    if (response.meta.requestStatus === 'fulfilled') {
      if (isEdit) {
        dispatch(getTaskById(editItem?._id || ''));
      } else if (Array.isArray(task.leadIds) && task.leadIds.length > 0) {
        const filterPayload = {
          ...filterMetadata,
          ...taskPaginationMetadata[activeTab],
        };
        dispatch(getAllTask(filterPayload));
      }

      navigation.goBack();
    } else {
      throw new Error('');
    }
  };
  const handleValueChange = (_value: {field: string; value: string}) => {
    if (_value.field === 'dateOption' && _value.value === 'custom') {
      const newTaskForm = [...ADD_TASK_FORM];
      newTaskForm[3].disable = false;
      setTaskForm(newTaskForm);
    }
    const updatedItem = {...task, [_value.field]: _value.value};
    setTaskData(updatedItem);
  };
  return (
    <GScreen loading={updateTasksStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.container}>
        <View style={styles.backButtonWrapper}>
          <BackButton title={isEdit ? 'Edit Task' : 'Add Task'} />
          {editItem && <DeleteButton onPress={() => setConfirmation(true)} />}
        </View>
        <DynamicForm
          formFields={ADD_TASK_FORM}
          fieldValues={task}
          handleValueChange={handleValueChange}
          buttonPress={addTask}
          containerStyle={styles.formContainer}
        />
      </View>
      <ConfirmationDialog
        showDialog={showConfirm}
        onConfirm={handleDelete}
        confirmationMessage={'Are you sure want to delete?'}
      />
    </GScreen>
  );
};

export default ManageTaskScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
  },
});
