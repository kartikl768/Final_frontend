import React, { useState } from "react";
import { useHR } from "../../contexts/HRContext";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter 
} from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "../../Helpers/ConfirmModal"; 

export default function UserManagement() {
  const { users, createUser, updateUser, deleteUser, usersLoading } = useHR();
  const { user: currentUser } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: 0 // default to Manager
  });

  // Role mapping
  const roleMapping: { [key: number]: string } = {
    0: "Manager",
    1: "HR",
    2: "Interviewer",
    3: "Candidate",
  };

  const getAvailableRoles = () => {
    if (!currentUser) return [];
    if (currentUser.Role === "HR") {
      return [
        { value: 0, label: "Manager" },
        { value: 1, label: "HR" },
        { value: 2, label: "Interviewer" }
      ];
    }
    return [
      { value: 0, label: "Manager" },
      { value: 1, label: "HR" },
      { value: 2, label: "Interviewer" },
      { value: 3, label: "Candidate" }
    ];
  };

  const roles = getAvailableRoles();

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case "Manager": return "bg-primary";
      case "HR": return "bg-success";
      case "Interviewer": return "bg-info";
      case "Candidate": return "bg-warning text-dark";
      default: return "bg-secondary";
    }
  };

  // Filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role.toString() === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      toast.success("User created successfully!");
      setShowCreateModal(false);
      setNewUser({ email: "", password: "", firstName: "", lastName: "", phone: "", role: 0 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create user.");
    }
  };

  // Edit User
  const handleEditUser = (user: any) => {
    setSelectedUser({ ...user });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser);
      toast.success("User updated successfully!");
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user.");
    }
  };

  // Delete User
  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user.");
    } finally {
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  if (usersLoading) {
    return (
      <div className="container-fluid py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold">User Management</h1>
          <p className="text-muted">Manage system users and their roles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <UserPlus size={20} className="me-2" /> Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text"><Search size={16} /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="col-md-2 d-flex align-items-center text-muted">
          <Filter size={16} className="me-1" />
          <small>{filteredUsers.length} users</small>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || '-'}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeColor(roleMapping[user.role] || 'Manager')}`}>
                        {roleMapping[user.role] || 'Manager'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td><small className="text-muted">{new Date(user.createdAt).toLocaleDateString()}</small></td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditUser(user)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(user.userId)}>
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
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-5">
          <Users size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No users found</h5>
          <p className="text-muted">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={showConfirmModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmModal(false)}
        message="Are you sure you want to delete this user?"
      />

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New User</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-control" value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} required/>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-control" value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} required/>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-control" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select className="form-select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: Number(e.target.value) })} required>
                      {roles.map(role => (<option key={role.value} value={role.value}>{role.label}</option>))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); handleUpdateUser(); }}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" value={selectedUser.firstName} onChange={e => setSelectedUser({ ...selectedUser, firstName: e.target.value })} required/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" value={selectedUser.lastName} onChange={e => setSelectedUser({ ...selectedUser, lastName: e.target.value })} required/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={selectedUser.email} onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })} required/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-control" value={selectedUser.phone} onChange={e => setSelectedUser({ ...selectedUser, phone: e.target.value })}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select className="form-select" value={selectedUser.role} onChange={e => setSelectedUser({ ...selectedUser, role: Number(e.target.value) })} required>
                      {roles.map(role => (<option key={role.value} value={role.value}>{role.label}</option>))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
  </div>
  );
}