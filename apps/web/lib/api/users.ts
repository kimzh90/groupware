import apiClient from '../api-client';

export interface User {
    id: string;
    email: string;
    name: string;
    employeeId: string;
    position: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
    department: {
        id: string;
        name: string;
    } | null;
    manager: {
        id: string;
        name: string;
    } | null;
}

export const usersApi = {
    findAll: () => apiClient.get<any, any>('/users').then(res => res.data as User[]),
    findOne: (id: string) => apiClient.get<any, any>(`/users/${id}`).then(res => res.data as User),
    update: (id: string, data: Partial<User>) => apiClient.patch(`/users/${id}`, data).then(res => (res as any).data),
};
