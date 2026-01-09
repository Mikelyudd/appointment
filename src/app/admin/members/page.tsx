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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "staff";
  status: "active" | "inactive";
  services: string[];
}

const roleLabels = {
  admin: { label: "管理员", variant: "default" as const },
  staff: { label: "员工", variant: "secondary" as const },
};

const statusLabels = {
  active: { label: "在职", variant: "default" as const },
  inactive: { label: "离职", variant: "destructive" as const },
};

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const { toast } = useToast();

  const handleCreateMember = async (data: any) => {
    try {
      // TODO: 调用API创建成员
      const newMember: Member = {
        id: Math.random().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || "staff",
        status: "active",
        services: []
      };
      setMembers([...members, newMember]);
      setOpen(false);
      toast.success("成员创建成功");
    } catch (error) {
      console.error("创建成员失败:", error);
      toast.error("创建成员失败");
    }
  };

  const handleToggleStatus = async (memberId: string) => {
    try {
      // TODO: 调用API更新状态
      setMembers(
        members.map((member) =>
          member.id === memberId
            ? { ...member, status: member.status === "active" ? "inactive" : "active" }
            : member
        )
      );
      toast({
        title: "成功",
        description: "状态更新成功",
      });
    } catch (error) {
      console.error("更新状态失败:", error);
      toast({
        title: "错误",
        description: "更新状态失败",
        variant: "destructive",
      });
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.phone.includes(searchQuery)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">成员管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>添加成员</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新成员</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="请输入姓名"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="请输入邮箱"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="请输入手机号"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <select
                  id="role"
                  name="role"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="staff"
                  required
                >
                  <option value="admin">管理员</option>
                  <option value="staff">员工</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button type="submit">创建</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="搜索成员..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>联系方式</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>服务项目</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-2 h-4 w-4" />
                      {member.email}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-4 w-4" />
                      {member.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={roleLabels[member.role].variant}>
                    {roleLabels[member.role].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusLabels[member.status].variant}>
                    {statusLabels[member.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {member.services.map((service) => (
                      <Badge key={service} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {member.status === "active" ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleToggleStatus(member.id)}
                    >
                      离职
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(member.id)}
                    >
                      恢复
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  没有找到成员
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 