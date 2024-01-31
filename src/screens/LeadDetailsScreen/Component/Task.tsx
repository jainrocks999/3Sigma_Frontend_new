import {View, Text, TouchableOpacity, RefreshControl} from 'react-native';
import React, {useEffect} from 'react';
import {styles} from '../styles';
import AddActivityButton from '../../../library/common/AddActivityButton';
import ScreenNameEnum from '../../../models/routes/screenName.enum';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import GFlatList from 'library/common/GFlatList';
import {RootDispatch, RootState} from '../../../store/app.store';
import {Task as TaskEntity} from 'datalib/entity/task';
import {PrefrenceKeyEnum} from '../../../models/common/preference.keys.enum';
import {selectPrefrence} from '../../../store/slices/user.slice';
import {taskFormat} from '../../../utils/formatter';
import {DEFAULT_TASK_TYPES} from '../../../configs/constants';
import {
  getAllTask,
  initialFilterMetadata,
  selectTaskByLead,
} from '../../../store/slices/task.slice';
import R from 'resources/R';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
import ga from 'library/hooks/analytics';

const Task = (props: any) => {
  const leadId: string = props.route.params?.leadId;
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const tasks: Array<TaskEntity> = useSelector((state: RootState) =>
    selectTaskByLead(state, leadId),
  );
  const taskType: Array<any> = useSelector((state: RootState) =>
    selectPrefrence(state, PrefrenceKeyEnum.TASK_TYPE),
  );
  const {findTasksStatus} = useSelector((state: RootState) => state.task);
  useEffect(() => {
    if (leadId) {
      handleRefreshNotes();
    }
  }, []);
  const handleRefreshNotes = async () => {
    const payload = {...initialFilterMetadata};
    payload.leadId = leadId || '';
    dispatch(getAllTask({...payload, page: 1, perPage: 200}));
  };
  const getTaskType = key => {
    const type = (taskType || DEFAULT_TASK_TYPES).find(
      item => item.value === key,
    );
    return type ? type.name : 'NA';
  };
  const renderItem = ({item, index}: {item: TaskEntity; index: number}) => {
    const format = taskFormat(item?.type);
    return (
      <TouchableOpacity
        style={{marginHorizontal: 20}}
        key={index}
        onPress={async () => {
          await ga.logEvent('Add_New_Task');
          navigation.navigate(ScreenNameEnum.UPDATE_TASK_SCREEN, {
            task: item,
            isEdit: true,
          });
        }}>
        <View style={styles.taskItemMainWrapper}>
          <View style={styles.dateIconWrapper}>
            <View
              style={[
                styles.callIconWrapper,
                {backgroundColor: format.ltCntColor},
              ]}>
              {format.ltCntIcon}
            </View>
            <Text style={styles.dateText}>
              {moment(item?.toBePerformAt).format('DD MMM')}
            </Text>
          </View>
          <View style={styles.taskInformation}>
            <Text style={styles.taskCallText}>
              {getTaskType(item?.type)} -{' '}
              {moment(item?.toBePerformAt).format('hh:mm a')}{' '}
              {item.repeat || ''}
            </Text>
            {item?.note && (
              <Text numberOfLines={2} style={styles.taskNameText}>
                Note : {item?.note}
              </Text>
            )}
            {item?.notes && (
              <Text numberOfLines={2} style={styles.taskNameText}>
                Note : {item?.notes}
              </Text>
            )}
            {item?.extraDetails && item.extraDetails?.description ? (
              <Text numberOfLines={2} style={styles.taskNameText}>
                Note : {item.extraDetails?.description}
              </Text>
            ) : null}
            {item?.createdBy ? (
              <Text style={styles.taskOwnerText}>
                Owner : {item?.createdBy}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.actiVityContainer}>
      <View>
        <AddActivityButton
          title={'Add a Task'}
          onPress={() =>
            navigation.navigate(ScreenNameEnum.CREATE_TASK_SCREEN, {
              leadIds: [leadId],
            })
          }
        />
      </View>

      <GFlatList
        data={tasks}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={findTasksStatus.status === ThunkStatusEnum.LOADING}
            onRefresh={handleRefreshNotes}
            title="Pull down to refresh"
            tintColor={R.colors.white}
            titleColor={R.colors.white}
            colors={['red', 'green', 'blue']}
          />
        }
      />
    </View>
  );
};

export default Task;
