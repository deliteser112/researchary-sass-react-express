import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import paperReducer from './slices/paper';
import userReducer from './slices/user';
import teamReducer from './slices/team';
import conferenceReducer from './slices/conference';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const rootReducer = combineReducers({
  user: userReducer,
  team: teamReducer,
  conference: conferenceReducer,
  paper: paperReducer
});

export { rootPersistConfig, rootReducer };
