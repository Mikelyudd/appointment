"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function TimeSlotsPage() {
  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle>Timeslot Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This module is being refactored to support flexible scheduling and availability controls.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
