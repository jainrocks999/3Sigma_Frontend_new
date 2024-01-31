/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import GTopTabViewer from 'library/common/GTopTabViewer';
import GScreen from 'library/wrapper/GScreen';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import HoverButton from 'library/buttons/HoverButton';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import FollowUpList from './Components/FollowUpList';
import {moderateScale} from 'resources/responsiveLayout';
import {RootDispatch, RootState} from '../../store/app.store';
import {getAllTask, restoreTaskStore} from '../../store/slices/task.slice';
import {TaskTypeEnum} from '../../models/common/task.type.enum';
import UserSelectionModal from 'library/modals/UserSelectionModal';
import {Nillable} from '../../models/custom.types';
import {User} from 'datalib/entity/user';
import YouTubeLinkIcon from 'library/common/YouTubeLinkIcon';
import Helper from '../../utils/helper';
import {currentUserSelector} from '../../store/slices/user.slice';
import ga from 'library/hooks/analytics';

export default function FollowUpHomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const user: Nillable<User> = useSelector(currentUserSelector);
  const [showUserModal, setShowUserModal] = useState(false);
  // const [currentTab, setCurrentTab] = useState<TaskTypeEnum>(
  //   TaskTypeEnum.TODAY,
  // );
  const {taskPaginationMetadata, filterMetadata, activeTab} = useSelector(
    (state: RootState) => state.task,
  );
  const [assignedTo, setSelectedUser] = useState<Nillable<User>>(null);
  const totalTasks = useSelector((state: RootState) => state.task.totalTasks);

  // const onTabPress = (tabName: TaskTypeEnum) => {
  //   setCurrentTab(tabName);
  // };
  const handleUserChange = async (_user: string) => {
    const payload = {...filterMetadata};
    if (_user === 'assigned_to_me') {
      payload.assignToUser = user?._id;
      delete payload.isAssignByMe;
      delete payload.userId;
    } else if (_user === 'assigned_by_me') {
      payload.isAssignByMe = true;
      delete payload.assignToUser;
      delete payload.userId;
    } else if (_user === 'my_task') {
      delete payload.isAssignByMe;
      delete payload.assignToUser;
      delete payload.userId;
    } else if (_user) {
      payload.userId = _user;
      delete payload.isAssignByMe;
      delete payload.assignToUser;
    }
    payload.status = activeTab;
    await dispatch(restoreTaskStore());
    dispatch(getAllTask({...payload, ...taskPaginationMetadata[activeTab]}));
  };

  return (
    <GScreen>
      <View style={styles.backgroundContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.taskHeader}>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.justifyContainer]}>
              <View style={styles.container}>
                <Text style={styles.heading}>Tasks</Text>
                <YouTubeLinkIcon
                  screenName={ScreenNameEnum.FOLLOW_UP_HOME_SCREEN}
                />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setShowUserModal(true)}
            style={styles.assignBtn}>
            <Text numberOfLines={1} style={styles.btnAddText}>
              {assignedTo ? assignedTo?.name || '' : 'My Tasks'}
            </Text>
            <MaterialCommunityIcons
              name={'chevron-down'}
              size={25}
              color={R.colors.black}
            />
          </TouchableOpacity>
        </View>

        <GTopTabViewer
          tabBarStyle={styles.tabBarStyle}
          initialRouteName="Today"
          routes={[
            {
              name: TaskTypeEnum.TODAY,
              label: `Today (${Helper.kFormatter(totalTasks?.today || 0)})`,
              component: FollowUpList,
              params: {assignedTo: assignedTo?._id},
            },
            {
              name: TaskTypeEnum.UPCOMING,
              label: `Upcoming (${Helper.kFormatter(
                totalTasks?.upcoming || 0,
              )})`,
              component: FollowUpList,
              params: {assignedTo: assignedTo?._id},
            },
            {
              name: TaskTypeEnum.OVERDUE,
              label: `Overdue (${Helper.kFormatter(totalTasks?.overdue || 0)})`,
              component: FollowUpList,
              params: {assignedTo: assignedTo?._id},
            },
            {
              name: TaskTypeEnum.COMPLETED,
              label: `Done (${Helper.kFormatter(totalTasks?.completed || 0)})`,
              component: FollowUpList,
              params: {assignedTo: assignedTo?._id},
            },
          ]}
        />
        <HoverButton
          style={styles.hoverBtn}
          right
          onPress={async () => {
            await ga.logEvent('Add_New_Task');
            navigation.navigate(ScreenNameEnum.CREATE_TASK_SCREEN);
          }}
        />
        <UserSelectionModal
          isVisible={showUserModal}
          onModalHide={setShowUserModal}
          onOptionSelect={(selectedOptions: any) => {
            handleUserChange(selectedOptions._id);
            setSelectedUser(selectedOptions);
          }}
          additionalOptions={[
            {
              _id: 'assigned_by_me',
              name: 'Assigned By Me',
              description: '',
            },
            {
              _id: 'assigned_to_me',
              name: 'Assigned To Me',
              description: '',
            },
            {
              _id: 'my_task',
              name: 'My Task',
              description: '',
            },
          ]}
        />
      </View>
    </GScreen>
  );
}

const styles = StyleSheet.create({
  justifyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchConatiner: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backgroundContainer: {flex: 1, backgroundColor: R.colors.bgCol},
  headerTitle: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL3, FontWeightEnum.BOLD),
  },
  btnAddText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: 'black',
    alignSelf: 'center',
  },
  hoverBtn: {
    ...Platform.select({
      ios: {bottom: 45},
      android: {bottom: 25},
    }),
    opacity: 1,
  },
  tabBarStyle: {
    backgroundColor: R.colors.bgCol,
    borderBottomColor: R.colors.black,
    paddingVertical: moderateScale(5),
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  heading: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL3, FontWeightEnum.BOLD),
  },
  assignBtn: {flexDirection: 'row', alignItems: 'center'},
});
