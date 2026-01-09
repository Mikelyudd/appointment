"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, Calendar, DollarSign, Users, TrendingUp, Activity } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalAppointments: number;
  totalSpent: number;
  lastVisit: string;
  tags: string[];
  status: "active" | "inactive";
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers] = useState<Customer[]>([
    {
      id: "1",
      name: "张三",
      phone: "13800138000",
      email: "zhangsan@example.com",
      totalAppointments: 8,
      totalSpent: 1280,
      lastVisit: "2024-01-05",
      tags: ["VIP", "染发"],
      status: "active",
    },
    {
      id: "2",
      name: "李四",
      phone: "13900139000",
      email: "lisi@example.com",
      totalAppointments: 3,
      totalSpent: 460,
      lastVisit: "2023-12-28",
      tags: ["新客"],
      status: "active",
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">客户管理</h1>
        <Button>导出客户数据</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总客户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">256</div>
            <p className="text-xs text-muted-foreground">
              本月新增 24 位
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">客单价</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥168</div>
            <p className="text-xs text-muted-foreground">
              较上月 +5.2%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">复购率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <p className="text-xs text-muted-foreground">
              较上月 +2.4%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃度</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              较上月 -1.2%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>客户筛选</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="搜索客户..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button variant="outline">高级筛选</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>客户列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>客户信息</TableHead>
                <TableHead>标签</TableHead>
                <TableHead>预约次数</TableHead>
                <TableHead>消费金额</TableHead>
                <TableHead>最近到访</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{customer.name}</div>
                      <div className="flex flex-col text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{customer.totalAppointments}</TableCell>
                  <TableCell>¥{customer.totalSpent}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {customer.lastVisit}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>客户详情</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">基本信息</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-20 text-muted-foreground">姓名</span>
                      <span>{selectedCustomer.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-muted-foreground">电话</span>
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-muted-foreground">邮箱</span>
                      <span>{selectedCustomer.email}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">消费统计</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-20 text-muted-foreground">预约次数</span>
                      <span>{selectedCustomer.totalAppointments}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-muted-foreground">消费金额</span>
                      <span>¥{selectedCustomer.totalSpent}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-muted-foreground">最近到访</span>
                      <span>{selectedCustomer.lastVisit}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">预约记录</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日期</TableHead>
                      <TableHead>服务项目</TableHead>
                      <TableHead>服务人员</TableHead>
                      <TableHead>金额</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-01-05</TableCell>
                      <TableCell>剪发</TableCell>
                      <TableCell>李四</TableCell>
                      <TableCell>¥88</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-12-15</TableCell>
                      <TableCell>染发</TableCell>
                      <TableCell>王五</TableCell>
                      <TableCell>¥299</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 