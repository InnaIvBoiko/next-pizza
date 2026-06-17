import { getAdminSession } from '@/shared/lib/get-admin-session';

export default async function Dashboard() {
    await getAdminSession();

    return <div>Dashboard</div>;
}
