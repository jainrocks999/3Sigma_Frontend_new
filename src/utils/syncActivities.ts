import {Platform, PermissionsAndroid} from 'react-native';
import CallLogs from 'react-native-call-log';
import AsyncStorage from '@react-native-community/async-storage';
import ActivityApi from 'datalib/services/activity.api';
// import BackgroundService from 'react-native-background-actions';

// const veryIntensiveTask = async () => {
//   // Example of an infinite loop task
//   await new Promise(async resolve => {
//     for (let i = 0; BackgroundService.isRunning(); i++) {
//       console.log(i);
//       await syncActivities();
//     }
//   });
// };
// export default veryIntensiveTask;
export default async function syncActivities() {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS !== 'ios') {
      try {
        // await AsyncStorage.removeItem('ACTIVITIES_SYNC_TIME');
        const lastSync = await AsyncStorage.getItem('ACTIVITIES_SYNC_TIME');
        //Ask for runtime permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          {
            title: 'Grant call log permissions to sync activities',
            message: 'Access your call logs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (typeof lastSync === 'undefined' || lastSync == null) {
            var d = new Date();
            d.setDate(d.getDate() - 3);
            const filter = {
              minTimestamp: d.getTime(),
              maxTimestamp: new Date().getTime(),
            };
            CallLogs.load(-1, filter).then(async (c: any) => {
              if (c.length > 0) {
                await processCallLogs(c);
                resolve(true);
              }
            });
          } else {
            const filter = {
              minTimestamp: lastSync, // (Number or String) timestamp in milliseconds since UNIX epoch
              maxTimestamp: new Date().getTime(), // (Number or String) timestamp in milliseconds since UNIX epoch
            };
            CallLogs.load(-1, filter).then(async (c: any) => {
              if (c.length > 0) {
                // await BackgroundService.updateNotification({
                //   taskDesc: `synchronizing ${c.length} call logs...`,
                // });
                await processCallLogs(c);
                resolve(true);
              }
            });
          }
        } else {
          console.log('Call Log permission denied');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log(
        'Sorry! You can’t get call logs in iOS devices because of the security concern',
      );
      reject();
    }
  });
}

async function processCallLogs(listData: Array<any>) {
  var phones: any = [];
  const logs: any = {};
  if (listData) {
    listData.map((log: any) => {
      const item = {...log};
      const number = item.phoneNumber;
      delete item.name;
      delete item.rawType;
      delete item.phoneNumber;
      if (!phones.includes(number)) {
        phones.push(number);
        logs[number] = [{...item, extraDetails: {}}];
      } else {
        logs[number].push({...item, extraDetails: {}});
      }
    });
    const response = await new ActivityApi().syncActivity(logs);
    if (response && response.status) {
      await AsyncStorage.setItem(
        'ACTIVITIES_SYNC_TIME',
        `${new Date().getTime()}`,
      );
    }
  }
}
