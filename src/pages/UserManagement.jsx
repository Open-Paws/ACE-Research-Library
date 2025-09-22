import React, { useState } from 'react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  const users = [
    {
      id: 1,
      name: 'Olivia Rhye',
      email: 'olivia@untitledui.com',
      role: 'Admin',
      lastLogin: '3 days ago',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi1HmPgCVv6D_34AisCufzaQpwddVVZ1e-LO1KAGXxsYPQ8_3M08z1DApye1iFc5Exds4OQN8c8JI28opgGqywzpgJ9kR4RcWucBsK5GfmjwcqlDHlBCde9aHszBIYNOT6y5TO2K9tpfITeIUREvB-EjvufaV0Yxxy_z65APtAQ0OM1skL-yLSQXD6S5j9tyoe0wS7fXzbGP0sVdxtjWy--3ewOUrPhLut8ga1qOf10JEkjL8cm7K2s_D9lI95QYHTpmm2kOzrsaea'
    },
    {
      id: 2,
      name: 'Phoenix Baker',
      email: 'phoenix@untitledui.com',
      role: 'Editor',
      lastLogin: '1 week ago',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE7wGdSwlZDnefJjhVbJU9fSDsYKWPBHY50JSZOO6157ES0Hu19AZ6nCbpNrDZywr0nNt0RQ87cXWvTofDBwV198H8a4KsF8fNfUstHUhw-hA8a98D4e7KWP4AoDdsPdj08RbfQvUzhAFldvGzLZfCh2WPZkfXjlWCzIen77-WVYAjfuY9vkfvxg9kWvDfrLcoUMIPxdJaXLELEaYunkdrP5tpL3wTd_32GDK0NL6vXZ2GlELCF3bJtrsmGM25hhk0Xw_QAU7umEgR'
    },
    {
      id: 3,
      name: 'Lana Steiner',
      email: 'lana@untitledui.com',
      role: 'Viewer',
      lastLogin: '2 weeks ago',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9IWMGX0oirDO-jEc-g_pIn_b4sUAwB1bIlwU8l6zpvASGYIUn145ig1OCi0B2xY3ufg3B3CQ_P8GqtsoxU78SU_h0CRqHAIDaoq9L5q24yh-IOwIy6VhujrqNsUhNIov-UEhB92XGSUZdJdTEG1JZzCZzSKiiO1M4wYqjfo0HMpOs7oIDZ3Xq8DGm8_qh2H4nCNjKGnUdJhif4lXVsbIF823AsSlmJMnh-Sz_WO1fghkW2nD6LMm3PFicnh7skk-mLeMT-HC4k35i'
    },
    {
      id: 4,
      name: 'Demi Wilkinson',
      email: 'demi@untitledui.com',
      role: 'Editor',
      lastLogin: '1 month ago',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsmjzEjw2kgUkrEEMfxVxbqwSgvao5qVf8bpQDhD7JQzYn_Tp0AA7rhqhG0IjP1JaaN4k-Y2LYeZTkT8loUKqqKTkR4_7PjNqWvhpqDJv7TsiTFXUsl4rB5izFlH0Wce1xWxRs9xIAe2MXVz8pJBB_g5blZSWpfIRvMiNIxFVljXDLz81lkkphqIhi_Zi2k4dta42bLMW-4FNL86WczzXgmgS7kkLF4CF7pWiNoisyqw4cBOFg_HSLmSqWNgzc1d9BSPphlo44Wd2B'
    },
    {
      id: 5,
      name: 'Candice Wu',
      email: 'candice@untitledui.com',
      role: 'Viewer',
      lastLogin: '1 month ago',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7OkKGCIw8qwIsDRC4HDKDf2hERsNwcWdDlO8BCpOsS20rFHotYDeYgVpOARBeTQIRYRw11poqfS7LFoyhOqf_BzvPsz3QPuuwxOvcWBYHg3D_PQ4lpfYl5kixQUEkSx0J-JZ4qe1SIn9gDoSimPaJJi8DcZ_2YEaTFSm4njOmS4jgDOoFBS597lNuqewumknoWyrHzJibfuDmmGiEN_yKcbf30Y_YtsUme2nZkrme2e4_4Dx_4aeUeu0BUWufl7TCUKKI2vcNHCoS'
    },
    {
      id: 6,
      name: 'Natali Craig',
      email: 'natali@untitledui.com',
      role: 'Editor',
      lastLogin: '2 months ago',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBShRgj_skaVvTuCpU5AQLvp9qMqXSNLGzmHTP081E_BKDemIMV8StONl148RRa1_ulK9gc85APe2yVDo-_eF0yac-RyrxNJn7OYbduWYngDlRnYcYXI3cX_DPuzT02hSqolA22FUeBoNY7EjfJPRRyZLVWeIn2Y7Y-T_Wvy0mAXfe5e5oVZ9iNjVywLm3defpxjWkextUUwmSEmadXrMZgohV8P6N5cXyegMPgDR5tZceZxOI1EfJ7OETsZt_voAhsRyDF4tb16b4p'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All Roles' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    if (role === 'Admin') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900/70 text-light-mint">
          <span className="w-2 h-2 mr-2 bg-neon-green rounded-full"></span>
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
        {role}
      </span>
    );
  };

  return (
    <main className="flex-grow w-full px-4 sm:px-6 lg:px-14 py-8">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">User Management</h2>
            <p className="text-slate-400 mt-1">Manage roles and permissions for all users in your workspace.</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-emerald-500 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-base">add</span>
            <span className="truncate text-sm">Add New User</span>
          </button>
        </div>

        <div className="bg-card-dark rounded-xl border border-slate-800">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                <input
                  className="form-input w-full rounded-lg border-slate-700 bg-background-dark py-2.5 pl-11 pr-4 placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Search users by name or email..."
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  className="form-select appearance-none w-48 rounded-lg border-slate-700 bg-background-dark py-2.5 pl-4 pr-10 text-slate-300 focus:ring-2 focus:ring-primary focus:border-primary"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">expand_more</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/30">
                <tr>
                  <th className="px-6 py-4 font-medium" scope="col">User</th>
                  <th className="px-6 py-4 font-medium" scope="col">Role</th>
                  <th className="px-6 py-4 font-medium" scope="col">Last Login</th>
                  <th className="px-6 py-4 font-medium text-right" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img alt={`${user.name} avatar`} className="h-10 w-10 rounded-full" src={user.avatar} />
                        <div>
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{user.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-md hover:bg-slate-700 transition-colors">
                          <span className="material-symbols-outlined text-slate-400 text-lg">edit</span>
                        </button>
                        <button className="p-2 rounded-md hover:bg-slate-700 transition-colors">
                          <span className="material-symbols-outlined text-slate-400 text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-800 flex justify-between items-center text-sm text-slate-400">
            <div>
              <p>Page 1 of 10</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700/50 transition-colors">Previous</button>
              <button className="px-3 py-1.5 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700/50 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserManagement;
