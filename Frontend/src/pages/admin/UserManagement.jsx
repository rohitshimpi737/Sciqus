import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  MoreVertical,
  UserCheck,
  UserX
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await adminAPI.getAllUsers();
        
        // Your backend returns data directly as an array, not wrapped in {success, data}
        if (response.data && Array.isArray(response.data)) {
          const users = response.data;
          setUsers(users);
          setFilteredUsers(users);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        
        // More specific error handling
        let errorMessage = 'Unable to connect to server';
        if (error.response) {
          // Server responded with error status
          errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = 'Cannot connect to backend server. Is it running on localhost:8080?';
        } else {
          // Something else happened
          errorMessage = error.message || 'Unknown error occurred';
        }
        
        setError(errorMessage);
        
        // Fallback to mock data if API fails
        const mockUsers = [
          {
            id: 1,
            username: 'john.doe',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+1234567890',
            role: 'STUDENT',
            isActive: true,
            createdAt: '2024-01-15',
            lastLogin: '2024-08-14'
          },
          {
            id: 2,
            username: 'jane.smith',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phoneNumber: '+1234567891',
            role: 'ADMIN',
            isActive: true,
            createdAt: '2024-01-10',
            lastLogin: '2024-08-15'
          },
          {
            id: 3,
            username: 'mike.johnson',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@example.com',
            phoneNumber: '+1234567892',
            role: 'STUDENT',
            isActive: false,
            createdAt: '2024-02-20',
            lastLogin: '2024-07-30'
          },
          {
            id: 4,
            username: 'sarah.wilson',
            firstName: 'Sarah',
            lastName: 'Wilson',
            email: 'sarah.wilson@example.com',
            phoneNumber: '+1234567893',
            role: 'ADMIN',
            isActive: true,
            createdAt: '2024-01-05',
            lastLogin: '2024-08-14'
          },
          {
            id: 5,
            username: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@sciqus.com',
            phoneNumber: '+1234567894',
            role: 'ADMIN',
            isActive: true,
            createdAt: '2024-01-01',
            lastLogin: '2024-08-15'
          }
        ];
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and role
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => {
        if (selectedStatus === 'active') return user.isActive === true;
        if (selectedStatus === 'inactive') return user.isActive === false;
        return true;
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowAddUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowAddUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await adminAPI.deleteUser(userId);
        
        // Assuming successful delete returns success status or 200 OK
        if (response.status === 200 || response.status === 204) {
          setUsers(users.filter(user => user.id !== userId));
          alert('User deleted successfully!');
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user. Please try again.');
        
        // Still update UI for demo purposes if API fails
        setUsers(users.filter(user => user.id !== userId));
      }
    }
  };

  const handleToggleUserStatus = async (user) => {
    const action = user.isActive ? 'deactivate' : 'activate';
    const actionText = user.isActive ? 'deactivate' : 'activate';
    
    if (confirm(`Are you sure you want to ${actionText} ${user.firstName} ${user.lastName}?`)) {
      try {
        const response = user.isActive 
          ? await adminAPI.deactivateUser(user.id)
          : await adminAPI.activateUser(user.id);
        
        if (response.status === 200) {
          // Update the user's status in the local state
          setUsers(users.map(u => 
            u.id === user.id ? { ...u, isActive: !u.isActive } : u
          ));
          alert(`User ${actionText}d successfully!`);
        } else {
          throw new Error(`Failed to ${actionText} user`);
        }
      } catch (error) {
        console.error(`Failed to ${actionText} user:`, error);
        alert(`Failed to ${actionText} user. Please try again.`);
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage all users in your system</p>
          {error && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                API connection issue: Using offline mode. {error}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="STUDENT">Student</option>
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username} • {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit user"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user)}
                        className={`${
                          user.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                        }`}
                        title={user.isActive ? 'Deactivate user' : 'Activate user'}
                      >
                        {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <AddUserModal
          user={selectedUser}
          onClose={() => {
            setShowAddUserModal(false);
            setSelectedUser(null);
          }}
          onSave={async (userData) => {
            try {
              if (selectedUser) {
                // Update existing user
                const response = await adminAPI.updateUser(selectedUser.id, userData);
                
                // Assuming your backend returns the updated user object or 200 OK
                if (response.status === 200 && response.data) {
                  // Use the updated user data from backend response
                  const updatedUser = response.data;
                  setUsers(users.map(user => 
                    user.id === selectedUser.id ? updatedUser : user
                  ));
                  alert('User updated successfully!');
                } else {
                  throw new Error('Failed to update user');
                }
              } else {
                // Add new user  
                const response = await adminAPI.createUser(userData);
                
                // Assuming your backend returns the created user object
                if (response.status === 200 || response.status === 201) {
                  const newUser = response.data;
                  setUsers([...users, newUser]);
                  alert('User created successfully!');
                } else {
                  throw new Error('Failed to create user');
                }
              }
            } catch (error) {
              console.error('Failed to save user:', error);
              alert('Failed to save user: ' + error.message);
              
              // Fallback: Still update UI for demo purposes
              if (selectedUser) {
                setUsers(users.map(user => 
                  user.id === selectedUser.id ? { ...user, ...userData } : user
                ));
              } else {
                const newUser = {
                  ...userData,
                  id: Date.now(),
                  isActive: true,
                  role: userData.role || 'STUDENT'
                };
                setUsers([...users, newUser]);
              }
            }
            
            setShowAddUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

// Add/Edit User Modal Component
const AddUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    password: '', // Required for new users
    courseId: user?.courseId || '',
    role: user?.role || 'STUDENT' // Add role field
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // For edit mode, only send fields that backend accepts for update
    let dataToSend;
    if (user) {
      // For updates: only firstName, lastName, phoneNumber, courseId
      dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        courseId: formData.courseId || null
      };
    } else {
      // For creates: send all fields including username, email, password, role
      dataToSend = { ...formData };
      if (!formData.password) {
        delete dataToSend.password;
      }
    }
    
    await onSave(dataToSend);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {user ? 'Edit User' : 'Add New User'}
        </h3>
        {user && (
          <p className="text-sm text-gray-600 mb-4">
            Only name, phone number, and course assignment can be updated.
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username {user && <span className="text-gray-500">(cannot be changed)</span>}
            </label>
            <input
              type="text"
              required={!user}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!!user}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                user ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email {user && <span className="text-gray-500">(cannot be changed)</span>}
            </label>
            <input
              type="email"
              required={!user}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!user}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                user ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +1234567890"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {user && <span className="text-gray-500">(cannot be changed here)</span>}
            </label>
            <input
              type="password"
              required={!user}
              placeholder={user ? "Password changes not supported" : "Enter password"}
              value={user ? '' : formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={!!user}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                user ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course ID (Optional)
            </label>
            <input
              type="text"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Assign to course (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role {user && <span className="text-gray-500">(cannot be changed)</span>}
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={!!user}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                user ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : (user ? 'Update' : 'Create')} User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
