"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Edit2, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getServices, deleteService } from "@/app/actions/booking";
import { createDraftService } from "@/app/actions/service";

export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
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

  const handleAddNew = async () => {
    if (!shopId) return;
    setIsCreating(true);
    const res = await createDraftService(shopId);
    if (res.success) {
      // 瞬间跳转到详情页
      router.push(`/admin/services/${res.data.id}?shopId=${shopId}`);
    } else {
      toast({ title: "Error", description: "Could not create service draft", variant: "destructive" });
      setIsCreating(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const res = await deleteService(id);
      if (res.success) loadServices();
    }
  };

  if (!shopId) return <div className="p-20 text-center text-muted-foreground flex flex-col items-center gap-4">
    <LayoutGrid className="w-12 h-12 opacity-20" />
    <p>Please select a shop to manage services.</p>
  </div>;

  return (
    <div className="p-6 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Service Menu</h1>
          <p className="text-muted-foreground mt-2 text-lg">Define your offerings and pricing variations.</p>
        </div>
        <Button 
          onClick={handleAddNew} 
          disabled={isCreating}
          className="bg-yellow-600 hover:bg-yellow-700 h-12 px-6 rounded-xl shadow-lg shadow-yellow-600/20"
        >
          {isCreating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          Add New Service
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-600" />
            <p className="text-sm font-medium text-gray-400">Loading your menu...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-full shadow-sm">
                <Plus className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="space-y-1">
                <p className="text-xl font-bold">No services yet</p>
                <p className="text-muted-foreground">Start by adding your first treatment or service.</p>
            </div>
            <Button onClick={handleAddNew} variant="outline" className="mt-4 border-yellow-600 text-yellow-700 hover:bg-yellow-50">Create Now</Button>
          </div>
        ) : services.map((s) => (
          <Card key={s.id} className="p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group border-none bg-white shadow-sm ring-1 ring-gray-100">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold group-hover:text-yellow-700 transition-colors">{s.name}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1 rounded-full text-sm font-medium">
                    <Loader2 className="w-3 h-3 mr-2 opacity-50" /> {s.duration} mins
                  </div>
                  <span className="text-2xl font-black text-yellow-700">${Number(s.price).toFixed(2)}</span>
                  {s.options?.length > 0 && (
                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {s.options.length} Variations
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                    variant="secondary" 
                    className="rounded-xl h-11 px-5 font-bold"
                    onClick={() => router.push(`/admin/services/${s.id}?shopId=${shopId}`)}
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                </Button>
                <Button 
                    variant="ghost" 
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-11 w-11 p-0" 
                    onClick={() => handleDeleteService(s.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
