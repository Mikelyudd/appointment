import { redirect } from 'next/navigation';

export default function ShopPage({ params }: { params: { code: string } }) {
    // 自动重定向到该店铺的服务选择页
    redirect(`/s/${params.code}/services`);
}
