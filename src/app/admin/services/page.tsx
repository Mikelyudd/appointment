"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Plus, Trash2, PackagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getServices, createService, deleteService, addServiceOption, deleteServiceOption } from "@/app/actions/booking";

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [optionOpen, setOptionOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { if (shopId) loadServices(); }, [shopId]);

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
      name: formData.get('name') as string,
      duration: parseInt(formData.get('duration') as string),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
    });
    if (res.success) { toast({ title: "Success" }); setOpen(false); loadServices(); }
    setIsSubmitting(false);
  };

  const handleAddOption = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedService) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await addServiceOption({
      serviceId: selectedService.id,
      name: formData.get('name') as string,
      duration: parseInt(formData.get('duration') as string),
      price: parseFloat(formData.get('price') as string),
      type: formData.get('type') as string,
    });
    if (res.success) { toast({ title: "Success" }); setOptionOpen(false); loadServices(); }
    setIsSubmitting(false);
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Delete service?")) {
      const res = await deleteService(id);
      if (res.success) loadServices();
    }
  };

  const handleDeleteOption = async (id: string) => {
    if (confirm("Delete option?")) {
      const res = await deleteServiceOption(id);
      if (res.success) loadServices();
    }
  };

  if (!shopId) return <div className="p-8 text-center">No shop selected.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-yellow-600 hover:bg-yellow-700"><Plus className="w-4 h-4 mr-2" /> Add Service</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Service</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input name="name" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Duration (min)</Label><Input name="duration" type="number" required /></div>
                <div className="space-y-2"><Label>Price ($)</Label><Input name="price" type="number" step="0.01" required /></div>
              </div>
              <div className="space-y-2"><Label>Category</Label><Input name="category" /></div>
              <div className="space-y-2"><Label>Description</Label><Input name="description" /></div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-yellow-600">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {loading ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : services.map((service) => (
          <div key={service.id} className="bg-white border rounded-xl overflow-hidden">
            <div className="p-6 border-b flex justify-between">
              <div><h2 className="text-xl font-bold">{service.name}</h2><p className="text-sm text-muted-foreground">{service.description}</p></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setSelectedService(service); setOptionOpen(true); }}><PackagePlus className="w-4 h-4 mr-2" /> Add Option</Button>
                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteService(service.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead className="pl-6">Option</TableHead><TableHead>Type</TableHead><TableHead>Duration</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="pr-6"></TableHead></TableRow></TableHeader>
              <TableBody>
                <TableRow><TableCell className="pl-6 font-medium">Base Service</TableCell><TableCell>-</TableCell><TableCell>{service.duration} mins</TableCell><TableCell className="text-right font-bold">${Number(service.price).toFixed(2)}</TableCell><TableCell></TableCell></TableRow>
                {service.options?.map((opt: any) => (
                  <TableRow key={opt.id}><TableCell className="pl-6">{opt.name}</TableCell><TableCell>{opt.type || "-"}</TableCell><TableCell>{opt.duration} mins</TableCell><TableCell className="text-right font-bold">${Number(opt.price).toFixed(2)}</TableCell><TableCell className="pr-6 text-right"><Button variant="ghost" size="icon" onClick={() => handleDeleteOption(opt.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button></TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>

      <Dialog open={optionOpen} onOpenChange={setOptionOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Option to [{selectedService?.name}]</DialogTitle></DialogHeader>
          <form onSubmit={handleAddOption} className="space-y-4">
            <div className="space-y-2"><Label>Option Name</Label><Input name="name" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Duration (min)</Label><Input name="duration" type="number" defaultValue={selectedService?.duration} /></div>
              <div className="space-y-2"><Label>Price ($)</Label><Input name="price" type="number" step="0.01" /></div>
            </div>
            <div className="space-y-2"><Label>Type (e.g. Package)</Label><Input name="type" /></div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-yellow-600">Save Option</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
