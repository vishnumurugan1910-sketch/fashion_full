'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleId: string;
  status: string;
  createdAt: string;
}

interface Role {
  _id: string;
  name: string;
  color: string;
}

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roleId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      let userData: User[] = [];
      let roleData: Role[] = [];
      
      try {
        const uRes = await fetch(`${baseUrl}/api/users`);
        if (uRes.ok) {
          const u = await uRes.json();
          userData = (u.users || u || []).filter((u: User) => u.roleId);
        }
      } catch {}
      
      try {
        const rRes = await fetch(`${baseUrl}/api/roles`);
        if (rRes.ok) roleData = await rRes.json();
      } catch {}
      
      setUsers(userData);
      setRoles(roleData);
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.roleId) return;
    setSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          role: 'admin',
        }),
      });
      
      if (res.ok) {
        setModalOpen(false);
        setNewUser({ name: '', email: '', phone: '', password: '', roleId: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateUserRole = async (userId: string, roleId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId }),
      });
      fetchData();
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/users/${userId}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  const getRoleById = (roleId: string) => roles.find(r => r._id === roleId);

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
          <h1 className="text-2xl font-semibold text-white">Team Members</h1>
          <p className="text-sm text-white/40 mt-1">Manage staff accounts and roles</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg hover:bg-[#b8944f]"
        >
          Add Team Member
        </motion.button>
      </div>

      {modalOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 uppercase">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">Phone</label>
              <input
                type="tel"
                value={newUser.phone}
                onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase">Role</label>
            <select
              value={newUser.roleId}
              onChange={e => setNewUser({ ...newUser, roleId: e.target.value })}
              className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#c9a96e] focus:outline-none"
            >
              <option value="">Select role</option>
              {roles.map(role => (
                <option key={role._id} value={role._id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={addUser}
              disabled={saving || !newUser.name || !newUser.email || !newUser.password || !newUser.roleId}
              className="px-4 py-2 bg-[#c9a96e] text-black text-sm font-medium rounded-lg hover:bg-[#b8944f] disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Member'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => {
          const role = getRoleById(user.roleId);
          return (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/5 rounded-xl p-5"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: role?.color || '#c9a96e' }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-medium">{user.name}</h3>
                  <p className="text-xs text-white/40">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/40">Role</label>
                  <select
                    value={user.roleId}
                    onChange={e => updateUserRole(user._id, e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  >
                    {roles.map(role => (
                      <option key={role._id} value={role._id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40">Status</label>
                  <select
                    value={user.status || 'active'}
                    onChange={e => updateUserStatus(user._id, e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="w-full mt-3 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/20"
                >
                  Remove Member
                </button>
              </div>
            </motion.div>
          );
        })}
        {users.length === 0 && (
          <div className="col-span-full text-center py-12 text-white/25">
            No team members yet. Create roles first, then add team members.
          </div>
        )}
      </div>
    </div>
  );
}