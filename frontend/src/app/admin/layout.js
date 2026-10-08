import { AdminProvider } from '../../components/admin/AdminProvider';
import AdminShell from '../../components/admin/AdminShell';
import AdminGuard from '../../components/AdminGuard';

export const metadata = {
  title: "NEXUS ADMIN PORTAL - System Governance & Control",
  description: "Level 0 Root Administration, Ingestion Control & AI Triage Management",
};

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <AdminProvider>
        <AdminShell>
          {children}
        </AdminShell>
      </AdminProvider>
    </AdminGuard>
  );
}

