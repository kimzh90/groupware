'use client';

import { useQuery } from '@tanstack/react-query';
import { departmentsApi } from '../../../lib/api/departments';
import { useAuthStore } from '../../../store/useAuthStore';
import { Building2, User, ChevronDown, ChevronRight, Users } from 'lucide-react';
import { useState } from 'react';

interface DeptNode {
    id: string;
    name: string;
    code: string;
    users: { id: string; name: string; position: string; role: string }[];
    children: DeptNode[];
}

function DepartmentCard({ dept, level = 0 }: { dept: DeptNode; level?: number }) {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = dept.children && dept.children.length > 0;

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full font-semibold">최고관리자</span>;
            case 'ADMIN':
                return <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full font-semibold">관리자</span>;
            default:
                return null;
        }
    };

    return (
        <div className={`${level > 0 ? 'ml-8' : ''}`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 mb-3 overflow-hidden">
                {/* Department Header */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-gray-50/50 transition-colors text-left"
                >
                    <div className={`p-2.5 rounded-xl ${level === 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>
                        <Building2 size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{dept.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Users size={12} />
                            {dept.users?.length || 0}명
                        </p>
                    </div>
                    {hasChildren && (
                        <div className="text-gray-400">
                            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                    )}
                </button>

                {/* Members */}
                {expanded && dept.users && dept.users.length > 0 && (
                    <div className="border-t border-gray-50 px-4 py-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {dept.users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                                            {getRoleBadge(user.role)}
                                        </div>
                                        <p className="text-xs text-gray-400">{user.position}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Children Departments */}
            {expanded && hasChildren && (
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-3 w-px bg-gray-200"></div>
                    {dept.children.map((child) => (
                        <DepartmentCard key={child.id} dept={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function OrganizationPage() {
    const { data: tree, isLoading } = useQuery({
        queryKey: ['departments', 'tree'],
        queryFn: departmentsApi.getTree,
        enabled: useAuthStore.getState()._hasHydrated && !!useAuthStore.getState().accessToken,
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">조직도</h1>
                <p className="text-gray-500 mt-1">부서 구조와 구성원을 한눈에 확인합니다.</p>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                                <div>
                                    <div className="h-5 bg-gray-100 rounded w-32 mb-1.5"></div>
                                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : tree?.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <Building2 size={48} className="mx-auto mb-3 opacity-30" />
                    <p>등록된 부서가 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tree?.map((dept: DeptNode) => (
                        <DepartmentCard key={dept.id} dept={dept} />
                    ))}
                </div>
            )}
        </div>
    );
}
