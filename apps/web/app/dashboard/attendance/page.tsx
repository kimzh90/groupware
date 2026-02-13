'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../../../lib/api/attendance';
import { useAuthStore } from '../../../store/useAuthStore';
import { Clock, LogIn, LogOut, CalendarDays, CheckCircle2, AlertTriangle, XCircle, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToastStore } from '../../../store/useToastStore';

export default function AttendancePage() {
    const queryClient = useQueryClient();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { data: todayStatus, isLoading: isLoadingToday } = useQuery({
        queryKey: ['attendance', 'today'],
        queryFn: attendanceApi.getTodayStatus,
        enabled: useAuthStore.getState()._hasHydrated && !!useAuthStore.getState().accessToken,
    });

    const { data: records, isLoading: isLoadingRecords } = useQuery({
        queryKey: ['attendance', 'my'],
        queryFn: () => attendanceApi.getMyRecords(1),
        enabled: useAuthStore.getState()._hasHydrated && !!useAuthStore.getState().accessToken,
    });

    const clockInMutation = useMutation({
        mutationFn: attendanceApi.clockIn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        },
        onError: (err: any) => {
            useToastStore.getState().error('출근 실패', err?.message || '출근 처리에 실패했습니다.');
        },
    });

    const clockOutMutation = useMutation({
        mutationFn: attendanceApi.clockOut,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        },
        onError: (err: any) => {
            useToastStore.getState().error('퇴근 실패', err?.message || '퇴근 처리에 실패했습니다.');
        },
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'NORMAL':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle2 size={12} />정상</span>;
            case 'LATE':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><AlertTriangle size={12} />지각</span>;
            case 'EARLY_LEAVE':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700"><AlertTriangle size={12} />조퇴</span>;
            case 'ABSENT':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle size={12} />결근</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700"><Minus size={12} />{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">근태관리</h1>
                <p className="text-gray-500 mt-1">출퇴근 기록을 관리합니다.</p>
            </div>

            {/* 현재 시간 & 출퇴근 버튼 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 tracking-tight font-mono">
                        {currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <p className="text-gray-500 mt-2">
                        {currentTime.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                    </p>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => clockInMutation.mutate()}
                        disabled={!!todayStatus?.clockIn || clockInMutation.isPending}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200 hover:shadow-lg active:scale-[0.98]"
                    >
                        <LogIn size={18} />
                        {clockInMutation.isPending ? '처리 중...' : '출근'}
                    </button>
                    <button
                        onClick={() => clockOutMutation.mutate()}
                        disabled={!todayStatus?.clockIn || !!todayStatus?.clockOut || clockOutMutation.isPending}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-orange-200 hover:shadow-lg active:scale-[0.98]"
                    >
                        <LogOut size={18} />
                        {clockOutMutation.isPending ? '처리 중...' : '퇴근'}
                    </button>
                </div>

                {/* 오늘 상태 */}
                {todayStatus && (
                    <div className="mt-6 flex justify-center gap-8 text-sm">
                        <div className="text-center">
                            <p className="text-gray-400 mb-1">출근 시간</p>
                            <p className="font-semibold text-gray-800">
                                {todayStatus.clockIn ? new Date(todayStatus.clockIn).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 mb-1">퇴근 시간</p>
                            <p className="font-semibold text-gray-800">
                                {todayStatus.clockOut ? new Date(todayStatus.clockOut).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 mb-1">상태</p>
                            {getStatusBadge(todayStatus.status)}
                        </div>
                    </div>
                )}
            </div>

            {/* 근태 기록 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CalendarDays size={20} />
                        근태 기록
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">날짜</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">출근</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">퇴근</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoadingRecords ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        {Array(4).fill(0).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-gray-100 rounded animate-pulse w-20"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : records?.records?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        근태 기록이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                records?.records?.map((record: any) => (
                                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            {new Date(record.date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {record.clockIn ? new Date(record.clockIn).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {record.clockOut ? new Date(record.clockOut).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(record.status)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
