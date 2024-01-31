import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import DraggableFlatList from 'react-native-draggable-flatlist';
import R from 'resources/R';

export interface GFlatListProps extends FlatListProps<any> {
  emptyMessage?: string;
  dragable?: boolean;
  loading?: boolean;
  onDragEnd?: () => void;
}
const GFlatList = (props: GFlatListProps) => {
  // if (!props.data || props.data.length === 0) {
  //   return <FooterComponent message={props.emptyMessage || ''} />;
  // } else {

  // }
  return props.dragable ? (
    <DraggableFlatList
      {...props}
      onDragEnd={({data}) => props.onDragEnd && props.onDragEnd(data)}
      contentContainerStyle={[styles.innerStyle, props.contentContainerStyle]}
      initialNumToRender={20}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        !props.data || props.data.length === 0 ? (
          <FooterComponent message={props.emptyMessage || ''} />
        ) : (
          props.ListFooterComponent || null
        )
      }
    />
  ) : (
    <FlatList
      {...props}
      contentContainerStyle={[styles.innerStyle, props.contentContainerStyle]}
      initialNumToRender={20}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <FooterComponent
          message={props.loading ? 'Loading' : props.emptyMessage || ''}
        />
      }
      ListFooterComponent={props.ListFooterComponent}
    />
  );
};
export default GFlatList;
export const FooterLoader = ({isVisible = false, loadingText = 'Loading'}) => {
  if (isVisible) {
    return (
      <View style={styles.loaderContaner}>
        <ActivityIndicator color={R.colors.themeCol2} />
        <Text style={styles.loaderText}>{loadingText}</Text>
      </View>
    );
  } else {
    return null;
  }
};
const FooterComponent = ({message}: any) =>
  message !== '' ? (
    <View style={styles.footerContainer}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  ) : null;
const styles = StyleSheet.create({
  footerContainer: {
    paddingTop: 20,
    textAlign: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  messageText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: 'black',
    textAlign: 'center',
    marginTop: 30,
    minHeight: 50,
  },
  innerStyle: {paddingVertical: 10},
  loaderContaner: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  loaderText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: 'gray',
    marginLeft: 5,
  },
});
