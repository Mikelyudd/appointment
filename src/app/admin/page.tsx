'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Calendar,
} from "lucide-react";

// 假数据生成函数
const generateDailyData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    appointments: Math.floor(Math.random() * 20) + 5,
    revenue: Math.floor(Math.random() * 2000) + 500,
  }));
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("week");
  const [stats] = useState({
    today: {
      appointments: 12,
      revenue: 1280,
      newCustomers: 3,
      completionRate: 95,
    },
    week: {
      appointments: 85,
      revenue: 8960,
      newCustomers: 21,
      completionRate: 92,
    },
    month: {
      appointments: 320,
      revenue: 35200,
      newCustomers: 84,
      completionRate: 94,
    },
  });

  const [dailyData] = useState(generateDailyData());
  const [topServices] = useState([
    { name: "剪发", count: 45, revenue: 3960 },
    { name: "染发", count: 28, revenue: 8400 },
    { name: "造型", count: 32, revenue: 4800 },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">数据概览</h1>
        <div className="space-x-2">
          <Button
            variant={timeRange === "today" ? "default" : "outline"}
            onClick={() => setTimeRange("today")}
          >
            今日
          </Button>
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            onClick={() => setTimeRange("week")}
          >
            本周
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            onClick={() => setTimeRange("month")}
          >
            本月
          </Button>
        </div>
      </div>

      {/* 主要统计数据 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预约数</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[timeRange].appointments}</div>
            <p className="text-xs text-muted-foreground">
              较上期 +2.1%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">营业额</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{stats[timeRange].revenue}</div>
            <p className="text-xs text-muted-foreground">
              较上期 +4.3%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">新客户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[timeRange].newCustomers}</div>
            <p className="text-xs text-muted-foreground">
              较上期 +12.5%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完成率</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[timeRange].completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              较上期 +0.8%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
        {/* 每日数据趋势 */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>数据趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 pb-2 border-b">
                <div className="text-sm font-medium">日期</div>
                <div className="text-sm font-medium">预约数</div>
                <div className="text-sm font-medium">营业额</div>
              </div>
              {dailyData.map((day) => (
                <div key={day.date} className="grid grid-cols-3 gap-4">
                  <div className="text-sm">{day.date}</div>
                  <div className="text-sm">{day.appointments}</div>
                  <div className="text-sm">¥{day.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 热门服务 */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>热门服务</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 pb-2 border-b">
                <div className="text-sm font-medium">服务项目</div>
                <div className="text-sm font-medium">预约次数</div>
                <div className="text-sm font-medium">营业额</div>
              </div>
              {topServices.map((service) => (
                <div key={service.name} className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium">{service.name}</div>
                  <div className="text-sm">{service.count}</div>
                  <div className="text-sm">¥{service.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 今日预约 */}
      <Card>
        <CardHeader>
          <CardTitle>今日预约</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4 pb-2 border-b">
              <div className="text-sm font-medium">时间</div>
              <div className="text-sm font-medium">客户</div>
              <div className="text-sm font-medium">服务项目</div>
              <div className="text-sm font-medium">服务人员</div>
              <div className="text-sm font-medium">状态</div>
              <div className="text-sm font-medium">金额</div>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <div className="text-sm">14:00</div>
              <div className="text-sm">张三</div>
              <div className="text-sm">剪发</div>
              <div className="text-sm">李四</div>
              <div className="text-sm">已确认</div>
              <div className="text-sm">¥88</div>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <div className="text-sm">15:30</div>
              <div className="text-sm">王五</div>
              <div className="text-sm">染发</div>
              <div className="text-sm">赵六</div>
              <div className="text-sm">待确认</div>
              <div className="text-sm">¥299</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 