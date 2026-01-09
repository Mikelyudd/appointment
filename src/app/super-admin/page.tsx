'use client';

import { useState, useEffect } from 'react';
import { getAllShops, onboardShop } from '@/app/actions/super-admin';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Store, Calendar, Users, Link as LinkIcon, ExternalLink, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SuperAdminDashboard() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadShops(); }, []);

  async function loadShops() {
    setLoading(true);
    const res = await getAllShops();
    if (res.success) setShops(res.data || []);
    setLoading(false);
  }

  async function handleOnboard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
    };

    const res = await onboardShop(data);
    if (res.success) {
      toast({ title: "Success", description: "Shop created successfully!" });
      setIsDialogOpen(false);
      loadShops();
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agency Control Center</h1>
          <p className="text-muted-foreground mt-2">Manage your merchants and platform growth.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary"><Plus className="mr-2 h-4 w-4" /> Add New Merchant</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Onboard New Shop</DialogTitle></DialogHeader>
            <form onSubmit={handleOnboard} className="space-y-4 pt-4">
              <div className="space-y-2"><Label htmlFor="name">Shop Name</Label><Input id="name" name="name" required /></div>
              <div className="space-y-2"><Label htmlFor="email">Merchant Email (Login ID)</Label><Input id="email" name="email" type="email" required /></div>
              <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" name="address" /></div>
              <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" /></div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Confirm & Generate Link"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Merchants</CardTitle><Store className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{shops.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Appointments</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{shops.reduce((acc, s) => acc + (s._count?.appointments || 0), 0)}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Platform Revenue</CardTitle><DollarSign className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">${shops.reduce((acc, s) => acc + (s.appointments?.reduce((sum: number, a: any) => sum + Number(a.price || 0), 0) || 0), 0).toFixed(2)}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="shops" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shops">Shops & Links</TabsTrigger>
          <TabsTrigger value="accounts">Merchant Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="shops">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Shop Name</TableHead><TableHead>Short Code</TableHead><TableHead>Services</TableHead><TableHead>Appts</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow> : shops.map((shop) => (
                    <TableRow key={shop.id}>
                      <TableCell className="font-medium">{shop.name}</TableCell>
                      <TableCell><code className="bg-muted px-2 py-1 rounded text-xs">{shop.slug}</code></TableCell>
                      <TableCell>{shop._count?.services || 0}</TableCell>
                      <TableCell>{shop._count?.appointments || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild><a href={`/admin/appointments?shopId=${shop.id}`}><Store className="h-4 w-4 mr-2" /> Manage</a></Button>
                          <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/s/${shop.slug}`); toast({ title: "Copied!" }); }}><LinkIcon className="h-4 w-4 mr-2" /> Link</Button>
                          <Button variant="ghost" size="sm" asChild><a href={`/s/${shop.slug}`} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader><CardTitle>Merchant Login Credentials</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Merchant Email</TableHead><TableHead>Linked Shop</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {shops.map((shop) => (
                    shop.users?.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{shop.name}</TableCell>
                        <TableCell><Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge></TableCell>
                        <TableCell className="text-right"><Button variant="ghost" size="sm" className="text-blue-600">Reset Password</Button></TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
