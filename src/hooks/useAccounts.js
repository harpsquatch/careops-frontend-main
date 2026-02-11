import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ACCOUNT } from '../config';
import axiosInstance from '../services/axiosInstance';
import { setUserObject } from '../store/actions';
import { useDispatch } from 'react-redux';
import { selectedUser, userObject } from '../store/selectors';

const getAccount = (uid) => {
    const url = uid ? `${ACCOUNT}?uid=${uid}` : ACCOUNT;
    return axiosInstance({ method: 'GET', url }).then((r) => r.data);
};

const updateAccount = (data) => {
    const { uid, ...body } = data;
    const url = uid ? `${ACCOUNT}?uid=${uid}` : ACCOUNT;
    return axiosInstance({ method: 'PUT', url, data: body }).then((r) => r.data);
};

export const useGetAccountDetails = () => {
    const selectedAccId = selectedUser();
    return useQuery(
        ['accountDetails', selectedAccId],
        () => getAccount(selectedAccId),
        { refetchOnWindowFocus: false }
    );
};

export const useUpdateAccountDetails = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const user = userObject();

    return useMutation(updateAccount, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('accountDetails').then(() => {
                dispatch(setUserObject({ ...user, ...data }));
            });
        },
        onError: (err) => console.error(err),
    });
};

