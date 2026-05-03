"use client";

import { useState } from "react";
import { UserPlus, Edit, Save, X, Trash2, Key } from "lucide-react";

export const UserManagement = ({ initialUsers }: { initialUsers: any[] }) => {
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ 
    username: "", 
    password: "", 
    realName: "", 
    gradeClass: "", 
    role: "STUDENT" 
  });
  const [editForm, setEditForm] = useState({ 
    username: "", 
    password: "", 
    realName: "", 
    gradeClass: "", 
    role: "STUDENT" 
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      const created = await res.json();
      setUsers([...users, created]);
      setNewUser({ username: "", password: "", realName: "", gradeClass: "", role: "STUDENT" });
    }
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(users.map(u => u.id === id ? updated : u));
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create User Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#ec3750]" />
          新增成員
        </h3>
        <form onSubmit={handleCreate} className="grid md:grid-cols-5 gap-4">
          <input
            placeholder="帳號 (ryan)"
            value={newUser.username}
            onChange={e => setNewUser({...newUser, username: e.target.value})}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ec3750] outline-none"
            required
          />
          <input
            placeholder="真實姓名"
            value={newUser.realName}
            onChange={e => setNewUser({...newUser, realName: e.target.value})}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ec3750] outline-none"
          />
          <input
            placeholder="年級班級 (101)"
            value={newUser.gradeClass}
            onChange={e => setNewUser({...newUser, gradeClass: e.target.value})}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ec3750] outline-none"
          />
          <input
            type="password"
            placeholder="密碼"
            value={newUser.password}
            onChange={e => setNewUser({...newUser, password: e.target.value})}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ec3750] outline-none"
            required
          />
          <button type="submit" className="bg-[#ec3750] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#ff4d66] transition-colors">
            新增
          </button>
        </form>
      </div>

      {/* User List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 font-bold text-slate-700">帳號</th>
              <th className="px-6 py-4 font-bold text-slate-700">姓名</th>
              <th className="px-6 py-4 font-bold text-slate-700">班級</th>
              <th className="px-6 py-4 font-bold text-slate-700">身分</th>
              <th className="px-6 py-4 font-bold text-slate-700 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <input 
                      value={editForm.username} 
                      onChange={e => setEditForm({...editForm, username: e.target.value})}
                      className="w-full px-2 py-1 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-[#ec3750]"
                    />
                  ) : user.username}
                </td>
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <input 
                      value={editForm.realName} 
                      onChange={e => setEditForm({...editForm, realName: e.target.value})}
                      className="w-full px-2 py-1 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-[#ec3750]"
                    />
                  ) : user.realName}
                </td>
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <input 
                      value={editForm.gradeClass} 
                      onChange={e => setEditForm({...editForm, gradeClass: e.target.value})}
                      className="w-full px-2 py-1 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-[#ec3750]"
                    />
                  ) : user.gradeClass}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'LEADER' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === user.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleUpdate(user.id)} className="text-green-600 hover:text-green-700"><Save className="w-5 h-5" /></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-500"><X className="w-5 h-5" /></button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingId(user.id);
                          setEditForm({ ...user, password: "" });
                        }} 
                        className="text-slate-400 hover:text-[#ec3750]"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
