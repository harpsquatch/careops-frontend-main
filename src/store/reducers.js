import { combineReducers } from 'redux';
import * as actions from './actionTypes';

const initialState = '';

const GetFirebaseToken = (state = initialState, action) => {
    switch (action.type) {
        case actions.FIREBASE_TOKEN:
            return action.payload.value;
        default:
            return state;
    }
};

const GetUserEmail = (state = initialState, action) => {
    switch (action.type) {
        case actions.USER_EMAIL:
            return action.payload.value;
        default:
            return state;
    }
};

const GetUserObject = (state = initialState, action) => {
    switch (action.type) {
        case actions.USER_DETAILS:
            return action.payload.value;
        default:
            return state;
    }
};

const GetSelectedUser = (state = initialState, action) => {
    switch (action.type) {
        case actions.SELECTED_USER:
            return action.payload.value;
        default:
            return state;
    }
};

const allReducer = combineReducers({
    FirebaseTokenReduxState: GetFirebaseToken,
    UserEmailReduxState: GetUserEmail,
    UserObjectReduxState: GetUserObject,
    SelectedUserReduxState: GetSelectedUser,
});

export default allReducer;

