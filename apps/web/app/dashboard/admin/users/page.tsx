'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, User as UserType } from '../../../../lib/api/users';
import UserEditModal from '../../../../components/UserEditModal';
import {
    Users,
    Search,
    MoreHorizontal,
    Shield,
    User,
    Mail,
    Building2,
    Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: usersApi.findAll,
    });

    const filteredUsers = users?.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.employeeId.includes(searchTerm)
    );

    const handleEdit = (user: UserType) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 uppercase tracking-wide">최고관리자</span>;
            case 'ADMIN': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 uppercase tracking-wide">관리자</span>;
            default: return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 uppercase tracking-wide">사용자</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-[#172B4D]">사용자 관리</h1>
                    <p className="text-gray-500 mt-1">사용자 접속 권한 및 조직 정보를 관리합니다.</p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="이름, 이메일, 사번 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-[3px] focus:ring-2 focus:ring-[#4C9AFF] focus:border-[#4C9AFF] outline-none transition-all text-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#FAFBFC]">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">사용자</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">부서 및 직급</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">권한</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">작업</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                                    </td>
                                </tr>
                            ))
                        ) : filteredUsers?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <p>검색 결과가 없습니다.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers?.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-[#172B4D]">{u.name}</div>
                                                <div className="text-xs text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-[#172B4D] flex items-center gap-1.5">
                                            <Building2 size={14} className="text-gray-400" />
                                            {u.department?.name || <span className="text-gray-400 italic">미배정</span>}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5 ml-0.5">
                                            <Briefcase size={12} className="text-gray-400" />
                                            {u.position}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getRoleBadge(u.role)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            활성
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(u)}
                                            className="text-gray-400 hover:text-[#0052CC] p-1 rounded hover:bg-gray-100 transition-colors"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <UserEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                onUpdate={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
            />
        </div>
    );
}
