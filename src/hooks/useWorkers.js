import { WORKERS } from '../config';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useToast } from '../map_explorer_v2/contexts/ToastContext';
import axiosInstance from '../services/axiosInstance';
import { selectedUser } from '../store/selectors';

async function getWorkers() {
    const uid = selectedUser();
    const url = uid ? `${WORKERS}?uid=${uid}` : WORKERS;
    return axiosInstance({ method: 'GET', url }).then((r) => r.data);
}

const updateWorker = (data) => {
    const body = { uid: data.id, disabled: !data.worker.disabled };
    return axiosInstance({ method: 'PUT', url: `${WORKERS}/${data.id}`, data: body }).then((r) => r.data);
};

const addWorker = (data) => {
    const uid = selectedUser();
    const url = uid ? `${WORKERS}?uid=${uid}` : WORKERS;
    const body = { email: data.email };
    if (data.full_name) body.full_name = data.full_name;
    if (data.avatar) body.avatar = data.avatar;
    return axiosInstance({ method: 'POST', url, data: body }).then((r) => r.data);
};

const editWorker = (data) => {
    const body = { uid: data.uid };
    if (data.full_name !== undefined) body.full_name = data.full_name;
    if (data.email !== undefined) body.email = data.email;
    if (data.avatar !== undefined) body.avatar = data.avatar;
    return axiosInstance({ method: 'PUT', url: `${WORKERS}/${data.uid}`, data: body }).then((r) => r.data);
};

export const useWorkers = () => {
    const { toast } = useToast();
    return useQuery('allWorkers', getWorkers, {
        onError: () => toast.error('Error fetching workers'),
    });
};

export const useAddWorker = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation(addWorker, {
        onSuccess: () =>
            queryClient.invalidateQueries('allWorkers').then(() => toast.success('Worker added')),
    });
};

export const useUpdateWorker = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation(updateWorker, {
        onSuccess: () =>
            queryClient.invalidateQueries('allWorkers').then(() => toast.success('Worker updated')),
    });
};

export const useEditWorker = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation(editWorker, {
        onSuccess: () =>
            queryClient.invalidateQueries('allWorkers').then(() => toast.success('Worker saved')),
    });
};

