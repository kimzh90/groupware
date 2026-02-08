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
    create: (data: { title: string; content: string; approverIds: string[] }) =>
        apiClient.post('/approvals', data),

    findAll: () => apiClient.get<any, ApprovalDoc[]>('/approvals'),

    findOne: (id: string) => apiClient.get<any, ApprovalDoc>(`/approvals/${id}`),

    process: (id: string, action: 'APPROVE' | 'REJECT', comment?: string) =>
        apiClient.put(`/approvals/${id}/process`, { action, comment }),
};
