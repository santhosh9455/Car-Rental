import { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Header } from "../components";
import { Modal } from "@mui/material";
import { IconEye, IconEdit, IconTrash, IconX, IconPlus, IconUpload } from "@tabler/icons-react";
import Swal from "sweetalert2";
import api from "../../../utils/api";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view, edit
  const [selectedUser, setSelectedUser] = useState(null);

  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    isUser: false,
    isVendor: false,
    isAdmin: false,
    password: "", // for Add User
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { page, pageSize } = paginationModel;
      const res = await api.get(
        `/api/admin/users?page=${page + 1}&limit=${pageSize}&search=${searchQuery}`
      );
      setUsers(res.data.users);
      setTotalRowCount(res.data.total);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Could not fetch users", "error");
    } finally {
      setLoading(false);
    }
  }, [paginationModel, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 })); // reset to first page on search
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/admin/users/${id}`);
        Swal.fire("Deleted!", "The user has been deleted.", "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Error", "Could not delete user", "error");
      }
    }
  };

  const openModal = (user, mode) => {
    setModalMode(mode);
    setSelectedFile(null);
    if (mode === "edit" || mode === "view") {
      setSelectedUser(user);
      setEditForm({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        isUser: user.isUser || false,
        isVendor: user.isVendor || false,
        isAdmin: user.isAdmin || false,
      });
    } else if (mode === "add") {
      setSelectedUser(null);
      setEditForm({
        username: "",
        email: "",
        phoneNumber: "",
        isUser: true,
        isVendor: false,
        isAdmin: false,
        password: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", editForm.username);
      formData.append("email", editForm.email);
      formData.append("phoneNumber", editForm.phoneNumber);
      formData.append("isUser", editForm.isUser);
      formData.append("isVendor", editForm.isVendor);
      formData.append("isAdmin", editForm.isAdmin);
      if (selectedFile) formData.append("image", selectedFile);

      if (modalMode === "add") {
        formData.append("password", editForm.password);
        await api.post(`/api/admin/users`, formData);
        Swal.fire("Added!", "User has been created.", "success");
      } else {
        await api.put(`/api/admin/users/${selectedUser._id}`, formData);
        Swal.fire("Updated!", "User has been updated.", "success");
      }
      
      closeModal();
      fetchUsers();
    } catch (error) {
      Swal.fire("Error", "Could not save user", "error");
    }
  };

  const columns = [
    {
      field: "profilePicture",
      headerName: "Avatar",
      width: 80,
      renderCell: (params) => (
        <img
          src={params.value || "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE="}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover my-auto bg-slate-100"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE=" }}
        />
      ),
    },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone", flex: 1 },
    { 
      field: "role", 
      headerName: "Role", 
      width: 150,
      renderCell: (params) => {
        const roles = [];
        if (params.row.isAdmin) roles.push("Admin");
        if (params.row.isVendor) roles.push("Vendor");
        if (params.row.isUser || roles.length === 0) roles.push("User");
        
        return (
          <div className="flex gap-1 flex-wrap">
            {roles.map(r => (
              <span key={r} className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                r === 'Admin' ? 'bg-red-100 text-red-700' : 
                r === 'Vendor' ? 'bg-purple-100 text-purple-700' : 
                'bg-blue-100 text-blue-700'
              }`}>
                {r}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => openModal(params.row, "view")} className="text-slate-500 hover:text-slate-800">
            <IconEye size={18} />
          </button>
          <button onClick={() => openModal(params.row, "edit")} className="text-blue-500 hover:text-blue-800">
            <IconEdit size={18} />
          </button>
          <button onClick={() => handleDelete(params.row.id)} className="text-red-500 hover:text-red-800">
            <IconTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  const rows = users.map((u) => ({ ...u, id: u._id }));

  return (
    <>
      <div className="w-full p-4 md:p-10 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Header title="All Users" />
            <button
              onClick={() => openModal(null, "add")}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm font-medium"
            >
              <IconPlus size={18} /> Add User
            </button>
          </div>
          <div className="flex">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-400"
          />
          </div>All Users



        </div>
        
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <Box sx={{ height: "70vh", width: "100%", overflowX: "auto" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              paginationMode="server"
              rowCount={totalRowCount}
              loading={loading}
              pageSizeOptions={[5, 10, 20,50 , 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                ".MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f8fafc",
                  color: "#334155",
                  fontWeight: 600,
                },
                ".MuiDataGrid-columnSeparator": { display: "none" },
                ".MuiDataGrid-row:hover": { backgroundColor: "#f1f5f9" },
                ".MuiDataGrid-cell": { borderBottom: "1px solid #f1f5f9" },
              }}
            />
          </Box>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={closeModal}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 outline-none">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-slate-800">
              {modalMode === "view" ? "User Details" : modalMode === "add" ? "Add User" : "Edit User"}
            </h2>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
              <IconX size={20} />
            </button>
          </div>

          {modalMode === "view" && selectedUser && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <img src={selectedUser.profilePicture || "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE="} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-slate-100 object-cover bg-slate-100" onError={(e) => { e.target.onerror = null; e.target.src = "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE=" }} />
              </div>
              <div><span className="font-semibold text-slate-500 w-24 inline-block">ID:</span> {selectedUser._id}</div>
              <div><span className="font-semibold text-slate-500 w-24 inline-block">Username:</span> {selectedUser.username}</div>
              <div><span className="font-semibold text-slate-500 w-24 inline-block">Email:</span> {selectedUser.email}</div>
              <div><span className="font-semibold text-slate-500 w-24 inline-block">Phone:</span> {selectedUser.phoneNumber || "N/A"}</div>
              <div>
                <span className="font-semibold text-slate-500 w-24 inline-block">Roles:</span> 
                {selectedUser.isAdmin && <span className="mr-1 text-red-600">Admin</span>}
                {selectedUser.isVendor && <span className="mr-1 text-purple-600">Vendor</span>}
                {selectedUser.isUser && <span className="mr-1 text-blue-600">User</span>}
              </div>
              <div><span className="font-semibold text-slate-500 w-24 inline-block">Joined:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
            </div>
          )}

          {(modalMode === "edit" || modalMode === "add") && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="relative w-24 h-24 mb-2">
                  <img 
                    src={selectedFile ? URL.createObjectURL(selectedFile) : (selectedUser?.profilePicture || "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE=")} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-100"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE=" }}
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition">
                    <IconUpload size={14} />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                  </label>
                </div>
                <span className="text-xs text-slate-500">Upload Profile Image</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                <input required type="text" value={editForm.username} onChange={(e) => setEditForm({...editForm, username: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input required type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
              
              {modalMode === "add" && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                  <input required type="password" value={editForm.password} onChange={(e) => setEditForm({...editForm, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                <input type="text" value={editForm.phoneNumber} onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Roles</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editForm.isUser} onChange={(e) => setEditForm({...editForm, isUser: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-slate-700">User</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editForm.isVendor} onChange={(e) => setEditForm({...editForm, isVendor: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-slate-700">Vendor</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editForm.isAdmin} onChange={(e) => setEditForm({...editForm, isAdmin: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-slate-700">Admin</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 mt-6 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-2 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {modalMode === "add" ? "Create User" : "Save Changes"}
                </button>
                </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AllUsers;