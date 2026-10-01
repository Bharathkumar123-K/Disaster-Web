import { AdminProvider } from '../../components/admin/AdminProvider';
import AdminShell from '../../components/admin/AdminShell';

export const metadata = {
  title: "NEXUS ADMIN PORTAL - System Governance & Control",
  description: "Level 0 Root Administration, Ingestion Control & AI Triage Management",
};

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminShell>
        {children}
      </AdminShell>
    </AdminProvider>
  );
}
