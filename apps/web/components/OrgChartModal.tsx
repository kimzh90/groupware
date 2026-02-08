'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '../lib/api-client';
import { X, ChevronRight, ChevronDown, User, Check } from 'lucide-react';

interface DeptNode {
    id: string;
    name: string;
    users: Array<{
        id: string;
        name: string;
        position: string;
    }>;
    children: DeptNode[];
}

interface OrgChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (approvers: Array<{ id: string; name: string; position: string }>) => void;
    initialSelected?: Array<{ id: string; name: string; position: string }>;
}

export default function OrgChartModal({ isOpen, onClose, onSelect, initialSelected = [] }: OrgChartModalProps) {
    const [tree, setTree] = useState<DeptNode[]>([]);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [selectedApprovers, setSelectedApprovers] = useState<Array<{ id: string; name: string; position: string }>>(initialSelected);

    useEffect(() => {
        if (isOpen) {
            apiClient.get('/departments/tree').then((res: any) => {
                setTree(res.data);
            });
        }
    }, [isOpen]);

    const toggleExpand = (id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleUser = (user: { id: string; name: string; position: string }) => {
        setSelectedApprovers((prev) => {
            const isSelected = prev.some((u) => u.id === user.id);
            if (isSelected) {
                return prev.filter((u) => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };

    if (!isOpen) return null;

    const renderTree = (nodes: DeptNode[]) => {
        return (
            <ul className="ml-4 space-y-2">
                {nodes.map((node) => (
                    <li key={node.id}>
                        <div className="flex items-center gap-2 p-1 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                            onClick={() => toggleExpand(node.id)}>
                            {node.children.length > 0 ? (
                                expanded[node.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                            ) : <div className="w-4" />}
                            <span className="font-medium text-gray-700">{node.name}</span>
                        </div>

                        {expanded[node.id] && (
                            <>
                                {node.users.length > 0 && (
                                    <ul className="ml-8 mt-1 space-y-1">
                                        {node.users.map((user) => {
                                            const isSelected = selectedApprovers.some(u => u.id === user.id);
                                            return (
                                                <li key={user.id}
                                                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${isSelected ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                                                        }`}
                                                    onClick={() => toggleUser(user)}>
                                                    <div className="flex items-center gap-2">
                                                        <User size={14} />
                                                        <span>{user.name} {user.position}</span>
                                                    </div>
                                                    {isSelected && <Check size={14} />}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                                {renderTree(node.children)}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col h-[600px] overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">결재선 지정</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* 조직도 */}
                    <div className="w-1/2 p-4 overflow-y-auto border-r custom-scrollbar">
                        <div className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">조직도</div>
                        {renderTree(tree)}
                    </div>

                    {/* 선택된 목록 */}
                    <div className="w-1/2 p-4 overflow-y-auto bg-gray-50/30">
                        <div className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            선택된 결재자 ({selectedApprovers.length})
                        </div>
                        <div className="space-y-2">
                            {selectedApprovers.map((u, index) => (
                                <div key={u.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{u.name}</div>
                                            <div className="text-xs text-gray-500">{u.position}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleUser(u)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            {selectedApprovers.length === 0 && (
                                <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                                    <User size={40} className="mb-2 opacity-20" />
                                    <p>결재자를 선택해주세요.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-all">
                        취소
                    </button>
                    <button
                        onClick={() => {
                            onSelect(selectedApprovers);
                            onClose();
                        }}
                        disabled={selectedApprovers.length === 0}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                        적용
                    </button>
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
        </div>
    );
}
