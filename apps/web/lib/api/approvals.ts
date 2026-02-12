import apiClient from '../api-client';

export interface ApprovalLine {
    id: string;
    step: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT' | 'WAITING';
    comment?: string;
    approver: {
        name: string;
        position: string;
        department: {
            name: string;
        };
    };
}

export interface ApprovalDoc {
    id: string;
    title: string;
    content: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT';
    requester: {
        name: string;
        position: string;
        department: {
            name: string;
        };
    };
    lines: ApprovalLine[];
    createdAt: string;
}

export const approvalsApi = {
    create: async (data: { title: string; content: string; approverIds: string[] }) => {
        const res: any = await apiClient.post('/approvals', data);
        return res.data;
    },

    findAll: async () => {
        const res: any = await apiClient.get('/approvals');
        return res.data;
    },

    findOne: async (id: string) => {
        const res: any = await apiClient.get(`/approvals/${id}`);
        return res.data;
    },

    process: async (id: string, action: 'APPROVE' | 'REJECT', comment?: string) => {
        const res: any = await apiClient.put(`/approvals/${id}/process`, { action, comment });
        return res.data;
    },
};
