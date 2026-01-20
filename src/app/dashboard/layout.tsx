import { Sidebar } from "@/components/crm/Sidebar";
import { UserProfile } from "@/components/UserProfile";
import { GlobalSearch } from "@/components/GlobalSearch";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="ml-[19rem] mr-6 my-6 space-y-6">
                {/* Header with Search and User Profile */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <GlobalSearch />
                    </div>
                    <UserProfile />
                </div>
                
                {/* Main Content */}
                <main className="min-h-[calc(100vh-8rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
