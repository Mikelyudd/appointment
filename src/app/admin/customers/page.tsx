"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <UserCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This module is under development. You will soon be able to view customer history and preferences here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
