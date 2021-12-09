import navReducer from './navSlice';
import userReducer from './userSlice';
import driverReducer from './driverSlice';
import { combineReducers } from 'redux';

export default combineReducers({
    navReducer,
    userReducer,
    driverReducer
});