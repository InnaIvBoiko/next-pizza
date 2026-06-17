export const metadata = {
    title: 'Next Pizza | Dashboard',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <div>DASHBOARD HEADER</div>
            {children}
        </div>
    );
}
