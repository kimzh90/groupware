'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useAuthStore } from '@/store/useAuthStore';
import { Users, FileText, Clock, TrendingUp, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats(),
    enabled: useAuthStore((state) => state._hasHydrated && !!state.accessToken),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D]">모니터링</h1>
          <p className="text-gray-500 mt-1">시스템 현황을 한눈에 확인하세요.</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-80 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: '전체 사용자',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: '전체 결재 문서',
      value: stats?.totalApprovals || 0,
      icon: FileText,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: '결재 대기',
      value: stats?.pendingApprovals || 0,
      icon: Clock,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: '오늘 로그인',
      value: stats?.todayLogins || 0,
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#172B4D]">모니터링</h1>
        <p className="text-gray-500 mt-1">시스템 현황을 한눈에 확인하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white p-6 rounded border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded ${card.bgColor}`}>
                  <Icon className={card.textColor} size={24} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-[#172B4D]">{card.value.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 주간 로그인 차트 */}
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-[#172B4D] mb-4">주간 로그인 현황</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.weeklyLoginData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                cursor={{ fill: '#F3F4F6' }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="block p-6 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#172B4D] group-hover:text-blue-600 mb-1">
                사용자 관리
              </h3>
              <p className="text-sm text-gray-500">계정 관리 및 권한 설정</p>
            </div>
            <Users className="text-gray-400 group-hover:text-blue-600 transition-colors" size={32} />
          </div>
        </Link>

        <Link
          href="/dashboard/admin/templates"
          className="block p-6 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md hover:border-violet-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#172B4D] group-hover:text-violet-600 mb-1">
                결재 양식 관리
              </h3>
              <p className="text-sm text-gray-500">결재 문서 양식 생성 및 편집</p>
            </div>
            <LayoutTemplate className="text-gray-400 group-hover:text-violet-600 transition-colors" size={32} />
          </div>
        </Link>

        <Link
          href="/dashboard/admin/logs"
          className="block p-6 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#172B4D] group-hover:text-blue-600 mb-1">
                감사 로그
              </h3>
              <p className="text-sm text-gray-500">로그인 기록 및 보안 로그</p>
            </div>
            <FileText className="text-gray-400 group-hover:text-blue-600 transition-colors" size={32} />
          </div>
        </Link>
      </div>
    </div>
  );
}
