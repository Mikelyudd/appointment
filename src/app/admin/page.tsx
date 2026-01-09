'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarDays, 
  Users, 
  DollarSign, 
  Star,
  Loader2
} from "lucide-react";
import { getAdminStats, getAllAppointments } from "@/app/actions/booking";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (shopId) {
      loadDashboardData();
    }
  }, [shopId]);

  async function loadDashboardData() {
    setLoading(true);
    const [statsRes, apptsRes] = await Promise.all([
      getAdminStats(shopId!),
      getAllAppointments(shopId!)
    ]);

    if (statsRes.success) setStats(statsRes.data);
    if (apptsRes.success) setRecentAppointments(apptsRes.data.slice(0, 5));
    setLoading(false);
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-yellow-600" /></div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Appointments</CardTitle>
            <CalendarDays className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalAppointments || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${Number(stats?.totalRevenue || 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Services</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalServices || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.completionRate || 0}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 pb-2 border-b text-sm font-semibold text-gray-500">
              <div>Customer</div>
              <div>Service</div>
              <div>Date & Time</div>
              <div>Status</div>
              <div className="text-right">Amount</div>
            </div>
            {recentAppointments.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No appointments yet.</div>
            ) : recentAppointments.map((appt) => (
              <div key={appt.id} className="grid grid-cols-5 gap-4 items-center text-sm">
                <div className="font-medium">{appt.customerName}</div>
                <div>{appt.optionName || appt.service.name}</div>
                <div className="text-gray-500">
                    {moment(appt.date).format('MMM D')} @ {moment(appt.startTime, 'HH:mm').format('h:mm A')}
                </div>
                <div>
                  <Badge variant={appt.status === 'CONFIRMED' ? 'default' : 'secondary'} className={appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                    {appt.status}
                  </Badge>
                </div>
                <div className="text-right font-bold text-yellow-700">${Number(appt.price || appt.service.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
