"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  Settings,
  LogOut,
  Scissors,
  UserCheck,
  ShieldCheck,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "仪表盘",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "预约管理",
    href: "/admin/appointments",
    icon: Calendar,
  },
  {
    title: "时段管理",
    href: "/admin/timeslots",
    icon: Clock,
  },
  {
    title: "服务管理",
    href: "/admin/services",
    icon: Scissors,
  },
  {
    title: "员工管理",
    href: "/admin/members",
    icon: Users,
  },
  {
    title: "客户管理",
    href: "/admin/customers",
    icon: UserCheck,
  },
  {
    title: "验证管理",
    href: "/admin/verifications",
    icon: ShieldCheck,
  },
  {
    title: "店铺设置",
    href: "/admin/settings",
    icon: Store,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <div className="w-64 bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold">byChronos</h1>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors",
                  isActive && "bg-gray-100 text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 w-64 px-4">
          <button
            onClick={() => {
              // 处理登出逻辑
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto bg-gray-50">{children}</div>
    </div>
  );
} 