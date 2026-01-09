"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
}

export default function TimeSlotsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      date: "2024-01-10",
      startTime: "09:00",
      endTime: "10:00",
      capacity: 3,
      booked: 1,
    },
    {
      id: "2",
      date: "2024-01-10",
      startTime: "10:00",
      endTime: "11:00",
      capacity: 3,
      booked: 2,
    },
  ]);

  const handleAddTimeSlot = async (formData: FormData) => {
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const capacity = parseInt(formData.get("capacity") as string);

    try {
      // TODO: 调用API创建时间段
      const response = await fetch("/api/timeslots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date?.toISOString().split("T")[0],
          startTime,
          endTime,
          capacity,
        }),
      });

      if (!response.ok) {
        throw new Error("创建时间段失败");
      }

      // TODO: 刷新时间段列表
    } catch (error) {
      console.error("创建时间段失败:", error);
      // TODO: 显示错误提示
    }
  };

  const handleDeleteTimeSlot = async (timeSlotId: string) => {
    try {
      // TODO: 调用API删除时间段
      const response = await fetch(`/api/timeslots/${timeSlotId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("删除时间段失败");
      }

      // 更新本地状态
      setTimeSlots(timeSlots.filter(slot => slot.id !== timeSlotId));
    } catch (error) {
      console.error("删除时间段失败:", error);
      // TODO: 显示错误提示
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">时间段管理</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>添加时间段</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新时间段</DialogTitle>
            </DialogHeader>
            <form action={handleAddTimeSlot} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">开始时间</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">结束时间</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">��量</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  required
                />
              </div>
              <Button type="submit">创建</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* 日历 */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>选择日期</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* 时间段列表 */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>时间段列表</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>开始时间</TableHead>
                  <TableHead>结束时间</TableHead>
                  <TableHead>总容量</TableHead>
                  <TableHead>已预约</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{slot.startTime}</TableCell>
                    <TableCell>{slot.endTime}</TableCell>
                    <TableCell>{slot.capacity}</TableCell>
                    <TableCell>{slot.booked}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTimeSlot(slot.id)}
                      >
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 