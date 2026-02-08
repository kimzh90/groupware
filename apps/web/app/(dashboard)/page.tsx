'use client';

import { useAuthStore } from '../../store/useAuthStore';
import { FileText, Users, Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D]">Welcome back, {user?.name} 👋</h1>
          <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your projects today.</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-md text-blue-600">
              <FileText size={24} />
            </div>
            <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">Action Required</span>
          </div>
          <h2 className="text-sm font-medium text-gray-500">Pending Approvals</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#172B4D]">5</span>
            <span className="text-sm text-gray-400">docs waiting</span>
          </div>
          <Link href="/dashboard/approvals" className="mt-4 text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-md text-purple-600">
              <Bell size={24} />
            </div>
          </div>
          <h2 className="text-sm font-medium text-gray-500">New Announcements</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#172B4D]">12</span>
            <span className="text-sm text-gray-400">updates</span>
          </div>
          <button className="mt-4 text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
            Read updates <ArrowRight size={14} />
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-md text-green-600">
              <Users size={24} />
            </div>
          </div>
          <h2 className="text-sm font-medium text-gray-500">Team Members</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#172B4D]">8</span>
            <span className="text-sm text-gray-400">active now</span>
          </div>
          <Link href="/dashboard/admin" className="mt-4 text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
            Manage team <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#172B4D] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  JD
                </div>
                <div>
                  <p className="text-sm text-[#172B4D]"><span className="font-semibold">John Doe</span> created a new document.</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#172B4D] mb-4">Quick Links</h3>
          <div className="space-y-2">
            <Link href="/dashboard/approvals/new" className="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors flex justify-between items-center group">
              <span className="text-sm font-medium text-[#172B4D]">Create New Approval Request</span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600" />
            </Link>
            <Link href="/dashboard/profile" className="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors flex justify-between items-center group">
              <span className="text-sm font-medium text-[#172B4D]">Update Profile Settings</span>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
