import SInfo from 'react-native-sensitive-info';

const sInfoUtil: any = {
  save: async (key: string, value: any) => {
    await SInfo.setItem(key, value, {});
  },
  fetch: async (key: string) => await SInfo.getItem(key, {}),
  remove: async (key: string) => {
    await SInfo.deleteItem(key, {});
  },
};

export default sInfoUtil;
