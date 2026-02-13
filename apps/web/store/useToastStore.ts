import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number; // ms, default 4000
}

export interface ConfirmDialog {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
    onConfirm: () => void;
    onCancel?: () => void;
}

interface ToastStore {
    toasts: Toast[];
    confirmDialog: ConfirmDialog | null;

    // 토스트 추가/제거
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;

    // 확인 다이얼로그
    showConfirm: (dialog: ConfirmDialog) => void;
    closeConfirm: () => void;

    // 편의 메서드
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

let toastCounter = 0;

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    confirmDialog: null,

    addToast: (toast) => {
        const id = `toast-${++toastCounter}-${Date.now()}`;
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));

        // 자동 제거
        const duration = toast.duration ?? 4000;
        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id),
                }));
            }, duration);
        }
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },

    showConfirm: (dialog) => {
        set({ confirmDialog: dialog });
    },

    closeConfirm: () => {
        set({ confirmDialog: null });
    },

    success: (title, message) => {
        const store = useToastStore.getState();
        store.addToast({ type: 'success', title, message });
    },

    error: (title, message) => {
        const store = useToastStore.getState();
        store.addToast({ type: 'error', title, message, duration: 6000 });
    },

    warning: (title, message) => {
        const store = useToastStore.getState();
        store.addToast({ type: 'warning', title, message });
    },

    info: (title, message) => {
        const store = useToastStore.getState();
        store.addToast({ type: 'info', title, message });
    },
}));
