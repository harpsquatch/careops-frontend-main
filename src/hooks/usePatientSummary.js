import { useQuery } from 'react-query';
import { PATIENT_SUMMARY } from '../config';
import axiosInstance from '../services/axiosInstance';
import { selectedUser } from '../store/selectors';

async function getPatientSummary(patientId) {
    if (!patientId) return null;
    const uid = selectedUser();
    const url = uid ? `${PATIENT_SUMMARY(patientId)}?uid=${uid}` : PATIENT_SUMMARY(patientId);
    try {
        const response = await axiosInstance({ method: 'GET', url });
        return response.data;
    } catch (error) {
        if (error?.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

export function usePatientSummary(patientId) {
    return useQuery(
        ['patientSummary', patientId],
        () => getPatientSummary(patientId),
        {
            enabled: !!patientId,
            staleTime: 30000, // 30 seconds
            cacheTime: 60000, // 1 minute
            retry: false,
        }
    );
}

