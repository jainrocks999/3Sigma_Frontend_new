/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TourGuideZone, useTourGuideController} from 'rn-tourguide';
import sInfoUtil from '../../utils/sInfo.util';

const AppTourWrapper = ({screen}) => {
  const {canStart, start, eventEmitter} = useTourGuideController();

  React.useEffect(() => {
    if (canStart && screen) {
      handleStart();
    }
  }, [canStart]);
  const handleStart = async () => {
    const storedStatus = await sInfoUtil.fetch(screen);
    if (storedStatus) {
      console.log(screen, 'Tour already taken');
    } else {
      start();
      await sInfoUtil.save(screen, 'taken');
    }
  };
  const handleOnStart = () => console.log('start');
  const handleOnStop = () => console.log('stop');
  const handleOnStepChange = () => console.log('stepChange');

  React.useEffect(() => {
    if (eventEmitter) {
      eventEmitter.on('start', handleOnStart);
      eventEmitter.on('stop', handleOnStop);
      eventEmitter.on('stepChange', handleOnStepChange);
    }

    return () => {
      if (eventEmitter) {
        eventEmitter.off('start', handleOnStart);
        eventEmitter.off('stop', handleOnStop);
        eventEmitter.off('stepChange', handleOnStepChange);
      }
    };
  }, []);

  return (
    <View style={styles.middleView}>
      <TourGuideZone
        zone={1}
        shape="circle"
        text={'Welcome to 3Sigma Mobile APP tour'}
      />
    </View>
  );
};
export default AppTourWrapper;

const styles = StyleSheet.create({
  middleView: {
    alignItems: 'center',
    position: 'absolute',
    top: 300,
  },
});
