import apiClient from '../api-client';

export const attendanceApi = {
    clockIn: async () => {
        const res: any = await apiClient.post('/attendance/clock-in');
        return res.data;
    },

    clockOut: async () => {
        const res: any = await apiClient.post('/attendance/clock-out');
        return res.data;
    },

    getTodayStatus: async () => {
        const res: any = await apiClient.get('/attendance/today');
        return res.data;
    },

    getMyRecords: async (page = 1) => {
        const res: any = await apiClient.get(`/attendance/my?page=${page}`);
        return res.data;
    },
};
