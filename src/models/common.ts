import { setStore } from '@/utils/lib';

const namespace = 'common';
export interface IUserSetting {
  uid: string | undefined;
  username: string;
  allowed: string[];
}

const defaultUserSetting: IUserSetting = {
  uid: undefined,
  username: '',
  allowed: ['/'],
};

export interface ICommon {
  user: IUserSetting;
}
const defaultState: ICommon = {
  user: defaultUserSetting,
};

export default {
  namespace,
  state: defaultState,
  reducers: {
    setStore,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async () => {
        let path = history.location.pathname;

        if (
          path === '/note' ||
          path === '/print/code' ||
          path === '/print/note_sheet' ||
          path === '/print/exchange'
        ) {
          return;
        }
      });
    },
  },
};
