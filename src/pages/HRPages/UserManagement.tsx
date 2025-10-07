import React, { useState } from "react";
import { useHR } from "../../contexts/HRContext";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  UserCheck,
  UserX
} from "lucide-react";

export default function UserManagement() {
  const { users, createUser, updateUser, usersLoading } = useHR();
  const { user: currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "" // Default to empty string instead of Manager
  });

  // Define available roles based on current user's permissions
  const getAvailableRoles = () => {
    if (!currentUser) return [];
    
    // HR can only create Manager, HR, and Interviewer - NOT Candidate
    if ( currentUser.Role === "HR") {
      return [
        { value: "Manager", label: "Manager" },
        { value: "HR", label: "HR" },
        { value: "Interviewer", label: "Interviewer" }
        // Candidate is intentionally excluded for HR users
      ];
    }
    
    // For other roles (like Admin), allow all roles
    return [
      { value: "Manager", label: "Manager" },
      { value: "HR", label: "HR" },
      { value: "Interviewer", label: "Interviewer" },
      { value: "Candidate", label: "Candidate" }
    ];
  };

  const roles = getAvailableRoles();

  const filteredUsers = users.filter((user) => {
  const matchesSearch =
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesRole =
    roleFilter === "all" || user.role === Number(roleFilter);

  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "active" && user.isActive) ||
    (statusFilter === "inactive" && !user.isActive);

  return matchesSearch && matchesRole && matchesStatus;
});


  const handleCreateUser = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const roleId = Object.entries(roleMapping).find(
      ([_, name]) => name === newUser.role
    )?.[0];

    if (!roleId) {
      alert("Invalid role selected.");
      return;
    }

    await createUser({
      ...newUser,
      role: Number(roleId), // send role ID instead of name
    });

    setShowCreateModal(false);
    setNewUser({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: roles[0]?.label || "Manager",
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    alert("Failed to create user. Please try again.");
  }
};

//edit user

  const handleEditUser = (user: any) => {
    setSelectedUser({ ...user, role: roleMapping[user.role] || "Unknown Role" }); // Map role ID to name
    setShowEditModal(true);
  };
  {showEditModal && selectedUser && (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit User</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowEditModal(false)}
          ></button>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const roleId = Object.entries(roleMapping).find(
                ([_, name]) => name === selectedUser.role
              )?.[0];

              if (!roleId) {
                alert("Invalid role selected.");
                return;
              }

              await updateUser({
                ...selectedUser,
                role: Number(roleId),
              });

              setShowEditModal(false);
              setSelectedUser(null);
            } catch (error) {
              console.error("Failed to update user:", error);
              alert("Failed to update user. Please try again.");
            }
          }}
        >
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                value={selectedUser.firstName}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={selectedUser.lastName}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, lastName: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                value={selectedUser.phone}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, phone: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
                required
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.label}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
  
// Define your role mapping (adjust IDs and names as per your backend data)
const roleMapping: { [key: number]: string } = {
  0: "Manager",
  2: "HR",
  3: "Interviewer",
  4: "Candidate",
  // Add other roles as needed
};

  const getRoleBadgeColor = (roleName: string) => { // Now expects a roleName string
  switch (roleName) { // Use roleName here
    case "Manager": return "bg-primary";
    case "HR": return "bg-success";
    case "Interviewer": return "bg-info";
    case "Candidate": return "bg-warning text-dark";
    default: return "bg-secondary";
  }
};

const role = Object.entries(roleMapping).map(([id, name]) => ({
  value: id, // The value should still be the ID for filtering if your filter logic uses IDs
  label: name, // The label displayed to the user is the name
}));

  if (usersLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold">User Management</h1>
          <p className="text-muted">Manage system users and their roles</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <UserPlus size={20} className="me-2" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
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
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value.toString()}>
                {role.label}
              </option>
            ))}
          </select>


        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="col-md-2">
          <div className="d-flex align-items-center text-muted">
            <Filter size={16} className="me-1" />
            <small>{filteredUsers.length} users</small>
          </div>
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
          {filteredUsers.map((user) => (
            <tr key={user.userId}>
              {/* ID and Name */}
              <td>
                <div className="d-flex align-items-center">
                  <div className="me-3">{user.userId}</div>
                  </div>
              </td>
                <td>
                  <div>
                    <div className="fw-medium">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                
              </td>
              {/* Email */}
              <td>{user.email}</td>
              {/* Phone */}
              <td>{user.phone || '-'}</td>
              {/* Role */}
              {/* ... inside your <tbody> map ... */}
<td>
  {/* Get the role name from the mapping, using user.role (which is the ID) */}
  {/* Provide a fallback like 'Unknown Role' if the ID isn't found */}
  {(() => {
    const roleName = roleMapping[user.role] || "Unkonwn Role"; // Get the name
    return (
      <span className={`badge ${getRoleBadgeColor(roleName)}`}>
        {roleName} {/* Display the role name */}
      </span>
    );
  })()}
</td>
{/* ... rest of your table row ... */}

              {/* Status */}
              <td>
                <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              {/* Created */}
              <td>
                <small className="text-muted">
                  {new Date(user.createdAt).toLocaleDateString()}
                </small>
              </td>
              {/* Actions */}
              <td>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEditUser(user)}
                    title="Edit User"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteUser(user.userId)}
                    title="Delete User"
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
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-5">
          <Users size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No users found</h5>
          <p className="text-muted">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New User</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      required
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
