'use client';

import { useAuthStore } from '../../store/useAuthStore';
import { FileText, Clock, MessageSquare, Network, ArrowRight, CheckCircle2, Users, Shield, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/api-client';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data: todayAttendance } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async () => {
      const res: any = await apiClient.get('/attendance/today');
      return res.data;
    },
    enabled: useAuthStore.getState()._hasHydrated && !!useAuthStore.getState().accessToken,
  });

  const now = new Date();
  const greeting = now.getHours() < 12 ? '좋은 아침이에요' : now.getHours() < 18 ? '좋은 오후에요' : '수고하셨습니다';

  const features = [
    {
      title: '전자결재',
      description: '결재 요청, 승인, 반려 등 전자결재 문서를 관리합니다.',
      icon: FileText,
      href: '/dashboard/approvals',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: '게시판',
      description: '공지사항, 자유게시판 등 사내 소통 공간입니다.',
      icon: MessageSquare,
      href: '/dashboard/boards',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: '조직도',
      description: '부서 구조와 구성원 정보를 확인합니다.',
      icon: Network,
      href: '/dashboard/organization',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: '근태관리',
      description: '출퇴근 기록 및 근무 현황을 관리합니다.',
      icon: Clock,
      href: '/dashboard/attendance',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 환영 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <h1 className="text-3xl font-bold">{greeting}, {user?.name}님 👋</h1>
          <p className="text-blue-100 mt-2 text-lg">
            {now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
              <Clock size={18} />
              <div>
                <p className="text-xs text-blue-200">오늘 근태</p>
                <p className="font-semibold">
                  {todayAttendance?.clockIn
                    ? `출근 ${new Date(todayAttendance.clockIn).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`
                    : '미출근'}
                </p>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
              <Users size={18} />
              <div>
                <p className="text-xs text-blue-200">소속</p>
                <p className="font-semibold">{user?.role === 'SUPER_ADMIN' ? '최고관리자' : user?.role === 'ADMIN' ? '관리자' : '사용자'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">빠른 실행</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/attendance"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-200 active:scale-[0.98]"
          >
            <Clock size={16} />
            {todayAttendance?.clockIn ? (todayAttendance?.clockOut ? '근태 확인' : '퇴근하기') : '출근하기'}
          </Link>
          <Link
            href="/dashboard/approvals/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
          >
            <FileText size={16} />
            새 결재 작성
          </Link>
          <Link
            href="/dashboard/boards"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
          >
            <MessageSquare size={16} />
            게시판 보기
          </Link>
        </div>
      </div>

      {/* 기능 카드 */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">그룹웨어 서비스</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex gap-5"
              >
                <div className={`p-3 ${feature.bgColor} rounded-xl h-fit group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className={feature.textColor} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors flex items-center justify-between">
                    {feature.title}
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 관리자 빠른 접근 */}
      {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={18} className="text-blue-600" />
            관리자 메뉴
          </h2>
          <Link
            href="/dashboard/admin"
            className="group bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex items-center gap-5"
          >
            <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">관리자 설정</h3>
              <p className="text-sm text-gray-500 mt-1">시스템 모니터링, 사용자 관리, 감사 로그</p>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      )}
    </div>
  );
}
