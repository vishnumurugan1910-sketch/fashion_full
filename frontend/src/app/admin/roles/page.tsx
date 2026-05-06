'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Permission {
  resource: string;
  actions: string[];
}

interface Role {
  _id?: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  isActive: boolean;
  color: string;
}

const resources = [
  { name: 'products', label: 'Products', actions: ['view', 'create', 'edit', 'delete'] },
  { name: 'inventory', label: 'Inventory', actions: ['view', 'edit'] },
  { name: 'categories', label: 'Categories', actions: ['view', 'create', 'edit', 'delete'] },
  { name: 'orders', label: 'Orders', actions: ['view', 'edit', 'delete'] },
  { name: 'customers', label: 'Customers', actions: ['view', 'edit'] },
  { name: 'reviews', label: 'Reviews', actions: ['view', 'edit', 'delete'] },
  { name: 'returns', label: 'Returns', actions: ['view', 'edit'] },
  { name: 'banners', label: 'Banners', actions: ['view', 'create', 'edit', 'delete'] },
  { name: 'stories', label: 'Stories', actions: ['view', 'create', 'edit', 'delete'] },
  { name: 'seo', label: 'SEO', actions: ['view', 'edit'] },
  { name: 'blog', label: 'Blog', actions: ['view', 'create', 'edit', 'delete'] },
  { name: 'roles', label: 'Roles', actions: ['view', 'create', 'edit', 'delete'] },
];

const colors = ['#c9a96e', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#06b6d4'];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: [],
    isDefault: false,
    isActive: true,
    color: '#c9a96e',
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/roles`);
      if (res.ok) {
        const data = await res.json();
        setRoles(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveRole = async () => {
    if (!editingRole.name) return;
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const method = editingRole._id ? 'PUT' : 'POST';
      const url = editingRole._id 
        ? `${baseUrl}/api/roles/${editingRole._id}` 
        : `${baseUrl}/api/roles`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRole),
      });
      const saved = await res.json();
      
      setRoles(prev => {
        if (editingRole._id) {
          return prev.map(r => r._id === editingRole._id ? saved : r);
        }
        return [...prev, saved];
      });
      setShowForm(false);
      setEditingRole({
        name: '',
        description: '',
        permissions: [],
        isDefault: false,
        isActive: true,
        color: '#c9a96e',
      });
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/roles/${id}`, { method: 'DELETE' });
      setRoles(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const togglePermission = (resource: string, action: string) => {
    const perms = [...(editingRole.permissions || [])];
    const existing = perms.find(p => p.resource === resource);
    
    if (existing) {
      if (existing.actions.includes(action)) {
        existing.actions = existing.actions.filter(a => a !== action);
        if (existing.actions.length === 0) {
          editingRole.permissions = perms.filter(p => p.resource !== resource);
        }
      } else {
        existing.actions = [...existing.actions, action];
      }
    } else {
      perms.push({ resource, actions: [action] });
    }
    
    setEditingRole({ ...editingRole, permissions: perms });
  };

  const hasPermission = (resource: string, action: string) => {
    return editingRole.permissions?.some(p => p.resource === resource && p.actions.includes(action)) || false;
  };

  const openEdit = (role?: Role) => {
    if (role) {
      setEditingRole({ ...role });
    } else {
      setEditingRole({ name: '', description: '', permissions: [], isDefault: false, isActive: true, color: '#c9a96e' });
    }
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">User Roles & Permissions</h1>
          <p className="text-sm text-white/40 mt-1">Manage team access and permissions</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => openEdit()}
          className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg hover:bg-[#b8944f]"
        >
          Add Role
        </motion.button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-white/40 uppercase">Role Name</label>
              <input
                type="text"
                value={editingRole.name || ''}
                onChange={e => setEditingRole({ ...editingRole, name: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
                placeholder="Role name"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">Description</label>
              <input
                type="text"
                value={editingRole.description || ''}
                onChange={e => setEditingRole({ ...editingRole, description: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">Color</label>
              <div className="flex gap-2 mt-1">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setEditingRole({ ...editingRole, color: c })}
                    className={`w-8 h-8 rounded-lg transition-all ${editingRole.color === c ? 'ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingRole.isDefault || false}
                onChange={e => setEditingRole({ ...editingRole, isDefault: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e] focus:ring-[#c9a96e]"
              />
              <span className="text-sm text-white/60">Default Role</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingRole.isActive || false}
                onChange={e => setEditingRole({ ...editingRole, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a96e] focus:ring-[#c9a96e]"
              />
              <span className="text-sm text-white/60">Active</span>
            </label>
          </div>

          <div>
            <label className="text-xs text-white/40 uppercase">Permissions</label>
            <div className="mt-2 grid grid-cols-2 lg:grid-cols-3 gap-3">
              {resources.map(res => (
                <div key={res.name} className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-white font-medium mb-2">{res.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {res.actions.map(action => (
                      <button
                        key={action}
                        onClick={() => togglePermission(res.name, action)}
                        className={`text-[10px] px-2 py-1 rounded transition-all ${
                          hasPermission(res.name, action)
                            ? 'bg-[#c9a96e] text-black'
                            : 'bg-white/10 text-white/40 hover:bg-white/20'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={saveRole}
              disabled={saving || !editingRole.name}
              className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg hover:bg-[#b8944f] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Role'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowForm(false); setEditingRole({ name: '', description: '', permissions: [], isDefault: false, isActive: true, color: '#c9a96e' }); }}
              className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(role => (
          <motion.div
            key={role._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/5 rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: role.color }}>
                  <span className="text-white font-semibold text-sm">{role.name[0]}</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">{role.name}</h3>
                  <p className="text-xs text-white/40">{role.description || 'No description'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(role)} className="p-1.5 text-white/40 hover:text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                {!role.isDefault && (
                  <button onClick={() => deleteRole(role._id!)} className="p-1.5 text-white/40 hover:text-red-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {role.permissions?.slice(0, 4).map((p, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 bg-white/10 rounded text-white/60">
                  {p.resource}
                </span>
              ))}
              {role.permissions && role.permissions.length > 4 && (
                <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded text-white/40">
                  +{role.permissions.length - 4}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {role.isDefault && <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">Default</span>}
              {!role.isActive && <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded">Inactive</span>}
            </div>
          </motion.div>
        ))}
        {roles.length === 0 && (
          <div className="col-span-full text-center py-12 text-white/25">No roles created yet</div>
        )}
      </div>
    </div>
  );
}