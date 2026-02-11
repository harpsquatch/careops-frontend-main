import { PATIENTS } from '../config';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useToast } from '../map_explorer_v2/contexts/ToastContext';
import axiosInstance from '../services/axiosInstance';

async function getPatients(uid) {
    const url = uid ? `${PATIENTS}?uid=${uid}` : PATIENTS;
    return axiosInstance({ method: 'GET', url }).then((r) => r.data);
}

const createPatient = (data) => {
    const { uid, ...body } = data;
    const url = uid ? `${PATIENTS}?uid=${uid}` : PATIENTS;
    return axiosInstance({ method: 'POST', url, data: body }).then((r) => r.data);
};

const updatePatient = (data) => {
    const { id, uid, ...body } = data;
    const url = uid ? `${PATIENTS}/${id}?uid=${uid}` : `${PATIENTS}/${id}`;
    return axiosInstance({ method: 'PUT', url, data: body }).then((r) => r.data);
};

const deletePatient = (data) => {
    const url = data.uid
        ? `${PATIENTS}/${data.id}?uid=${data.uid}`
        : `${PATIENTS}/${data.id}`;
    return axiosInstance({ method: 'DELETE', url }).then((r) => r.data);
};

export function useHayVisionFields(selectedAccId) {
    return useQuery('hayVisionFields', () => getPatients(selectedAccId));
}

export const useAddHayFields = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation(createPatient, {
        onSuccess: () => queryClient.invalidateQueries('hayVisionFields'),
        onError: (err) => toast.error(err?.response?.data?.detail || 'Failed to add patient'),
    });
};

export const useUpdateHayField = () => {
    const queryClient = useQueryClient();
    return useMutation(updatePatient, {
        onSuccess: () => queryClient.invalidateQueries('hayVisionFields'),
    });
};

export const useDeleteHayField = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation(deletePatient, {
        onSuccess: () =>
            queryClient.invalidateQueries('hayVisionFields').then(() => toast.success('Deleted')),
    });
};

