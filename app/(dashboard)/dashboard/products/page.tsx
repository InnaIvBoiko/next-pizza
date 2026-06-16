import { getAdminSession } from '@/shared/lib/get-admin-session';

export default async function DashboardProducts() {
    await getAdminSession();

    return <div>Dashboard Products</div>;
}
