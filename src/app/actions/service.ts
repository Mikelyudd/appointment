export async function getServiceDetail(serviceId: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        options: { orderBy: { price: 'asc' } }
      }
    });
    return { success: true, data: service };
  } catch (error) {
    console.error('Error fetching service detail:', error);
    return { success: false, error: 'Failed to fetch service detail' };
  }
}

export async function updateService(serviceId: string, data: {
  name?: string;
  duration?: number;
  price?: number;
  category?: string;
  description?: string;
}) {
  try {
    const service = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: data.name,
        duration: data.duration,
        price: data.price,
        category: data.category,
        description: data.description,
      },
    });
    revalidatePath('/admin/services');
    return { success: true, data: service };
  } catch (error) {
    console.error('Error updating service:', error);
    return { success: false, error: 'Failed to update service' };
  }
}
