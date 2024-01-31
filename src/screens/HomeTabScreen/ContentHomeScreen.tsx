/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import GScreen from 'library/wrapper/GScreen';
import GTopTabViewer from 'library/common/GTopTabViewer';
import ContentList from '../ManageContentScreen/ContentList';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {StyleSheet, Text, View} from 'react-native';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {useDispatch} from 'react-redux';
import {RootDispatch} from '../../store/app.store';
import {getAllContents} from '../../store/slices/content.slice';
import YouTubeLinkIcon from 'library/common/YouTubeLinkIcon';
const ContentHomeScreen = (props: any) => {
  const dispatch = useDispatch<RootDispatch>();
  useEffect(() => {
    if (props.navigation.isFocused()) {
      dispatch(
        getAllContents({
          orderBy: 'createdAt',
          isAscending: true,
          page: 1,
          perPage: 500,
        }),
      );
    }
  }, []);
  return (
    <GScreen>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.heading}>My Content</Text>
          <YouTubeLinkIcon screenName={ScreenNameEnum.FOLLOW_UP_HOME_SCREEN} />
        </View>
        <GTopTabViewer
          initialRouteName={'Team Member'}
          routes={[
            {
              name: 'Pages',
              component: ContentList,
              params: {
                type: 'page',
                createScreen: ScreenNameEnum.CREATE_PAGE_SCREEN,
              },
            },
            {
              name: 'Files',
              component: ContentList,
              params: {
                type: 'file',
                createScreen: ScreenNameEnum.CREATE_FILE_SCREEN,
              },
            },
            {
              name: 'Message',
              component: ContentList,
              params: {
                type: 'message',
                createScreen: ScreenNameEnum.CREATE_MESSAGE_SCREEN,
              },
            },
          ]}
        />
      </View>
    </GScreen>
  );
};
export default ContentHomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL3, FontWeightEnum.BOLD),
  },
});
