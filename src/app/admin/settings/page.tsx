"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface BusinessHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface ShopSettings {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  businessHours: BusinessHours[];
}

const defaultBusinessHours: BusinessHours[] = [
  { day: "周一", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "周二", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "周三", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "周四", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "周五", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "周六", isOpen: true, openTime: "10:00", closeTime: "17:00" },
  { day: "周日", isOpen: false, openTime: "09:00", closeTime: "18:00" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<ShopSettings>({
    name: "示例美发店",
    description: "提供专业的美发服务",
    address: "北京市朝阳区xx街xx号",
    phone: "010-12345678",
    email: "shop@example.com",
    businessHours: defaultBusinessHours,
  });
  const { toast } = useToast();

  const handleBasicInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const updatedSettings = {
        ...settings,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        address: formData.get("address") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
      };

      // TODO: 调用API保存设置
      setSettings(updatedSettings);
      toast({
        title: "成功",
        description: "基本信息更新成功",
      });
    } catch (error) {
      console.error("更新设置失败:", error);
      toast({
        title: "错误",
        description: "更新设置失败",
        variant: "destructive",
      });
    }
  };

  const handleBusinessHoursChange = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    const newBusinessHours = [...settings.businessHours];
    newBusinessHours[index] = {
      ...newBusinessHours[index],
      [field]: value,
    };

    setSettings({
      ...settings,
      businessHours: newBusinessHours,
    });
  };

  const handleBusinessHoursSubmit = async () => {
    try {
      // TODO: 调用API保存营业时间
      toast({
        title: "成功",
        description: "营业时间更新成功",
      });
    } catch (error) {
      console.error("更新营业时间失败:", error);
      toast({
        title: "错误",
        description: "更新营业时间失败",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">设置</h1>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="hours">营业时间</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>
                设置店铺的基本信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">店铺名称</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={settings.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">店铺简介</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={settings.description}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">地址</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={settings.address}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">联系电话</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={settings.phone}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={settings.email}
                    required
                  />
                </div>
                <Button type="submit">保存更改</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>营业时间</CardTitle>
              <CardDescription>
                设置每周的营业时间
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.businessHours.map((hours, index) => (
                  <div key={hours.day} className="flex items-center gap-4">
                    <div className="w-20">
                      <Label>{hours.day}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hours.isOpen}
                        onChange={(e) => handleBusinessHoursChange(index, "isOpen", e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm">营业</span>
                    </div>
                    <Input
                      type="time"
                      value={hours.openTime}
                      onChange={(e) => handleBusinessHoursChange(index, "openTime", e.target.value)}
                      disabled={!hours.isOpen}
                      className="w-32"
                    />
                    <span>至</span>
                    <Input
                      type="time"
                      value={hours.closeTime}
                      onChange={(e) => handleBusinessHoursChange(index, "closeTime", e.target.value)}
                      disabled={!hours.isOpen}
                      className="w-32"
                    />
                  </div>
                ))}
                <Button onClick={handleBusinessHoursSubmit}>保存营业时间</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>
                设置预约通知和提醒方式
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="email-notifications">邮件通知</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sms-notifications"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="sms-notifications">短信通知</Label>
                </div>
                <Button>保存通知设置</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 