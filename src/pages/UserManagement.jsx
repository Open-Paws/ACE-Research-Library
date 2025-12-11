import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const UserManagement = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
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
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--primary-10)', color: 'var(--ace-teal)', fontFamily: "'Inter', sans-serif" }}>
          <span className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: 'var(--ace-teal)' }}></span>
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--ace-navy-10)', color: 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
        {role}
      </span>
    );
  };

  return (
    <main className="flex-grow w-full px-4 sm:px-6 lg:px-14 py-8 relative" style={{ background: 'transparent', position: 'relative', zIndex: 0 }}>
      {/* Mesh Background Elements */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(0, 166, 161, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 166, 161, 0.15) 0%, transparent 70%)',
          transform: 'translate(-20%, -20%)'
        }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl opacity-15" style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(12, 109, 171, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(12, 109, 171, 0.1) 0%, transparent 70%)',
          transform: 'translate(20%, -50%)'
        }}></div>
      </div>

      <div className="mx-auto max-w-[1360px] relative z-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1.875rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
              marginBottom: '4px'
            }}>
              User Management
            </h2>
            <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>Manage roles and permissions for all users in your workspace.</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-colors shadow-sm" style={{ backgroundColor: 'var(--ace-teal)', color: 'var(--ace-white)', fontFamily: "'Inter', sans-serif" }}>
            <span className="material-symbols-outlined text-base">add</span>
            <span className="truncate text-sm">Add New User</span>
          </button>
        </div>

        <div className={`glass-panel ${isDark ? 'glass-panel-dark' : ''} rounded-xl border`} style={{ border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)', boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(4, 28, 48, 0.1)' }}>
          <div className="p-6 border-b" style={{ borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)' }}>
            <div className="flex items-center gap-4">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(4, 28, 48, 0.4)' }}>search</span>
                <input
                  className="w-full rounded-lg py-2.5 pl-11 pr-4 transition-all duration-300"
                  placeholder="Search users by name or email..."
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                    color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'white';
                    e.target.style.borderColor = 'var(--ace-teal)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(0, 166, 161, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)';
                    e.target.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none w-48 rounded-lg py-2.5 pl-4 pr-10 transition-all duration-300"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                    color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  <option value="All Roles" style={{ backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'var(--ace-navy)' }}>All Roles</option>
                  <option value="Admin" style={{ backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'var(--ace-navy)' }}>Admin</option>
                  <option value="Editor" style={{ backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'var(--ace-navy)' }}>Editor</option>
                  <option value="Viewer" style={{ backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'var(--ace-navy)' }}>Viewer</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(4, 28, 48, 0.4)' }}>expand_more</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-navy-5)' }}>
                <tr>
                  <th className="px-6 py-4 font-medium" scope="col" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>User</th>
                  <th className="px-6 py-4 font-medium" scope="col" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Role</th>
                  <th className="px-6 py-4 font-medium" scope="col" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Last Login</th>
                  <th className="px-6 py-4 font-medium text-right" scope="col" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)' }}>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-navy-5)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img alt={`${user.name} avatar`} className="h-10 w-10 rounded-full" src={user.avatar} />
                        <div>
                          <div className="font-semibold" style={{ color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>{user.name}</div>
                          <div style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>{user.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-md transition-colors" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }} onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-2 rounded-md transition-colors" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)' }} onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(4, 28, 48, 0.1)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t flex justify-between items-center text-sm" style={{ borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--ace-navy-60)', fontFamily: "'Inter', sans-serif" }}>
            <div>
              <p>Page 1 of 10</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-md border transition-colors" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-navy-5)', color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>Previous</button>
              <button className="px-3 py-1.5 rounded-md border transition-colors" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--ace-navy-10)', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--ace-navy-5)', color: isDark ? 'var(--ace-white)' : 'var(--ace-navy)', fontFamily: "'Inter', sans-serif" }}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserManagement;
