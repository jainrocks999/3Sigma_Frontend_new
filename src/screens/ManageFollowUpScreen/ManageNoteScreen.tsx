import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import BackButton from 'library/common/BackButton';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import DynamicForm, {FormField} from 'library/form-field/DynamicForm';
import GScreen from 'library/wrapper/GScreen';

import {isEmpty} from '../../utils/validators';
import {Note} from 'datalib/entity/note';
import GAlert from 'library/common/GAlert';
import {addNotes, getLeadNotes} from '../../store/slices/lead.slice';
import {RootDispatch, RootState} from '../../store/app.store';
import R from 'resources/R';
import {initialActivityPaginationMetaData} from '../../store/slices/activity.slice';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';

const ManageActivityScreen = (props: any) => {
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const leadId: string = props.route.params?.leadId;
  const {addNotesStatus} = useSelector((state: RootState) => state.lead);
  const [note, setNoteData] = useState<Note>({
    description: '',
  });

  const addNote = async () => {
    if (isEmpty(note.description)) {
      GAlert('Cannot save empty note');
      return;
    }
    note.lead = leadId;
    try {
      const response = await dispatch(addNotes(note));
      if (response.meta.requestStatus === 'fulfilled') {
        const params = {...initialActivityPaginationMetaData};
        params.leadId = leadId || '';
        dispatch(getLeadNotes(params));
        navigation.goBack();
      }
    } catch (error) {
      GAlert('Error while saving note');
    }
  };
  const handleValueChange = (item: {field: string; value: string}) => {
    setNoteData({...note, [item.field]: item.value});
  };
  const formFields: Array<FormField> = [
    {
      value: 'description',
      isRequired: true,
      type: 'suggestion_input',
      label: 'Notes',
      multiLine: true,
      numberOfLines: 5,
      suggestion: [],
    },
  ];
  return (
    <GScreen
      loading={addNotesStatus.status === ThunkStatusEnum.LOADING}
      hasKeyboardAvoidView>
      <View style={styles.container}>
        <View style={styles.backButtonWrapper}>
          <BackButton title="Add Note" />
        </View>
        <DynamicForm
          formFields={formFields}
          fieldValues={note}
          handleValueChange={handleValueChange}
          buttonPress={addNote}
          buttonTitle={'ADD NOTE'}
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
