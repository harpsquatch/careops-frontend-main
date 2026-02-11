import { createStore } from 'redux';
import allReducer from './reducers';

function saveToSessionStorage(state) {
    try {
        sessionStorage.setItem('state', JSON.stringify(state));
    } catch (e) {
        console.error(e);
    }
}

function loadFromSessionStorage() {
    try {
        const saved = sessionStorage.getItem('state');
        return saved ? JSON.parse(saved) : undefined;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

const persistedState = loadFromSessionStorage();

const store = createStore(
    allReducer,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => saveToSessionStorage(store.getState()));

export default store;

