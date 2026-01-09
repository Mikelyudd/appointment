import { redirect } from 'next/navigation';

export default function ShopPage({ params }: { params: { slug: string } }) {
    redirect(`/shop/${params.slug}/services`);
}
