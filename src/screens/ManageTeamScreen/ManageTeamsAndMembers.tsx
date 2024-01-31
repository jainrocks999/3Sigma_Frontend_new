import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import TeamMembers from './TeamMembers';
import GTopTabViewer from 'library/common/GTopTabViewer';
import Teams from './Teams';
import BackButton from 'library/common/BackButton';
import GScreen from 'library/wrapper/GScreen';
import {RootState} from '../../store/app.store';
import {useSelector} from 'react-redux';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
// import HeadTitle from 'library/common/HeadTitle';

export default function ManageTeamsAndMembers() {
  const {updateTeamMemberStatus} = useSelector(
    (state: RootState) => state.user,
  );
  return (
    <GScreen
      loading={updateTeamMemberStatus.status === ThunkStatusEnum.LOADING}>
      <View style={styles.container}>
        <View style={styles.backButtonBox}>
          <BackButton title={'Manage Teams'} />
        </View>
        <GTopTabViewer
          initialRouteName={'Team Member'}
          routes={[
            {name: 'Team Member', component: TeamMembers},
            {name: 'Teams', component: Teams},
          ]}
        />
      </View>
    </GScreen>
  );
}
