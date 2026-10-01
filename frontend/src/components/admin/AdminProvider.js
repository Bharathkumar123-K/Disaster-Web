'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [aiConfig, setAiConfig] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [isInjectModalOpen, setIsInjectModalOpen] = useState(false);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/overview');
      const data = await res.json();
      if (data.success) {
        setOverview(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch admin overview:', e);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch admin users:', e);
    }
  }, []);

  const fetchAiConfig = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/ai-config');
      const data = await res.json();
      if (data.success) {
        setAiConfig(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch AI config:', e);
    }
  }, []);

  const fetchIncidents = useCallback(async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:5000/api/admin/incidents?${query}`);
      const data = await res.json();
      if (data.success) {
        setIncidents(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch admin incidents:', e);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/logs');
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch audit logs:', e);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchOverview(), fetchUsers(), fetchAiConfig(), fetchIncidents(), fetchLogs()]);
    setLoading(false);
  }, [fetchOverview, fetchUsers, fetchAiConfig, fetchIncidents, fetchLogs]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Feed Toggle
  const toggleFeed = async (feedKey, enabled) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/ingestion/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedKey, enabled })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Feed '${feedKey}' set to ${enabled ? 'ENABLED' : 'PAUSED'}`);
        fetchOverview();
      }
    } catch (e) {
      showToast('Failed to toggle feed status', 'error');
    }
  };

  // Inject Simulated Incident
  const injectIncident = async (payload) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/ingestion/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Simulated disaster event dispatched to live network!`);
        setIsInjectModalOpen(false);
        refreshAll();
      }
    } catch (e) {
      showToast('Failed to inject disaster simulation', 'error');
    }
  };

  // Save AI Config
  const saveAiConfig = async (newConfig) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      const data = await res.json();
      if (data.success) {
        setAiConfig(data.data);
        showToast('AI Triage parameters & alert triggers updated!');
      }
    } catch (e) {
      showToast('Failed to save AI configuration', 'error');
    }
  };

  return (
    <AdminContext.Provider value={{
      overview,
      users,
      aiConfig,
      incidents,
      logs,
      loading,
      toastMessage,
      showToast,
      refreshAll,
      toggleFeed,
      injectIncident,
      saveAiConfig,
      fetchIncidents,
      fetchUsers,
      fetchLogs,
      isInjectModalOpen,
      setIsInjectModalOpen,
      isFreezeModalOpen,
      setIsFreezeModalOpen
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
