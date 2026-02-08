'use client';

import React, { useEffect, useState } from 'react';
import { User, X, Shield, Briefcase, UserCircle, Save } from 'lucide-react';
import { usersApi, User as UserType } from '../lib/api/users';
import apiClient from '../lib/api-client';

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType | null;
    onUpdate: () => void;
}

export default function UserEditModal({ isOpen, onClose, user, onUpdate }: UserEditModalProps) {
    const [role, setRole] = useState<string>('');
    const [departmentId, setDepartmentId] = useState<string>('');
    const [managerId, setManagerId] = useState<string>('');
    const [departments, setDepartments] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Fetch departments and users for selection
            apiClient.get('/departments').then((res: any) => setDepartments(res.data));
            apiClient.get('/users').then((res: any) => setAllUsers(res.data));

            if (user) {
                setRole(user.role);
                setDepartmentId(user.department?.id || '');
                setManagerId(user.manager?.id || '');
            }
        }
    }, [isOpen, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            await usersApi.update(user.id, {
                role: role as any,
                departmentId: departmentId || null,
                managerId: managerId || null,
            } as any);
            onUpdate();
            onClose();
        } catch (error: any) {
            alert(error.message || '수정 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <UserCircle size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">사용자 정보 수정</h2>
                            <p className="text-xs text-gray-500 font-medium">{user.name} ({user.employeeId})</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2 tracking-tight">
                            <Shield size={16} className="text-blue-500" />
                            권한 설정
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-gray-700"
                        >
                            <option value="USER">일반 사용자</option>
                            <option value="ADMIN">관리자</option>
                            <option value="SUPER_ADMIN">최고 관리자</option>
                        </select>
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2 tracking-tight">
                            <Briefcase size={16} className="text-blue-500" />
                            소속 부서
                        </label>
                        <select
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-gray-700"
                        >
                            <option value="">부서 미지정</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Manager */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2 tracking-tight">
                            <User size={16} className="text-blue-500" />
                            직속 상권자 (결재자)
                        </label>
                        <select
                            value={managerId}
                            onChange={(e) => setManagerId(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-gray-700"
                        >
                            <option value="">상권자 미지정</option>
                            {allUsers.filter(u => u.id !== user.id).map((u) => (
                                <option key={u.id} value={u.id}>{u.name} ({u.position})</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 text-gray-600 hover:bg-gray-100 rounded-2xl font-bold transition-all"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? '저장 중...' : (
                                <>
                                    <Save size={20} />
                                    정보 저장하기
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
