'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function ClientShell({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <TopBar />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
