"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, Calendar, Scissors, Store, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "数据概览", href: "/admin", icon: LayoutDashboard },
  { title: "预约管理", href: "/admin/appointments", icon: Calendar },
  { title: "服务管理", href: "/admin/services", icon: Scissors },
  { title: "店铺设置", href: "/admin/settings", icon: Store },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">GoldEngine Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const hrefWithShop = shopId ? `${item.href}?shopId=${shopId}` : item.href;
            return (
              <Link key={item.href} href={hrefWithShop} className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors", isActive && "bg-yellow-50 text-yellow-700 font-medium")}>
                <item.icon className={cn("w-5 h-5", isActive ? "text-yellow-600" : "text-gray-400")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            <span>退出登录</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-50/50">{children}</div>
    </div>
  );
}
