import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/user.slice';
import quotationReducer from './slices/quotation.slice';
import leadReducer from './slices/lead.slice';
import ContentReducer from './slices/content.slice';
import TaskReducer from './slices/task.slice';
import ActivityReducer from './slices/activity.slice';
import ListReducer from './slices/list.slice';
import DashboardReducer from './slices/dashboard.slice';
import CallLogReducer from './slices/calllog.slice';

const store = configureStore({
  reducer: {
    user: userReducer,
    lead: leadReducer,
    task: TaskReducer,
    dashboard: DashboardReducer,
    activity: ActivityReducer,
    content: ContentReducer,
    quotation: quotationReducer,
    list: ListReducer,
    calllog: CallLogReducer,
  },
});

export type RootDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
