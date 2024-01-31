/* eslint-disable react-hooks/exhaustive-deps */
import React, {PureComponent, useEffect, useState} from 'react';
import GFlatList from 'library/common/GFlatList';
import {
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../../store/app.store';
import {Task} from 'datalib/entity/task';
import {
  getAllTask,
  selectTaskById,
  selectTaskByType,
} from '../../../store/slices/task.slice';
import moment from 'moment';
import {EditButton} from 'library/common/ButtonGroup';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../../models/routes/screenName.enum';
import {taskFormat} from '../../../utils/formatter';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
import {TaskTypeEnum} from '../../../models/common/task.type.enum';
const FollowUpList = (props: any) => {
  const taskTypes: TaskTypeEnum = props.route.name;

  const dispatch = useDispatch<RootDispatch>();
  const {
    taskPaginationMetadata,
    filterMetadata,
    loadedTabs,
    totalTasks,
    findTasksStatus,
  } = useSelector((state: RootState) => state.task);
  const tasks: Array<Task> = useSelector((state: RootState) =>
    selectTaskByType(state, taskTypes),
  );

  useEffect(() => {
    if (
      props.navigation.isFocused() &&
      !loadedTabs.includes(taskTypes) &&
      findTasksStatus.status !== ThunkStatusEnum.LOADING
    ) {
      const payload = {...taskPaginationMetadata[taskTypes], ...filterMetadata};
      dispatch(getAllTask(payload));
    }
  }, [taskTypes, props.navigation.isFocused()]);
  const renderItem = ({item, index}: {item: any; index: number}) => {
    return <PureTaskItem taskId={item._id} key={index} taskTypes={taskTypes} />;
  };
  const handleEndReached = ({distanceFromEnd}: any) => {
    if (
      distanceFromEnd > 0 &&
      findTasksStatus.status !== ThunkStatusEnum.LOADING
    ) {
      const payload = {...taskPaginationMetadata[taskTypes], ...filterMetadata};
      const total = totalTasks[taskTypes];
      const nextPage = (taskPaginationMetadata[taskTypes].page || 1) + 1;
      const maxPages = Math.ceil(total / 20);
      if (maxPages >= nextPage) {
        payload.page = nextPage;
        dispatch(getAllTask(payload));
      }
    }
  };
  return (
    <View style={styles.listContainer}>
      <GFlatList
        data={tasks || []}
        renderItem={renderItem}
        style={styles.listStyle}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainerStyle}
        onEndReachedThreshold={2}
        initialNumToRender={10}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl
            refreshing={findTasksStatus.status === ThunkStatusEnum.LOADING}
            onRefresh={() =>
              dispatch(
                getAllTask({
                  ...taskPaginationMetadata[taskTypes],
                  ...filterMetadata,
                }),
              )
            }
            title="Pull down to refresh"
            tintColor={R.colors.white}
            titleColor={R.colors.white}
            colors={['red', 'green', 'blue']}
          />
        }
        loading={findTasksStatus.status === ThunkStatusEnum.LOADING}
        emptyMessage={
          totalTasks && totalTasks[taskTypes] <= 0
            ? 'Create your first task'
            : taskTypes === TaskTypeEnum.TODAY
            ? 'No task due today'
            : `No ${taskTypes} task found`
        }
      />
    </View>
  );
};
export default FollowUpList;
class PureTaskItem extends PureComponent {
  constructor(props: {taskId: string; taskTypes: string}) {
    super(props);
  }
  render(): React.ReactNode {
    return (
      <TaskItem taskId={this.props?.taskId} taskTypes={this.props?.taskTypes} />
    );
  }
}
const TaskItem = ({taskId, taskTypes}: {taskId: string; taskTypes: string}) => {
  const navigation = useNavigation();
  const task: Task | undefined = useSelector((state: RootState) =>
    selectTaskById(state, taskId),
  );

  const handleOnPress = () => {
    navigation.navigate(ScreenNameEnum.UPDATE_TASK_SCREEN, {
      task: task,
      isEdit: true,
    });
  };
  const format = taskFormat(task?.type || '');
  return (
    <View style={styles.container}>
      <Pressable
        android_ripple={R.darkTheme.grayRipple}
        onPress={() =>
          task?.lead &&
          task?.lead.length &&
          navigation.navigate(ScreenNameEnum.LEAD_PROFILE_SCREEN, {
            id: task?.lead[0]?._id,
          })
        }>
        <View style={styles.myListCompo}>
          <TouchableOpacity
            style={[styles.rightCircle, {backgroundColor: format.ltCntColor}]}
            onPress={() => null}>
            {format.ltCntIcon}
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Text
              numberOfLines={1}
              style={[styles.listTxt, {color: format.baseCol}]}>
              {format.title}
            </Text>
            <Text numberOfLines={1} style={styles.boldTxt}>
              {task?.lead[0]?.name || ''}
            </Text>
            <Text numberOfLines={1} style={[styles.smallText]}>
              {`Owner : ${task?.createdBy}`}
            </Text>
            {/* {task?.note && (
              <Text numberOfLines={2} style={styles.smallText}>
                Note : {task?.note}
              </Text>
            )}
            {task?.notes && (
              <Text numberOfLines={2} style={styles.smallText}>
                Note : {task?.notes}
              </Text>
            )}
            {task?.extraDetails && task.extraDetails?.description ? (
              <Text numberOfLines={2} style={styles.smallText}>
                Note : {task.extraDetails?.description}
              </Text>
            ) : null} */}
            <Text numberOfLines={1} style={[styles.smallText]}>
              {taskTypes !== 'today'
                ? `${moment(task?.toBePerformAt).format('DD MMM YYYY')} `
                : null}
              {moment(task?.toBePerformAt).format('hh:mm a')}
            </Text>
          </View>
          {task && !task.isCompleted && (
            <View style={styles.flexRow}>
              <EditButton onPress={handleOnPress} />
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  rightCircle: {
    height: 40,
    width: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(230,138,240,0.4)',
  },
  myListCompo: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',

    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  listTxt: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol1,
  },
  boldTxt: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
  },
  smallText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.labelCol1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
  },
  flexRow: {
    flexDirection: 'row',
  },
  container: {
    backgroundColor: R.colors.white,
    borderRadius: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  listContainerStyle: {
    paddingVertical: 10,
  },
  listStyle: {paddingBottom: 40},
});
