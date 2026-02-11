import store from './store';

export const selectFirebaseToken = () => store.getState().FirebaseTokenReduxState;

export const userObject = () => store.getState().UserObjectReduxState;

export const selectedUser = () => store.getState().SelectedUserReduxState;

