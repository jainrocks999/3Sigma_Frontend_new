import {View, Text, Pressable, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from 'resources/responsiveLayout';
import ConfirmationDialog from 'library/modals/ConfirmationDialog';
import {Team} from 'datalib/entity/team';
import {deleteTeam} from '../../../store/slices/user.slice';
import {RootDispatch} from '../../../store/app.store';
import {useDispatch} from 'react-redux';
import ScreenNameEnum from '../../../models/routes/screenName.enum';
import {useNavigation} from '@react-navigation/native';
import R from 'resources/R';
interface TeamGroupProps {
  item: Team;
}
const TeamGroup = ({item}: TeamGroupProps) => {
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const [showConfirmation, setConfirmation] = useState<boolean>(false);

  const handleOnDelete = async () => {
    await dispatch(deleteTeam(item?._id || ''));
    setConfirmation(false);
  };
  const handleTeamPress = () => {
    navigation.navigate(ScreenNameEnum.ADD_TEAM_SCREEN, {editItem: item});
  };
  return (
    <View style={styles.boxContainer}>
      <Pressable
        android_ripple={{color: 'gray'}}
        style={styles.teamsItem}
        onPress={handleTeamPress}>
        <View style={{flex: 1}}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.shortDescription} numberOfLines={2}>
            Organization : {item?.organization}
          </Text>
          <Text style={styles.smallText}>Created By : {item?.createdBy}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButtonWrapper}
          onPress={() => setConfirmation(true)}>
          <MaterialCommunityIcons
            name={'trash-can-outline'}
            color={R.colors.IndianRed}
            size={moderateScale(25)}
          />
        </TouchableOpacity>
      </Pressable>
      <ConfirmationDialog
        showDialog={showConfirmation}
        onConfirm={(status: boolean) => {
          if (status) {
            handleOnDelete();
          } else {
            setConfirmation(false);
          }
        }}
        confirmationMessage={'Are you sure want to delete?'}
      />
    </View>
  );
};

export default TeamGroup;
