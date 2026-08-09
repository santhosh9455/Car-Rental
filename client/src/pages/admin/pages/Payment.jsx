import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { toast, Toaster } from "sonner";
import {
  IconEye,
  IconX,
  IconRefresh,
  IconCurrencyRupee,
  IconPlus,
  IconEdit,
  IconTrash
} from "@tabler/icons-react";
import { Header } from "../components";
import Swal from "sweetalert2";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState([{ field: 'createdAt', sort: 'desc' }]);
  
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reconciling, setReconciling] = useState(false);

  // CRUD Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    systemStatus: "pending",
    userId: "",
    vehicleId: ""
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const page = paginationModel.page + 1;
      const limit = paginationModel.pageSize;
      const sort = sortModel[0]?.field || "createdAt";
      const order = sortModel[0]?.sort || "desc";
      
      const res = await fetch(`/api/admin/payments?page=${page}&limit=${limit}&sort=${sort}&order=${order}`);
      const data = await res.json();
      
      if (data.success) {
        setPayments(data.data);
        setTotalCount(data.totalCount);
      } else {
        toast.error("Failed to fetch payments");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [paginationModel, sortModel]);

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleReconcile = async () => {
    if (!selectedPayment) return;
    setReconciling(true);
    try {
      const res = await fetch(`/api/admin/payments/${selectedPayment._id}/reconcile`);
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setSelectedPayment(data.data);
        fetchPayments();
      } else {
        toast.error(data.message || "Reconciliation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error reconciling payment");
    } finally {
      setReconciling(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const res = await fetch(`/api/admin/payments/${selectedPayment._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Status updated successfully");
        setSelectedPayment(data.data);
        fetchPayments();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setIsAddModalOpen(false);
        fetchPayments();
      } else {
        toast.error(data.message || "Failed to create payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating payment");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/payments/${selectedPayment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setIsEditModalOpen(false);
        fetchPayments();
      } else {
        toast.error(data.message || "Failed to update payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating payment");
    }
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
        const res = await fetch(`/api/admin/payments/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Deleted!", "The payment has been deleted.", "success");
          fetchPayments();
        } else {
          Swal.fire("Error", data.message || "Failed to delete payment", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Could not delete payment", "error");
      }
    }
  };

  const openAddModal = () => {
    setFormData({ amount: "", systemStatus: "pending", userId: "", vehicleId: "" });
    setIsAddModalOpen(true);
  };

  const openEditModal = (payment) => {
    setSelectedPayment(payment);
    setFormData({
      amount: payment.amount || "",
      systemStatus: payment.systemStatus || "pending",
      userId: payment.userId?._id || payment.userId || "",
      vehicleId: payment.vehicleId?._id || payment.vehicleId || ""
    });
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Paid</span>;
      case "pending":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "failed":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Failed</span>;
      case "cancelled":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 1, sortable: false },
    { 
      field: "userName", 
      headerName: "User", 
      flex: 1,
      valueGetter: (params) => params.row?.userId?.username || "N/A"
    },
    { 
      field: "vehicleName", 
      headerName: "Vehicle", 
      flex: 1,
      valueGetter: (params) => {
        const vehicle = params.row?.vehicleId;
        return vehicle ? `${vehicle.company} ${vehicle.model}` : "N/A";
      }
    },
    { 
      field: "amount", 
      headerName: "Amount", 
      flex: 0.5,
      renderCell: (params) => (
        <span className="font-semibold text-slate-700">₹{params.row.amount}</span>
      )
    },
    { 
      field: "systemStatus", 
      headerName: "Status", 
      flex: 0.5,
      renderCell: (params) => getStatusBadge(params.row.systemStatus)
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(params.row)}
            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <IconEye size={18} />
          </button>
          <button
            onClick={() => openEditModal(params.row)}
            className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          >
            <IconEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(params.row._id)}
            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <IconTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster position="top-right" richColors />
      <div className="flex justify-between items-center">
        <Header category="Page" title="Payment Requests" />
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm font-medium"
        >
          <IconPlus size={20} />
          <span>Add Request</span>
        </button>
      </div>
      
      <div className="h-[600px] w-full mt-5">
        <DataGrid
          rows={payments}
          columns={columns}
          getRowId={(row) => row._id}
          rowCount={totalCount}
          loading={loading}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "&.MuiDataGrid-root": {
              border: "none",
            },
          }}
        />
      </div>

      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Payment Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <IconX size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block mb-1">User</span>
                  <p className="font-semibold text-slate-800">{selectedPayment.userId?.username}</p>
                  <p className="text-slate-500 text-xs">{selectedPayment.userId?.email}</p>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Vehicle</span>
                  <p className="font-semibold text-slate-800">{selectedPayment.vehicleId?.company} {selectedPayment.vehicleId?.model}</p>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Amount</span>
                  <p className="font-bold text-green-600 flex items-center"><IconCurrencyRupee size={16}/> {selectedPayment.amount}</p>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Razorpay Order ID</span>
                  <p className="font-mono text-slate-700 text-xs">{selectedPayment.razorpayOrderId}</p>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Razorpay Payment ID</span>
                  <p className="font-mono text-slate-700 text-xs">{selectedPayment.razorpayPaymentId || "N/A"}</p>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Reconciled</span>
                  <p className="font-semibold text-slate-800">{selectedPayment.reconciled ? "Yes" : "No"}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-semibold text-slate-700 mb-2">System Status</label>
                <div className="flex gap-4 items-center">
                  <select
                    value={selectedPayment.systemStatus}
                    onChange={handleStatusChange}
                    className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  {selectedPayment.systemStatus !== "paid" && (
                    <button
                      onClick={handleReconcile}
                      disabled={reconciling}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <IconRefresh size={18} className={reconciling ? "animate-spin" : ""} />
                      Reconcile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Payment Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {isAddModalOpen ? "Add Payment Request" : "Edit Payment Request"}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <IconX size={24} />
              </button>
            </div>
            
            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  required 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">User ID</label>
                <input 
                  type="text" 
                  required 
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle ID</label>
                <input 
                  type="text" 
                  required 
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">System Status</label>
                <select 
                  value={formData.systemStatus}
                  onChange={(e) => setFormData({...formData, systemStatus: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isAddModalOpen ? "Add Payment" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
