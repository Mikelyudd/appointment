"use client";

import { useState, useEffect } from "react";
import { addDays, format, startOfWeek, eachDayOfInterval } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAllAppointments, updateAppointmentStatus } from "@/app/actions/booking";
import { Loader2 } from "lucide-react";

// 预约状态类型
type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

// 预约类型
interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  service?: { name: string };
  date: string;
  startTime: string;
  status: AppointmentStatus;
}

// 状态标签样式映射
const statusStyles: Record<AppointmentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "待确认", variant: "secondary" },
  CONFIRMED: { label: "已确认", variant: "default" },
  CANCELLED: { label: "已取消", variant: "destructive" },
};

// 生成时间段
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    const response = await getAllAppointments();
    if (response.success) {
      setAppointments(response.data as any);
    }
    setLoading(false);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      const response = await updateAppointmentStatus(appointmentId, newStatus as any);
      if (response.success) {
        await loadAppointments();
      }
    } catch (error) {
      console.error("更新预约状态失败:", error);
    }
  };

  // 获取当前周的日期范围
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  const handlePrevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">预约管理</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handlePrevWeek}>
            上一周
          </Button>
          <span className="text-lg font-medium">
            {format(weekDates[0], "M月d日", { locale: zhCN })} - {format(weekDates[6], "M月d日", { locale: zhCN })}
          </span>
          <Button variant="outline" onClick={handleNextWeek}>
            下一周
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        {/* 日期表头 */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 border-r font-medium">时间</div>
          {weekDates.map((date) => (
            <div
              key={date.toISOString()}
              className="p-4 text-center border-r last:border-r-0 font-medium"
            >
              <div>{format(date, "EEE", { locale: zhCN })}</div>
              <div>{format(date, "d", { locale: zhCN })}</div>
            </div>
          ))}
        </div>

        {/* 时间格子 */}
        <div className="divide-y">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8">
              <div className="p-2 border-r text-sm text-gray-500">{time}</div>
              {weekDates.map((date) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const appts = appointments.filter(
                  (a) => {
                    const aDate = format(new Date(a.date), "yyyy-MM-dd");
                    return aDate === dateStr && a.startTime.startsWith(time.split(":")[0]);
                  }
                );

                return (
                  <div
                    key={`${dateStr}-${time}`}
                    className={cn(
                      "p-2 border-r last:border-r-0 min-h-[4rem]",
                      "hover:bg-gray-50 transition-colors"
                    )}
                  >
                    {appts.map((appt) => (
                      <div
                        key={appt.id}
                        className="mb-1 p-1 text-sm bg-blue-50 rounded border border-blue-200"
                      >
                        <div className="font-medium">{appt.customerName}</div>
                        <div className="text-gray-500">{appt.service?.name}</div>
                        <Badge variant={statusStyles[appt.status]?.variant || "default"}>
                          {statusStyles[appt.status]?.label || appt.status}
                        </Badge>
                        <div className="mt-1 space-x-1">
                          {appt.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs"
                                onClick={() => handleStatusChange(appt.id, "CONFIRMED")}
                              >
                                确认
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs"
                                onClick={() => handleStatusChange(appt.id, "CANCELLED")}
                              >
                                取消
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
