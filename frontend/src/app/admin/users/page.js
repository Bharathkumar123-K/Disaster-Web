'use client';

import { useState } from 'react';
import { useAdmin } from '../../../components/admin/AdminProvider';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  X, 
  Check, 
  Lock,
  Phone,
  Mail,
  Building2,
  Shield,
  AlertTriangle,
  UserCheck,
  UserX,
  SlidersHorizontal
} from 'lucide-react';
import NexusSelect from '../../../components/NexusSelect';


export default function AdminUsersPage() {
  const { users, fetchUsers, fetchLogs, showToast } = useAdmin();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleChangeUser, setRoleChangeUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Add User Form State
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addAgency, setAddAgency] = useState('NDRF Central HQ');
  const [addAccountType, setAddAccountType] = useState('Operator');
  const [addOperationalRole, setAddOperationalRole] = useState('Dispatcher');
  const [addClearanceLevel, setAddClearanceLevel] = useState(3);
  const [addStatus, setAddStatus] = useState('Active');
  const [addPassword, setAddPassword] = useState('Nexus@2026');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit User Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAgency, setEditAgency] = useState('');
  const [editAccountType, setEditAccountType] = useState('Operator');
  const [editOperationalRole, setEditOperationalRole] = useState('Dispatcher');
  const [editClearanceLevel, setEditClearanceLevel] = useState(3);
  const [editStatus, setEditStatus] = useState('Active');
  const [editPassword, setEditPassword] = useState('');

  // Change Role Quick Modal State
  const [quickAccountType, setQuickAccountType] = useState('Operator');
  const [quickOperationalRole, setQuickOperationalRole] = useState('Dispatcher');
  const [quickClearanceLevel, setQuickClearanceLevel] = useState(3);

  // Reset Add Form
  const resetAddForm = () => {
    setAddName('');
    setAddEmail('');
    setAddPhone('');
    setAddAgency('NDRF Central HQ');
    setAddAccountType('Operator');
    setAddOperationalRole('Dispatcher');
    setAddClearanceLevel(3);
    setAddStatus('Active');
    setAddPassword('Nexus@2026');
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setEditPhone(user.phone || '');
    setEditAgency(user.agency || '');
    setEditAccountType(user.accountType || (user.role === 'Admin' ? 'Admin' : 'Operator'));
    setEditOperationalRole(user.operationalRole || user.role || 'Dispatcher');
    setEditClearanceLevel(user.clearanceLevel || 3);
    setEditStatus(user.status || 'Active');
    setEditPassword('');
  };

  // Open Quick Role Change Modal
  const openRoleChangeModal = (user) => {
    setRoleChangeUser(user);
    setQuickAccountType(user.accountType || (user.role === 'Admin' ? 'Admin' : 'Operator'));
    setQuickOperationalRole(user.operationalRole || user.role || 'Dispatcher');
    setQuickClearanceLevel(user.clearanceLevel || 3);
  };

  // Handle Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-name': 'Super Admin'
        },
        body: JSON.stringify({
          name: addName,
          email: addEmail,
          phone: addPhone,
          agency: addAgency,
          accountType: addAccountType,
          operationalRole: addAccountType === 'Admin' ? 'System Administrator' : (addAccountType === 'Citizen' ? 'Citizen' : addOperationalRole),
          clearanceLevel: addClearanceLevel,
          status: addStatus,
          password: addPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User account created for ${addName}`);
        setIsAddModalOpen(false);
        resetAddForm();
        fetchUsers();
        fetchLogs();
      } else {
        showToast(data.error || 'Failed to create user', 'error');
      }
    } catch (err) {
      showToast('Failed to create user account', 'error');
    }
    setIsSubmitting(false);
  };

  // Handle Save Edit User
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);
    try {
      const payload = {
        name: editName,
        email: editEmail,
        phone: editPhone,
        agency: editAgency,
        accountType: editAccountType,
        operationalRole: editAccountType === 'Admin' ? 'System Administrator' : (editAccountType === 'Citizen' ? 'Citizen' : editOperationalRole),
        clearanceLevel: editClearanceLevel,
        status: editStatus
      };

      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await fetch(`http://localhost:5000/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-name': 'Super Admin',
          'x-is-root': 'true'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Updated user profile for ${editName}`);
        setEditingUser(null);
        fetchUsers();
        fetchLogs();
      } else {
        showToast(data.error || 'Failed to update user', 'error');
      }
    } catch (err) {
      showToast('Failed to save user updates', 'error');
    }
    setIsSubmitting(false);
  };

  // Handle Quick Role Change
  const handleSaveRoleChange = async (e) => {
    e.preventDefault();
    if (!roleChangeUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${roleChangeUser._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-name': 'Super Admin'
        },
        body: JSON.stringify({
          accountType: quickAccountType,
          operationalRole: quickAccountType === 'Admin' ? 'System Administrator' : (quickAccountType === 'Citizen' ? 'Citizen' : quickOperationalRole),
          clearanceLevel: quickClearanceLevel
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Role & Clearance updated for ${roleChangeUser.name}`);
        setRoleChangeUser(null);
        fetchUsers();
        fetchLogs();
      } else {
        showToast(data.error || 'Failed to update role', 'error');
      }
    } catch (err) {
      showToast('Failed to update role & clearance', 'error');
    }
    setIsSubmitting(false);
  };

  // Toggle Suspend / Activate User
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-name': 'Super Admin'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User ${user.name} is now ${newStatus.toUpperCase()}`);
        fetchUsers();
        fetchLogs();
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (e) {
      showToast('Failed to update user status', 'error');
    }
  };

  // Handle Confirmed Delete User
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${deletingUser._id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-name': 'Super Admin'
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Revoked & deleted account for ${deletingUser.name}`);
        setDeletingUser(null);
        fetchUsers();
        fetchLogs();
      } else {
        showToast(data.error || 'Failed to delete user', 'error');
      }
    } catch (e) {
      showToast('Failed to delete user', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner with Prominent + ADD USER Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em' }}>User & Access Control (RBAC)</span>
            <span className="admin-badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              GOVERNANCE & PERMISSIONS
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Provision users, manage operational roles (Dispatcher, Analyst, Commander), assign Security Clearance (Tier 1 to 5), and enforce status controls.
          </p>
        </div>

        {/* PROMINENT + ADD USER BUTTON */}
        <button 
          onClick={() => {
            resetAddForm();
            setIsAddModalOpen(true);
          }} 
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            padding: '0.85rem 1.4rem',
            fontSize: '0.95rem',
            fontWeight: 800,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <UserPlus size={18} />
          + ADD USER
        </button>
      </div>

      {/* User Accounts Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
            <Users size={20} color="#06b6d4" />
            <span>Authorized System Users ({users.length})</span>
          </div>
          <button 
            onClick={fetchUsers} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#38bdf8', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <RefreshCw size={14} />
            Refresh Table
          </button>
        </div>

        {users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <UserX size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>No operators found.</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              The user database is currently empty. Click below to manually provision an operator account.
            </p>
            <button 
              onClick={() => {
                resetAddForm();
                setIsAddModalOpen(true);
              }}
              className="btn btn-approve"
              style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#ffffff', padding: '0.75rem 1.5rem', fontWeight: 700 }}
            >
              <UserPlus size={16} />
              + Add Operator
            </button>
          </div>
        ) : (
          <div className="enterprise-table-container">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>User & Contact</th>
                  <th>Agency / Unit</th>
                  <th>Account Type</th>
                  <th>Operational Role</th>
                  <th>Clearance Level</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSuspended = user.status === 'Suspended';
                  const accountType = user.accountType || (user.role === 'Admin' ? 'Admin' : 'Operator');
                  const roleName = user.operationalRole || user.role || 'Dispatcher';

                  return (
                    <tr key={user._id} style={{ opacity: isSuspended ? 0.75 : 1 }}>
                      {/* Name & Contact */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                          {user.name}
                          {user.isRootAdmin && (
                            <span style={{ marginLeft: '6px', fontSize: '0.65rem', fontWeight: 800, background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                              ROOT
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                          <Mail size={12} color="#38bdf8" /> {user.email}
                        </div>
                        {user.phone && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '1px' }}>
                            <Phone size={12} color="#10b981" /> {user.phone}
                          </div>
                        )}
                      </td>

                      {/* Agency */}
                      <td style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Building2 size={14} color="var(--text-secondary)" />
                          {user.agency || 'NDRF Central'}
                        </div>
                      </td>

                      {/* Account Type Badge */}
                      <td>
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          background: accountType === 'Admin' ? 'rgba(245, 158, 11, 0.15)' : (accountType === 'Operator' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                          color: accountType === 'Admin' ? '#f59e0b' : (accountType === 'Operator' ? '#38bdf8' : '#10b981'),
                          border: `1px solid ${accountType === 'Admin' ? 'rgba(245, 158, 11, 0.3)' : (accountType === 'Operator' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(16, 185, 129, 0.3)')}`
                        }}>
                          {accountType}
                        </span>
                      </td>

                      {/* Operational Role Badge */}
                      <td>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid var(--border-color)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px'
                        }}>
                          {roleName}
                        </span>
                      </td>

                      {/* Clearance Level Badge */}
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          background: 'rgba(147, 51, 234, 0.15)',
                          color: '#c084fc',
                          border: '1px solid rgba(147, 51, 234, 0.35)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Shield size={12} color="#c084fc" />
                          LEVEL {user.clearanceLevel || 1}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          background: isSuspended ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: isSuspended ? '#f43f5e' : '#10b981',
                          border: `1px solid ${isSuspended ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          {isSuspended ? <UserX size={12} color="#f43f5e" /> : <UserCheck size={12} color="#10b981" />}
                          {user.status || 'Active'}
                        </span>
                      </td>

                      {/* Actions Buttons */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          
                          {/* [ EDIT ] */}
                          <button 
                            onClick={() => openEditModal(user)} 
                            className="btn-action"
                            title="Edit User Details"
                            style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Edit3 size={13} />
                            Edit
                          </button>

                          {/* [ CHANGE ROLE ] */}
                          <button 
                            onClick={() => openRoleChangeModal(user)} 
                            className="btn-action"
                            title="Change Role & Clearance"
                            style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <SlidersHorizontal size={13} />
                            Change Role
                          </button>

                          {/* [ SUSPEND / ACTIVATE ] */}
                          <button 
                            onClick={() => handleToggleStatus(user)} 
                            className="btn-action"
                            title={isSuspended ? "Activate Account" : "Suspend Account"}
                            style={{ 
                              background: isSuspended ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', 
                              border: `1px solid ${isSuspended ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`, 
                              color: isSuspended ? '#10b981' : '#f43f5e', 
                              padding: '0.35rem 0.65rem', 
                              borderRadius: '6px', 
                              cursor: 'pointer', 
                              fontSize: '0.75rem', 
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {isSuspended ? <Check size={13} /> : <Lock size={13} />}
                            {isSuspended ? 'Activate' : 'Suspend'}
                          </button>

                          {/* [ DELETE ] */}
                          <button 
                            onClick={() => setDeletingUser(user)} 
                            className="btn-action"
                            title="Delete User"
                            disabled={user.isRootAdmin}
                            style={{ 
                              background: 'rgba(239, 68, 68, 0.1)', 
                              border: '1px solid rgba(239, 68, 68, 0.3)', 
                              color: '#ef4444', 
                              padding: '0.35rem 0.5rem', 
                              borderRadius: '6px', 
                              cursor: user.isRootAdmin ? 'not-allowed' : 'pointer',
                              opacity: user.isRootAdmin ? 0.4 : 1
                            }}
                          >
                            <Trash2 size={13} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 1. ADD USER MODAL                          */}
      {/* ========================================== */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '560px' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <UserPlus size={20} color="#10b981" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>Add New User (RBAC)</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Create access credentials, set account type & security clearance</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              
              {/* Full Name & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Inspector Ramesh Kumar" 
                    value={addName} 
                    onChange={e => setAddName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Official Email *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="r.kumar@ndrf.gov.in" 
                    value={addEmail} 
                    onChange={e => setAddEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {/* Phone & Agency */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="+91 98765 43210" 
                    value={addPhone} 
                    onChange={e => setAddPhone(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Agency / Unit *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. NDRF 8th Battalion" 
                    value={addAgency} 
                    onChange={e => setAddAgency(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {/* Account Type Selection */}
              <div className="form-group">
                <label className="form-label">Account Type *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {['Admin', 'Operator', 'Citizen'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setAddAccountType(type);
                        if (type === 'Admin') setAddOperationalRole('System Administrator');
                        else if (type === 'Citizen') setAddOperationalRole('Citizen');
                        else setAddOperationalRole('Dispatcher');
                      }}
                      style={{
                        padding: '0.6rem',
                        borderRadius: '8px',
                        border: addAccountType === type ? '1px solid #10b981' : '1px solid var(--border-color)',
                        background: addAccountType === type ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                        color: addAccountType === type ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Operational Role (Only for Operator Account Type) */}
              {addAccountType === 'Operator' && (
                <div className="form-group">
                  <label className="form-label">Operational Role *</label>
                  <NexusSelect 
                    value={addOperationalRole} 
                    onChange={(e, val) => setAddOperationalRole(val)}
                    options={[
                      { value: 'Dispatcher', label: 'Dispatcher (Incident intake & unit routing)' },
                      { value: 'Analyst', label: 'Analyst (AI telemetry & risk assessment)' },
                      { value: 'Commander', label: 'Commander (Field tactical command)' }
                    ]}
                  />
                </div>
              )}

              {/* Admin Notice */}
              {addAccountType === 'Admin' && (
                <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.78rem', color: '#f59e0b', marginBottom: '1rem' }}>
                  Note: Admin accounts are assigned operational role <strong>System Administrator</strong> with full governance capabilities.
                </div>
              )}

              {/* Clearance Level & Account Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Security Clearance Level</label>
                  <NexusSelect 
                    value={addClearanceLevel} 
                    onChange={(e, val) => setAddClearanceLevel(Number(val))}
                    options={[
                      { value: 1, label: 'Level 1 - Basic View Access' },
                      { value: 2, label: 'Level 2 - Standard Operational Access' },
                      { value: 3, label: 'Level 3 - Advanced Operational Access' },
                      { value: 4, label: 'Level 4 - Command-Level Access' },
                      { value: 5, label: 'Level 5 - Highest Operational Clearance' }
                    ]}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Status</label>
                  <NexusSelect 
                    value={addStatus} 
                    onChange={(e, val) => setAddStatus(val)}
                    options={[
                      { value: 'Active', label: 'Active (Allowed to log in)' },
                      { value: 'Suspended', label: 'Suspended (Access blocked)' }
                    ]}
                  />
                </div>
              </div>


              {/* Initial Password */}
              <div className="form-group">
                <label className="form-label">Password / Station Credential</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Set account password" 
                  value={addPassword} 
                  onChange={e => setAddPassword(e.target.value)} 
                  required 
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-dismiss" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-approve" style={{ flex: 2, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', fontWeight: 800 }}>
                  {isSubmitting ? 'Saving User...' : 'Create User'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. EDIT USER MODAL                         */}
      {/* ========================================== */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '560px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <Edit3 size={20} color="#38bdf8" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>Edit User Profile</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Modify profile, agency, clearance tier, and status</p>
                </div>
              </div>
              <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editName} 
                    onChange={e => setEditName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={editEmail} 
                    onChange={e => setEditEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editPhone} 
                    onChange={e => setEditPhone(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Agency / Unit</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editAgency} 
                    onChange={e => setEditAgency(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Account Type</label>
                <NexusSelect 
                  value={editAccountType} 
                  onChange={(e, type) => {
                    setEditAccountType(type);
                    if (type === 'Admin') setEditOperationalRole('System Administrator');
                    else if (type === 'Citizen') setEditOperationalRole('Citizen');
                    else setEditOperationalRole('Dispatcher');
                  }}
                  options={['Admin', 'Operator', 'Citizen']}
                />
              </div>

              {editAccountType === 'Operator' && (
                <div className="form-group">
                  <label className="form-label">Operational Role</label>
                  <NexusSelect 
                    value={editOperationalRole} 
                    onChange={(e, val) => setEditOperationalRole(val)}
                    options={['Dispatcher', 'Analyst', 'Commander']}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Clearance Level</label>
                  <NexusSelect 
                    value={editClearanceLevel} 
                    onChange={(e, val) => setEditClearanceLevel(Number(val))}
                    options={[
                      { value: 1, label: 'Level 1 - Basic View Access' },
                      { value: 2, label: 'Level 2 - Standard Operational Access' },
                      { value: 3, label: 'Level 3 - Advanced Operational Access' },
                      { value: 4, label: 'Level 4 - Command-Level Access' },
                      { value: 5, label: 'Level 5 - Highest Operational Clearance' }
                    ]}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Status</label>
                  <NexusSelect 
                    value={editStatus} 
                    onChange={(e, val) => setEditStatus(val)}
                    options={['Active', 'Suspended']}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password (Leave blank to keep existing)</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••••••" 
                  value={editPassword} 
                  onChange={e => setEditPassword(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingUser(null)} className="btn btn-dismiss" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-approve" style={{ flex: 2, background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', fontWeight: 800 }}>
                  {isSubmitting ? 'Updating...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. CHANGE ROLE QUICK MODAL                 */}
      {/* ========================================== */}
      {roleChangeUser && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <SlidersHorizontal size={20} color="#f59e0b" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Change Role & Clearance</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Target: {roleChangeUser.name}</p>
                </div>
              </div>
              <button onClick={() => setRoleChangeUser(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveRoleChange}>
              
              <div className="form-group">
                <label className="form-label">Account Type</label>
                <NexusSelect 
                  value={quickAccountType} 
                  onChange={(e, type) => {
                    setQuickAccountType(type);
                    if (type === 'Admin') setQuickOperationalRole('System Administrator');
                    else if (type === 'Citizen') setQuickOperationalRole('Citizen');
                    else setQuickOperationalRole('Dispatcher');
                  }}
                  options={['Admin', 'Operator', 'Citizen']}
                />
              </div>

              {quickAccountType === 'Operator' && (
                <div className="form-group">
                  <label className="form-label">Operational Role</label>
                  <NexusSelect 
                    value={quickOperationalRole} 
                    onChange={(e, val) => setQuickOperationalRole(val)}
                    options={['Dispatcher', 'Analyst', 'Commander']}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Security Clearance Level</label>
                <NexusSelect 
                  value={quickClearanceLevel} 
                  onChange={(e, val) => setQuickClearanceLevel(Number(val))}
                  options={[
                    { value: 1, label: 'Level 1 - Basic View Access' },
                    { value: 2, label: 'Level 2 - Standard Operational Access' },
                    { value: 3, label: 'Level 3 - Advanced Operational Access' },
                    { value: 4, label: 'Level 4 - Command-Level Access' },
                    { value: 5, label: 'Level 5 - Highest Operational Clearance' }
                  ]}
                />
              </div>


              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setRoleChangeUser(null)} className="btn btn-dismiss" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-approve" style={{ flex: 2, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', fontWeight: 800 }}>
                  {isSubmitting ? 'Saving...' : 'Apply Role Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. DELETE CONFIRMATION MODAL               */}
      {/* ========================================== */}
      {deletingUser && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '440px' }}>
            
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <AlertTriangle size={28} color="#ef4444" />
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Confirm User Revocation</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                Are you sure you want to delete access for user <strong style={{ color: '#ffffff' }}>{deletingUser.name}</strong> ({deletingUser.email})? This action will purge station credentials and create an audit log.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setDeletingUser(null)} className="btn btn-dismiss" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelete} 
                  className="btn" 
                  style={{ flex: 1, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#ffffff', fontWeight: 800, border: 'none' }}
                >
                  Delete User
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
