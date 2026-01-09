"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Package, 
  Clock, 
  DollarSign 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getServiceDetail, updateService } from "@/app/actions/service";
import { addServiceOption, deleteServiceOption } from "@/app/actions/booking";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const serviceId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [service, setService] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (serviceId) loadService();
  }, [serviceId]);

  async function loadService() {
    setLoading(true);
    const res = await getServiceDetail(serviceId);
    if (res.success) setService(res.data);
    setLoading(false);
  }

  const handleUpdateBasic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateService(serviceId, {
      name: formData.get("name") as string,
      duration: parseInt(formData.get("duration") as string),
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      category: formData.get("category") as string,
    });
    if (res.success) toast({ title: "Saved Changes" });
    setIsSaving(false);
  };

  const handleAddOption = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await addServiceOption({
      serviceId,
      name: formData.get("optName") as string,
      duration: parseInt(formData.get("optDuration") as string),
      price: parseFloat(formData.get("optPrice") as string),
      type: formData.get("optType") as string,
    });
    if (res.success) {
      toast({ title: "Option Added" });
      loadService();
      (e.target as HTMLFormElement).reset();
    }
  };

  const handleDeleteOption = async (id: string) => {
    if (confirm("Delete this option?")) {
      const res = await deleteServiceOption(id);
      if (res.success) loadService();
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-yellow-600" /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/services?shopId=${shopId}`)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{service?.name}</h1>
            <p className="text-muted-foreground">Configure details and pricing packages.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateBasic} id="basic-form" className="space-y-6">
                <div className="space-y-2"><Label>Service Name</Label><Input name="name" defaultValue={service?.name} required /></div>
                <div className="space-y-2"><Label>Category</Label><Input name="category" defaultValue={service?.category} placeholder="e.g. Skin Care" /></div>
                <div className="space-y-2"><Label>Full Description</Label><Textarea name="description" defaultValue={service?.description} rows={6} placeholder="Describe the benefits, process, and results of this service..." /></div>
                <Button type="submit" className="bg-yellow-600" disabled={isSaving}>{isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save General Info</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Packages & Options</CardTitle>
              <CardDescription>Add variants like "10-Session Pass" or "VIP Treatment" for this service.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Option Name</TableHead><TableHead>Type</TableHead><TableHead>Duration</TableHead><TableHead>Price</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow className="bg-yellow-50/30 font-medium"><TableCell>Base Service</TableCell><TableCell>Standard</TableCell><TableCell>{service?.duration}m</TableCell><TableCell>${Number(service?.price).toFixed(2)}</TableCell><TableCell className="text-right text-xs text-muted-foreground italic">(Editable in General Info)</TableCell></TableRow>
                  {service?.options?.map((opt: any) => (
                    <TableRow key={opt.id}><TableCell>{opt.name}</TableCell><TableCell>{opt.type || "Option"}</TableCell><TableCell>{opt.duration}m</TableCell><TableCell>${Number(opt.price).toFixed(2)}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600" onClick={() => handleDeleteOption(opt.id)}><Trash2 className="w-4 h-4" /></Button></TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Add Option Form */}
              <div className="mt-8 pt-8 border-t">
                <h4 className="font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Option</h4>
                <form onSubmit={handleAddOption} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2 col-span-1 md:col-span-1"><Label className="text-xs">Option Name</Label><Input name="optName" required placeholder="e.g. 5-Session Bundle" /></div>
                  <div className="space-y-2"><Label className="text-xs">Type</Label><Input name="optType" placeholder="Package / VIP" /></div>
                  <div className="space-y-2"><Label className="text-xs">Duration (min)</Label><Input name="optDuration" type="number" defaultValue={service?.duration} /></div>
                  <div className="space-y-2"><Label className="text-xs">Price ($)</Label><Input name="optPrice" type="number" step="0.01" required /></div>
                  <div className="col-span-full md:col-span-4 mt-2"><Button type="submit" variant="secondary" className="w-full">Add Option to List</Button></div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Stats */}
        <div className="space-y-6">
          <Card className="bg-yellow-600 text-white">
            <CardHeader><CardTitle className="text-lg">Service Quick Stats</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center"><span className="opacity-80 flex items-center gap-2"><Clock className="w-4 h-4" /> Duration</span><span className="font-bold">{service?.duration} mins</span></div>
              <div className="flex justify-between items-center"><span className="opacity-80 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Starting at</span><span className="font-bold text-2xl">${Number(service?.price).toFixed(2)}</span></div>
              <div className="flex justify-between items-center"><span className="opacity-80 flex items-center gap-2"><Package className="w-4 h-4" /> Options</span><span className="font-bold">{service?.options?.length || 0} variants</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Store View Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                <h4 className="font-bold text-gray-800">{service?.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-3">{service?.description || "No description provided."}</p>
                <div className="flex justify-between items-center pt-2"><span className="text-sm font-bold text-yellow-700">${Number(service?.price).toFixed(2)}</span><Button size="sm" className="h-7 text-[10px] px-2 bg-yellow-600">Select</Button></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
