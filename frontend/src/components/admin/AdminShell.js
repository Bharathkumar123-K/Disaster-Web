'use client';

import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import InjectIncidentModal from './InjectIncidentModal';
import EmergencyFreezeModal from './EmergencyFreezeModal';

export default function AdminShell({ children }) {
  return (
    <div className="app-container">
      <AdminSidebar />
      <div className="main-wrapper">
        <AdminTopBar />
        <main className="page-content" style={{ background: 'radial-gradient(circle at 50% 0%, #172033 0%, #0b0f19 80%)' }}>
          {children}
        </main>
      </div>
      <InjectIncidentModal />
      <EmergencyFreezeModal />
    </div>
  );
}
