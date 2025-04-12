import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Script from 'next/script';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  // Mock user for the sidebar
  const mockUser = {
    id: 'ilirion-user',
    name: 'Ilirion User',
    email: 'user@ilirionai.al',
    image: null
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={mockUser} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
