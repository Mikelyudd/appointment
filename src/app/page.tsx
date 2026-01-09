import { redirect } from 'next/navigation';

export default function RootPage() {
    // 作为一个 Agency，根目录重定向到管理后台
    redirect('/admin');
}
