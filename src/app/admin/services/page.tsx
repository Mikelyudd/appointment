"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getServices, createService, deleteService } from "@/app/actions/booking";

export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (shopId) loadServices();
  }, [shopId]);

  async function loadServices() {
    setLoading(true);
    const res = await getServices(shopId!);
    if (res.success) setServices(res.data || []);
    setLoading(false);
  }

  const handleCreateService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!shopId) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createService({
      shopId,
      name: formData.get("name") as string,
      duration: parseInt(formData.get("duration") as string),
      price: parseFloat(formData.get("price") as string),
    });
    if (res.success) {
      toast({ title: "Created!" });
      setOpen(false);
      // 直接跳转到详情页进行深度编辑
      router.push(`/admin/services/${res.data.id}?shopId=${shopId}`);
    }
    setIsSubmitting(false);
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const res = await deleteService(id);
      if (res.success) loadServices();
    }
  };

  if (!shopId) return <div className="p-8 text-center text-muted-foreground">No shop selected.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Service Menu</h1>
          <p className="text-muted-foreground mt-1">Add and manage your salon's services.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="w-4 h-4 mr-2" /> Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Quick Add Service</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateService} className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Service Name</Label><Input name="name" required placeholder="e.g. Deep Tissue Massage" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Duration (min)</Label><Input name="duration" type="number" required defaultValue="60" /></div>
                <div className="space-y-2"><Label>Price ($)</Label><Input name="price" type="number" step="0.01" required placeholder="0.00" /></div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-yellow-600">Create & Configure</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-yellow-600" /></div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
            <p className="text-muted-foreground">No services yet. Click "Add New Service" to start.</p>
          </div>
        ) : services.map((s) => (
          <Card key={s.id} className="p-6 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xl font-bold group-hover:text-yellow-700 transition-colors">{s.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{s.duration} mins</span>
                  <span>•</span>
                  <span className="font-bold text-yellow-700">${Number(s.price).toFixed(2)}</span>
                  {s.options?.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {s.options.length} Packages
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push(`/admin/services/${s.id}?shopId=${shopId}`)}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                </Button>
                <Button variant="ghost" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteService(s.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
