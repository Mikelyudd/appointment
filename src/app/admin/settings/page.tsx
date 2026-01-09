"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Store, Clock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getShopSettings, updateShopSettings } from "@/app/actions/booking";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => { if (shopId) loadSettings(); }, [shopId]);

  async function loadSettings() {
    setLoading(true);
    const res = await getShopSettings(shopId!);
    if (res.success) setSettings(res.data);
    setLoading(false);
  }

  const handleBasicSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateShopSettings(shopId!, {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
    });
    if (res.success) { toast({ title: "Updated!" }); setSettings(res.data); }
    setIsSubmitting(false);
  };

  const saveHours = async () => {
    setIsSubmitting(true);
    const res = await updateShopSettings(shopId!, { workingHours: settings.workingHours });
    if (res.success) toast({ title: "Hours Updated!" });
    setIsSubmitting(false);
  };

  if (loading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <Tabs defaultValue="basic">
        <TabsList className="mb-6"><TabsTrigger value="basic">Info</TabsTrigger><TabsTrigger value="hours">Hours</TabsTrigger></TabsList>
        <TabsContent value="basic">
          <Card>
            <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleBasicSubmit} className="space-y-4">
                <div className="space-y-2"><Label>Shop Name</Label><Input name="name" defaultValue={settings?.name} required /></div>
                <div className="space-y-2"><Label>Address</Label><Input name="address" defaultValue={settings?.address} required /></div>
                <div className="space-y-2"><Label>Phone</Label><Input name="phone" defaultValue={settings?.phone} required /></div>
                <Button type="submit" disabled={isSubmitting} className="bg-yellow-600"><Save className="w-4 h-4 mr-2" /> Save</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hours">
          <Card>
            <CardHeader><CardTitle>Working Hours</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {settings.workingHours.map((h: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-2 border rounded">
                  <div className="w-16 font-bold">{DAYS[h.day]}</div>
                  <input type="checkbox" checked={h.isOpen} onChange={(e) => {
                    const newHours = [...settings.workingHours];
                    newHours[i].isOpen = e.target.checked;
                    setSettings({ ...settings, workingHours: newHours });
                  }} />
                  <Input type="time" value={h.open} disabled={!h.isOpen} onChange={(e) => {
                    const newHours = [...settings.workingHours];
                    newHours[i].open = e.target.value;
                    setSettings({ ...settings, workingHours: newHours });
                  }} />
                  <Input type="time" value={h.close} disabled={!h.isOpen} onChange={(e) => {
                    const newHours = [...settings.workingHours];
                    newHours[i].close = e.target.value;
                    setSettings({ ...settings, workingHours: newHours });
                  }} />
                </div>
              ))}
              <Button onClick={saveHours} disabled={isSubmitting} className="w-full bg-yellow-600 mt-4">Save Hours</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
