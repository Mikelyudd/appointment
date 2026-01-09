"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function VerificationsPage() {
  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto bg-yellow-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle>Verification Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This module is being upgraded to provide advanced SMS auditing and security monitoring. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
