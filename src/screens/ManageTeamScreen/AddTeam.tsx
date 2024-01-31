import React, {useState} from 'react';
import {View} from 'react-native';
import AddButton from 'library/common/AddButton';
import BackButton from 'library/common/BackButton';
import {styles} from './styles';
import DynamicForm from 'library/form-field/DynamicForm';
import {ADD_TEAM_FORM} from '../../configs/constants';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  addTeam,
  getTeams,
  selectAllEmployees,
  selectRoelByName,
  updateTeam,
} from '../../store/slices/user.slice';
import Helper from '../../utils/helper';
import GScreen from 'library/wrapper/GScreen';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {TeamMember} from 'datalib/entity/team';

export default function AddTeam(props: any) {
  const editItem = props.route.params?.editItem || null;
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const updateTeamMemberStatus = useSelector(
    (state: RootState) => state.user.updateTeamMemberStatus,
  );
  const teamLeader = useSelector((state: RootState) =>
    selectRoelByName(state, 'team_leader'),
  );
  const users: Array<TeamMember> = useSelector(selectAllEmployees);
  const [item, setItem] = useState(
    editItem
      ? {
          name: editItem?.name,
        }
      : {},
  );
  const handleValueChange = (_value: {field: string; value: string}) => {
    const updatedItem = {...item, [_value.field]: _value.value};
    setItem(updatedItem);
  };
  const handleSavePress = async () => {
    let response = null;
    if (Helper.isFormValid(ADD_TEAM_FORM, item)) {
      if (editItem) {
        item._id = editItem._id;
        response = await dispatch(updateTeam(item));
      } else {
        response = await dispatch(addTeam(item));
      }
    }
    if (response && response.meta.requestStatus === 'fulfilled') {
      dispatch(getTeams({page: 1, perPage: 100}));
      navigation.goBack();
    }
  };
  ADD_TEAM_FORM[1].excludeOptions = users
    .filter(_u => _u.role !== teamLeader?._id)
    .map(_i => _i._id);
  return (
    <GScreen
      loading={updateTeamMemberStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.container}>
        <View style={styles.backButtonBox}>
          <BackButton title={'Add Team'} />
        </View>
        <View style={styles.formContainer}>
          <DynamicForm
            fieldValues={item}
            formFields={ADD_TEAM_FORM}
            handleValueChange={handleValueChange}
          />
        </View>
        <View style={styles.adButtonWrapper}>
          <AddButton title={'Add Team'} onPress={handleSavePress} />
        </View>
      </View>
    </GScreen>
  );
}
