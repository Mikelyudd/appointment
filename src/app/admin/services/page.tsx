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
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Service {
  id: string;
  name: string;
  duration: string;
  price: number | "Variable";
  category?: string;
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "基础剪发",
      duration: "30 mins",
      price: 88,
      category: "剪发",
    },
    {
      id: "2",
      name: "染发",
      duration: "120 mins",
      price: 299,
      category: "染发",
    },
    {
      id: "3",
      name: "造型设计",
      duration: "60 mins",
      price: "Variable",
      category: "造型",
    },
  ]);
  const { toast } = useToast();

  const handleCreateService = async (data: any) => {
    try {
      // TODO: 调用API创建服务
      const newService = {
        id: Math.random().toString(),
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
      };
      setServices([...services, newService]);
      setOpen(false);
      toast({
        title: "成功",
        description: "服务创建成功",
      });
    } catch (error) {
      console.error("创建服务失败:", error);
      toast({
        title: "错误",
        description: "创建服务失败",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      // TODO: 调用API删除服务
      setServices(services.filter((service) => service.id !== serviceId));
      toast({
        title: "成功",
        description: "服务删除成功",
      });
    } catch (error) {
      console.error("删除服务失败:", error);
      toast({
        title: "错误",
        description: "删除服务失败",
        variant: "destructive",
      });
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">服务管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>添加服务</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新服务</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">服务名称</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="请输入服务名称"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">时长</Label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="例如: 30 mins"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">价格</Label>
                <Input
                  id="price"
                  name="price"
                  placeholder="输入价格或 Variable"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="请输入分类"
                />
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
            placeholder="搜索服务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>服务名称</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>时长</TableHead>
              <TableHead className="text-right">价格</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.category || "-"}</TableCell>
                <TableCell>{service.duration}</TableCell>
                <TableCell className="text-right">
                  {typeof service.price === "number"
                    ? `¥${service.price}`
                    : service.price}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  没有找到服务
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 