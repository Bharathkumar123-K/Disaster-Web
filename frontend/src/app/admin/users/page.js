'use client';

import { useState } from 'react';
import { useAdmin } from '../../../components/admin/AdminProvider';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  X, 
  Check, 
  Lock 
} from 'lucide-react';

export default function AdminUsersPage() {
  const { users, fetchUsers, showToast } = useAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agency, setAgency] = useState('NDRF Central HQ');
  const [role, setRole] = useState('Dispatcher');
  const [clearanceLevel, setClearanceLevel] = useState(3);
  const [status, setStatus] = useState('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, agency, role, clearanceLevel, status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User account created for ${name}`);
        setIsAddModalOpen(false);
        setName('');
        setEmail('');
        fetchUsers();
      }
    } catch (err) {
      showToast('Failed to create user', 'error');
    }
    setIsSubmitting(false);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User status updated to ${newStatus}`);
        fetchUsers();
      }
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleResetToken = async (user) => {
    const newToken = `SEC-${Math.floor(1000 + Math.random() * 9000)}-NX`;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ securityToken: newToken })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Security Clearance Token reset for ${user.name}: ${newToken}`);
        fetchUsers();
      }
    } catch (e) {
      showToast('Failed to reset token', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to revoke and delete this user account?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('User account revoked and removed');
        fetchUsers();
      }
    } catch (e) {
      showToast('Failed to delete user', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px', padding: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>Role-Based Access & User Clearance (RBAC)</span>
            <span className="admin-badge">GOVERNANCE</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Manage agency operators, security clearance levels (Tier 1-5), and clearance tokens.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="btn btn-approve"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff' }}
        >
          <UserPlus size={16} />
          Provision New Operator
        </button>
      </div>

      {/* User Accounts Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <Users size={18} color="#06b6d4" />
            <span>Authorized Command Operators ({users.length})</span>
          </div>
          <button onClick={fetchUsers} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            Refresh Users
          </button>
        </div>

        <div className="enterprise-table-container">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Operator Name</th>
                <th>Agency / Unit</th>
                <th>Assigned Role</th>
                <th>Clearance Tier</th>
                <th>Account Status</th>
                <th>Clearance Token</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#ffffff' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.agency}</td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      LEVEL {user.clearanceLevel}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={user.status} 
                      onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      style={{
                        background: user.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        color: user.status === 'Active' ? '#10b981' : '#f43f5e',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Active" style={{ background: '#0f172a', color: '#10b981' }}>Active</option>
                      <option value="Suspended" style={{ background: '#0f172a', color: '#f43f5e' }}>Suspended</option>
                      <option value="Pending Verification" style={{ background: '#0f172a', color: '#f59e0b' }}>Pending</option>
                    </select>
                  </td>
                  <td className="font-mono" style={{ fontSize: '0.78rem', color: '#38bdf8' }}>
                    {user.securityToken || 'SEC-8849-NX'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleResetToken(user)} 
                        title="Reset Clearance Token"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: '#f59e0b', padding: '0.35rem', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Key size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)} 
                        title="Revoke & Delete User"
                        style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '0.35rem', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                  <UserPlus size={20} color="#06b6d4" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Provision Command Operator</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Create access credentials & assign RBAC clearance tier</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Inspector Ramesh Kumar" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Agency Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="r.kumar@ndrf.gov.in" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Agency Division</label>
                  <select className="form-select" value={agency} onChange={e => setAgency(e.target.value)}>
                    <option value="NDRF Central HQ">NDRF Central HQ</option>
                    <option value="SDRF Regional Cell">SDRF Regional Cell</option>
                    <option value="Indian Coast Guard">Indian Coast Guard</option>
                    <option value="Fire & Rescue Division">Fire & Rescue Division</option>
                    <option value="Medical Emergency Unit">Medical Emergency Unit</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Role</label>
                  <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                    <option value="Commander">Commander</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Observer">Observer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Security Clearance Level (1 to 5)</label>
                <select className="form-select" value={clearanceLevel} onChange={e => setClearanceLevel(Number(e.target.value))}>
                  <option value={1}>Level 1 (Basic View)</option>
                  <option value={2}>Level 2 (Standard Dispatch)</option>
                  <option value={3}>Level 3 (Senior Dispatcher)</option>
                  <option value={4}>Level 4 (Regional Commander)</option>
                  <option value={5}>Level 5 (Superintendent / Director)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-dismiss">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-approve" style={{ flex: 2, background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                  {isSubmitting ? 'Creating User...' : 'Provision Access Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
