import {View, Text, TouchableOpacity, RefreshControl} from 'react-native';
import React, {useEffect} from 'react';
import {styles} from '../styles';
import AddActivityButton from '../../../library/common/AddActivityButton';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../../models/routes/screenName.enum';
import GFlatList from 'library/common/GFlatList';
import {getLeadNotes, selectLeadNotes} from '../../../store/slices/lead.slice';
import {Note} from 'datalib/entity/note';
import {RootDispatch, RootState} from '../../../store/app.store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import GAlert, {MessageType} from 'library/common/GAlert';
import R from 'resources/R';
import {ThunkStatusEnum} from '../../../models/common/thunkStatus.enum';
import {initialActivityPaginationMetaData} from '../../../store/slices/activity.slice';
import ga from 'library/hooks/analytics';

const Notes = (props: any) => {
  const leadId: string = props.route.params?.leadId;
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const notes: Array<Note> = useSelector((state: RootState) =>
    selectLeadNotes(state, leadId),
  );
  const getLeadNotesStatue = useSelector(
    (state: RootState) => state.lead.getLeadNotesStatue,
  );

  useEffect(() => {
    if (leadId) {
      const params = {...initialActivityPaginationMetaData};
      params.leadId = leadId || '';
      dispatch(getLeadNotes(params));
    }
  }, []);
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    GAlert('Note copied to clipboard', MessageType.SUCCESS);
  };
  const notesInformation = ({item, index}: any) => {
    return (
      <View style={styles.contentWrapper} key={index}>
        <View style={styles.noteDescriptionContainer}>
          <Text style={styles.noteDescription}>{item.description}</Text>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => copyToClipboard(item.description)}>
            <MaterialCommunityIcons
              name="content-copy"
              size={25}
              color={R.colors.themeCol2}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.createdAt}>
          Added by {item?.createdBy?.firstName} {item?.createdBy} on{' '}
          {item.createdAt
            ? moment(item.createdAt).format('DD MMM YYYY hh:mm a')
            : null}
        </Text>
      </View>
    );
  };
  const handleRefreshNotes = () => {
    const params = {...initialActivityPaginationMetaData};
    params.leadId = leadId || '';
    dispatch(getLeadNotes(params));
  };
  return (
    <View style={styles.actiVityContainer}>
      <View>
        <AddActivityButton
          title={'Add a note'}
          onPress={async () => {
            await ga.logEvent('Add_New_Notes');
            navigation.navigate(ScreenNameEnum.CREATE_NOTE_SCREEN, {leadId});
          }}
        />
      </View>
      <GFlatList
        refreshControl={
          <RefreshControl
            refreshing={getLeadNotesStatue.status === ThunkStatusEnum.LOADING}
            onRefresh={handleRefreshNotes}
            title="Pull down to refresh"
            tintColor={R.colors.white}
            titleColor={R.colors.white}
            colors={['red', 'green', 'blue']}
          />
        }
        data={notes}
        renderItem={notesInformation}
      />
    </View>
  );
};

export default Notes;
