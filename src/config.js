export const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://127.0.0.1:8000';
export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || '';

// Patients
export const PATIENTS = BASE_URL + '/v1/patients';

// Visits
export const VISITS = BASE_URL + '/v1/visits';

// Workers
export const WORKERS = BASE_URL + '/v1/workers';

// Account
export const ACCOUNT = BASE_URL + '/v1/account';

// Auth
export const LOGIN = BASE_URL + '/v1/account/login';
export const VERIFY_TOKEN = BASE_URL + '/v1/account/verify';
