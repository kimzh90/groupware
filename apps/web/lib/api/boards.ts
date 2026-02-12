import apiClient from '../api-client';

export const boardsApi = {
    findAll: async () => {
        const res: any = await apiClient.get('/boards');
        return res.data;
    },

    findOne: async (id: string) => {
        const res: any = await apiClient.get(`/boards/${id}`);
        return res.data;
    },
};

export const postsApi = {
    findByBoard: async (boardId: string, page = 1) => {
        const res: any = await apiClient.get(`/posts/board/${boardId}?page=${page}`);
        return res.data;
    },

    findOne: async (id: string) => {
        const res: any = await apiClient.get(`/posts/${id}`);
        return res.data;
    },

    create: async (data: { title: string; content: string; boardId: string }) => {
        const res: any = await apiClient.post('/posts', data);
        return res.data;
    },

    update: async (id: string, data: { title?: string; content?: string }) => {
        const res: any = await apiClient.put(`/posts/${id}`, data);
        return res.data;
    },

    delete: async (id: string) => {
        const res: any = await apiClient.delete(`/posts/${id}`);
        return res.data;
    },
};
