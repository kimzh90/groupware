'use client';

import React, { useEffect, useState } from 'react';
import { useToastStore, Toast as ToastType } from '../../store/useToastStore';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const iconMap = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const colorMap = {
    success: {
        bg: 'bg-emerald-50 border-emerald-200',
        icon: 'text-emerald-500',
        title: 'text-emerald-900',
        message: 'text-emerald-700',
        progress: 'bg-emerald-400',
    },
    error: {
        bg: 'bg-red-50 border-red-200',
        icon: 'text-red-500',
        title: 'text-red-900',
        message: 'text-red-700',
        progress: 'bg-red-400',
    },
    warning: {
        bg: 'bg-amber-50 border-amber-200',
        icon: 'text-amber-500',
        title: 'text-amber-900',
        message: 'text-amber-700',
        progress: 'bg-amber-400',
    },
    info: {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-500',
        title: 'text-blue-900',
        message: 'text-blue-700',
        progress: 'bg-blue-400',
    },
};

function ToastItem({ toast }: { toast: ToastType }) {
    const removeToast = useToastStore((s) => s.removeToast);
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    const duration = toast.duration ?? 4000;
    const Icon = iconMap[toast.type];
    const colors = colorMap[toast.type];

    useEffect(() => {
        if (duration <= 0) return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 50);

        // 자동 사라짐 전 exit 애니메이션
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, duration - 300);

        return () => {
            clearInterval(interval);
            clearTimeout(exitTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => removeToast(toast.id), 300);
    };

    return (
        <div
            className={`relative overflow-hidden w-[380px] border rounded-2xl shadow-2xl shadow-black/10 backdrop-blur-sm transition-all duration-300 ${colors.bg} ${isExiting
                    ? 'opacity-0 translate-x-12 scale-95'
                    : 'opacity-100 translate-x-0 scale-100'
                }`}
            style={{ animation: isExiting ? undefined : 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
            <div className="flex items-start gap-3 p-4">
                <div className={`shrink-0 mt-0.5 ${colors.icon}`}>
                    <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${colors.title}`}>{toast.title}</p>
                    {toast.message && (
                        <p className={`text-xs mt-0.5 leading-relaxed ${colors.message}`}>{toast.message}</p>
                    )}
                </div>
                <button
                    onClick={handleClose}
                    className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
                >
                    <X size={14} className="text-gray-400" />
                </button>
            </div>

            {/* 프로그레스 바 */}
            {duration > 0 && (
                <div className="h-0.5 w-full bg-black/5">
                    <div
                        className={`h-full ${colors.progress} transition-[width] duration-100 ease-linear`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}

export default function ToastContainer() {
    const toasts = useToastStore((s) => s.toasts);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-auto">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}
