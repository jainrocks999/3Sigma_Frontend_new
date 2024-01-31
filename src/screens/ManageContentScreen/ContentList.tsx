/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {View, RefreshControl} from 'react-native';
import ContentItem from './Component/ContentItem';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import GFlatList from 'library/common/GFlatList';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  getAllContents,
  selectAllContentByType,
} from '../../store/slices/content.slice';
import {ContentTypeEnum} from '../../models/common/content.enum';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import R from 'resources/R';
import HoverButton from 'library/buttons/HoverButton';
import ga from 'library/hooks/analytics';

const ContentList = ({route}: any) => {
  const dispatch = useDispatch<RootDispatch>();
  const navigation = useNavigation();

  const contentType: ContentTypeEnum = route.params.type;
  const pagination = useSelector(
    (state: RootState) => state.content.contentPaginationMetadata,
  );
  const fetchContentStatus = useSelector(
    (state: RootState) => state.content.fetchContentStatus,
  );
  const contentList = useSelector((state: RootState) =>
    selectAllContentByType(state, contentType),
  );

  const onClickAdd = async () => {
    await ga.logEvent('Add_New_' + contentType);
    navigation.navigate(route.params.createScreen);
  };
  const handleEndReached = (info: {distanceFromEnd: number}) => {
    if (
      info.distanceFromEnd > 0 &&
      fetchContentStatus.status !== ThunkStatusEnum.LOADING
    ) {
      const page = pagination[contentType].page || 1;
      const maxPages = Math.ceil(contentList.length / 100);
      if (maxPages >= page + 1) {
        handleRefreshContent(page + 1);
      }
    }
  };
  const handleRefreshContent = (page = 1) => {
    const payload = {...pagination[contentType]};
    payload.page = page;
    dispatch(
      getAllContents({
        orderBy: 'createdAt',
        isAscending: true,
        page: 1,
        perPage: 500,
      }),
    );
  };
  return (
    <View style={styles.container}>
      <GFlatList
        data={contentList}
        emptyMessage={`Press + to add your first ${contentType}`}
        renderItem={({item}) => {
          return (
            <ContentItem item={item} createScreen={route.params.createScreen} />
          );
        }}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl
            refreshing={fetchContentStatus.status === ThunkStatusEnum.LOADING}
            onRefresh={() => {
              dispatch(getAllContents(pagination[contentType]));
            }}
            title="Pull down to refresh"
            tintColor={R.colors.white}
            titleColor={R.colors.white}
            colors={['red', 'green', 'blue']}
          />
        }
      />
      <View style={styles.bottomFixedBtn}>
        <HoverButton style={styles.hoverBtn} right onPress={onClickAdd} />
      </View>
    </View>
  );
};
export default ContentList;
