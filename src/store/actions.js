import * as actions from './actionTypes';

export const setFirebaseToken = (value) => ({
    type: actions.FIREBASE_TOKEN,
    payload: { value: value || null },
});

export const setUserEmail = (value) => ({
    type: actions.USER_EMAIL,
    payload: { value: value || null },
});

export const setUserObject = (value) => ({
    type: actions.USER_DETAILS,
    payload: { value: value || null },
});

export const setSelectedUser = (value) => ({
    type: actions.SELECTED_USER,
    payload: { value: value || null },
});

