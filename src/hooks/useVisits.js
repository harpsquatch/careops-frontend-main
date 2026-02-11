import { VISITS } from '../config';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../services/axiosInstance';
import { selectedUser } from '../store/selectors';

export function getAllEvents() {
    const uid = selectedUser();
    const url = uid ? `${VISITS}?uid=${uid}` : VISITS;
    return axiosInstance({ method: 'GET', url }).then((r) => r.data);
}

function updateVisit(data) {
    const { id, ...body } = data;
    return axiosInstance({ method: 'PUT', url: `${VISITS}/${id}`, data: body }).then((r) => r.data);
}

export function useUpdateEvent() {
    const queryClient = useQueryClient();
    return useMutation(updateVisit, {
        onSuccess: () => {
            queryClient.invalidateQueries('allEvents');
        },
    });
}

