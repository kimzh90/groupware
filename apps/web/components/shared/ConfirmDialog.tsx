'use client';

import React, { useEffect, useState } from 'react';
import { useToastStore } from '../../store/useToastStore';
import { AlertTriangle, Info } from 'lucide-react';

export default function ConfirmDialog() {
    const { confirmDialog, closeConfirm } = useToastStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (confirmDialog) {
            // 약간의 딜레이 후 애니메이션 시작
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsVisible(false);
        }
    }, [confirmDialog]);

    if (!confirmDialog) return null;

    const handleConfirm = () => {
        setIsVisible(false);
        setTimeout(() => {
            confirmDialog.onConfirm();
            closeConfirm();
        }, 200);
    };

    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(() => {
            confirmDialog.onCancel?.();
            closeConfirm();
        }, 200);
    };

    const isDanger = confirmDialog.variant === 'danger';

    return (
        <div
            className={`fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-200 ${isVisible ? 'bg-black/40 backdrop-blur-sm' : 'bg-black/0'
                }`}
            onClick={handleCancel}
        >
            <div
                className={`bg-white rounded-3xl shadow-2xl shadow-black/20 w-[420px] max-w-[90vw] overflow-hidden transition-all duration-300 ${isVisible
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 아이콘 헤더 */}
                <div className="px-8 pt-8 pb-2 flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isDanger ? 'bg-red-50' : 'bg-blue-50'
                        }`}>
                        {isDanger ? (
                            <AlertTriangle size={28} className="text-red-500" />
                        ) : (
                            <Info size={28} className="text-blue-500" />
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{confirmDialog.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{confirmDialog.message}</p>
                </div>

                {/* 버튼 영역 */}
                <div className="px-8 pb-8 pt-6 flex gap-3">
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-[0.98] transition-all"
                    >
                        {confirmDialog.cancelLabel || '취소'}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all ${isDanger
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                            }`}
                    >
                        {confirmDialog.confirmLabel || '확인'}
                    </button>
                </div>
            </div>
        </div>
    );
}
