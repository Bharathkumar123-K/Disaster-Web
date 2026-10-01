import { DisasterProvider } from '../../components/DisasterProvider';
import ClientShell from '../../components/ClientShell';

export default function DashboardLayout({ children }) {
  return (
    <DisasterProvider>
      <ClientShell>
        {children}
      </ClientShell>
    </DisasterProvider>
  );
}
