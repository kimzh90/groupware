import apiClient from '../api-client';

export interface DashboardStats {
    totalUsers: number;
    totalApprovals: number;
    pendingApprovals: number;
    todayLogins: number;
    weeklyLoginData: Array<{
        day: string;
        count: number;
    }>;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export const adminApi = {
    getStats: () => apiClient.get<any, any>('/admin/stats').then(res => res.data as DashboardStats),

    getLogs: (params?: { limit?: number; offset?: number }) =>
        apiClient.get<any, any>('/admin/logs', { params }).then(res => res.data as AuditLog[]),
};
