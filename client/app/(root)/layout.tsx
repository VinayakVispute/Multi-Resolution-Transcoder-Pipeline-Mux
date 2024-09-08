import DashboardNavbar from "@/components/shared/DashboardNavbar";
import { NotificationHistoryProvider } from "@/context/NotificationHistoryContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NotificationHistoryProvider>
      <div className="flex flex-col h-screen bg-white text-black mb-8">
        <DashboardNavbar />
        {children}
      </div>
    </NotificationHistoryProvider>
  );
}
