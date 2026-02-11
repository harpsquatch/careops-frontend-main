import { WORKERS } from '../config';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import axiosInstance from '../services/axiosInstance';
import { selectedUser } from '../store/selectors';

async function getWorkers() {
    const uid = selectedUser();
    const url = uid ? `${WORKERS}?uid=${uid}` : WORKERS;
    return axiosInstance({ method: 'GET', url }).then((r) => r.data);
}

const updateWorker = (data) => {
    const body = { uid: data.id, disabled: !data.worker[data.category] };
    return axiosInstance({ method: 'PUT', url: `${WORKERS}/${data.id}`, data: body }).then((r) => r.data);
};

const addWorker = (data) => {
    const uid = selectedUser();
    const url = uid ? `${WORKERS}?uid=${uid}` : WORKERS;
    return axiosInstance({ method: 'POST', url, data: { email: data.email } }).then((r) => r.data);
};

export const useWorkers = () =>
    useQuery('allWorkers', getWorkers, {
        onError: () => toast.error('Error fetching workers'),
    });

export const useAddWorker = () => {
    const queryClient = useQueryClient();
    return useMutation(addWorker, {
        onSuccess: () =>
            queryClient.invalidateQueries('allWorkers').then(() => toast.success('Worker added')),
    });
};

export const useUpdateWorker = () => {
    const queryClient = useQueryClient();
    return useMutation(updateWorker, {
        onSuccess: () =>
            queryClient.invalidateQueries('allWorkers').then(() => toast.success('Worker updated')),
    });
};

