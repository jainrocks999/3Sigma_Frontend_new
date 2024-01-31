/* eslint-disable react-hooks/exhaustive-deps */
import React, {FunctionComponent, useEffect} from 'react';
import {ActivityIndicator, Image, SafeAreaView, Text, View} from 'react-native';
import {styles} from './styles';
import AppImages from 'resources/images';
import R from 'resources/R';
import {Nillable} from '../../models/custom.types';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user.slice';
import {User} from 'datalib/entity/user';
import {RootDispatch, RootState} from '../../store/app.store';
import {getLeads} from '../../store/slices/lead.slice';
import {getAllList} from '../../store/slices/list.slice';
import {useNavigation} from '@react-navigation/native';
import {getAllContents} from '../../store/slices/content.slice';
import ScreenNameEnum from '../../models/routes/screenName.enum';

const IniializeData: FunctionComponent = ({
  hasNoInternet,
}: {
  hasNoInternet?: boolean;
}) => {
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();
  const user: Nillable<User> = useSelector(currentUserSelector);

  const {leadPaginationMetadata} = useSelector(
    (state: RootState) => state.lead,
  );
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, []);
  const loadInitialData = async () => {
    const payload = {...leadPaginationMetadata};
    await dispatch(getLeads(payload));
    dispatch(getAllList({perPage: 100}));
    dispatch(
      getAllContents({
        orderBy: 'createdAt',
        isAscending: true,
        page: 1,
        perPage: 500,
      }),
    );
    navigation.reset({
      index: 0,
      routes: [
        {
          name: ScreenNameEnum.HOME_TAB_SCREEN,
        },
      ],
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Image source={AppImages.splash} style={styles.image} />
      <View style={styles.loadingBlock}>
        <ActivityIndicator size={'small'} color={R.colors.themeCol2} />
        <Text style={styles.loadingText}>
          {hasNoInternet ? 'No internet' : 'Initializing...'}
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default IniializeData;
