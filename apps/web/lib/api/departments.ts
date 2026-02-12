import apiClient from '../api-client';

export const departmentsApi = {
    getTree: async () => {
        const res: any = await apiClient.get('/departments/tree');
        return res.data;
    },

    findAll: async () => {
        const res: any = await apiClient.get('/departments');
        return res.data;
    },
};
