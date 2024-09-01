import DashboardNavbar from "@/components/shared/DashboardNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen bg-white text-black mb-8">
      <DashboardNavbar />
      {children}
    </div>
  );
}
