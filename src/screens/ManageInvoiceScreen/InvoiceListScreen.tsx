import BackButton from 'library/common/BackButton';
import GFlatList from 'library/common/GFlatList';
import GScreen from 'library/wrapper/GScreen';
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import R from 'resources/R';

const InvoiceListScreen = () => {
  return (
    <GScreen>
      <View style={styles.container}>
        <BackButton title="Invoices" />
        <View style={styles.listContainer}>
          <GFlatList
            data={[1, 2, 3, 4, 5]}
            renderItem={({item, index}) => (
              <InvoiceListItem key={index} item={item} />
            )}
          />
        </View>
      </View>
    </GScreen>
  );
};
export default InvoiceListScreen;
const InvoiceListItem = ({item}) => {
  return (
    <View style={styles.itemContainer}>
      <Pressable
        android_ripple={R.darkTheme.grayRipple}
        style={styles.innerContainer}>
        <View>
          <Text>Item</Text>
        </View>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: R.colors.white,
    marginBottom: 10,
    borderRadius: 15,
    elevation: 2,
    overflow: 'hidden',
  },
  innerContainer: {
    padding: 10,
  },
  listContainer: {
    marginTop: 20,
  },
});
