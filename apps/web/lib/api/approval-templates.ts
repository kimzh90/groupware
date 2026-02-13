import apiClient from '../api-client';

export interface ApprovalTemplate {
    id: string;
    name: string;
    description?: string;
    content: string;
    isActive: boolean;
    creator: {
        id: string;
        name: string;
        position: string;
    };
    createdAt: string;
    updatedAt: string;
}

export const approvalTemplatesApi = {
    /** 양식 목록 조회 */
    findAll: async (includeInactive = false): Promise<ApprovalTemplate[]> => {
        const res: any = await apiClient.get('/approval-templates', {
            params: includeInactive ? { all: 'true' } : {},
        });
        return res.data;
    },

    /** 양식 상세 조회 */
    findOne: async (id: string): Promise<ApprovalTemplate> => {
        const res: any = await apiClient.get(`/approval-templates/${id}`);
        return res.data;
    },

    /** 양식 생성 */
    create: async (data: { name: string; description?: string; content: string }): Promise<ApprovalTemplate> => {
        const res: any = await apiClient.post('/approval-templates', data);
        return res.data;
    },

    /** 양식 수정 */
    update: async (id: string, data: { name?: string; description?: string; content?: string; isActive?: boolean }): Promise<ApprovalTemplate> => {
        const res: any = await apiClient.put(`/approval-templates/${id}`, data);
        return res.data;
    },

    /** 양식 삭제 */
    remove: async (id: string): Promise<void> => {
        await apiClient.delete(`/approval-templates/${id}`);
    },
};
