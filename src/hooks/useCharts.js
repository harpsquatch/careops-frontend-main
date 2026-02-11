import { PATIENTS } from '../config';
import axiosInstance from '../services/axiosInstance';
import { selectedUser } from '../store/selectors';
import { useQuery } from 'react-query';

const getChartData = (patientId, uid) => {
    const hasUid = uid && uid.length > 0 && !isNaN(Number(uid));
    const url = hasUid
        ? `${PATIENTS}/${patientId}/chart?uid=${uid}`
        : `${PATIENTS}/${patientId}/chart`;
    return axiosInstance({ method: 'GET', url }).then((r) => r.data);
};

export const useGetChatData = (patientId) => {
    const selectedAccId = selectedUser();
    return useQuery(
        ['chartData', patientId, selectedAccId],
        () => getChartData(patientId, selectedAccId),
        { refetchOnWindowFocus: false, enabled: !!patientId }
    );
};

