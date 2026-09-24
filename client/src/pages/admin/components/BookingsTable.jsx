import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { IconEye, IconX, IconTrash, IconEdit } from "@tabler/icons-react";
import { Modal } from "@mui/material";
import Swal from "sweetalert2";
import api from "../../../utils/api";

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBookingForm, setEditBookingForm] = useState({
    pickupDate: "",
    dropOffDate: "",
    status: ""
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addBookingForm, setAddBookingForm] = useState({
    userId: "",
    vehicleId: "",
    pickupDate: "",
    dropOffDate: "",
    pickUpLocation: "",
    dropOffLocation: "",
    totalPrice: "",
    status: "booked"
  });
  const [usersData, setUsersData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);

  const handleOpenModal = (bookingData) => {
    setSelectedBooking(bookingData);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (bookingData) => {
    setSelectedBooking(bookingData);
    setEditBookingForm({
      pickupDate: new Date(bookingData.pickupDate).toISOString().slice(0, 16),
      dropOffDate: new Date(bookingData.dropOffDate).toISOString().slice(0, 16),
      status: bookingData.status
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedBooking(null);
  };
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/allBookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/admin/bookings/${selectedBooking._id}`, editBookingForm);
      if (res.status === 200) {
        Swal.fire("Updated!", "The booking has been updated.", "success");
        setIsEditModalOpen(false);
        fetchBookings();
      }
    } catch (error) {
      Swal.fire("Error", "Could not update booking", "error");
    }
  };

  const fetchUsersAndVehicles = async () => {
    try {
      const userRes = await api.get("/api/admin/users?limit=1000");
      setUsersData(userRes.data.users || []);
      const vehicleRes = await fetch("/api/admin/showVehicles");
      const vehicleData = await vehicleRes.json();
      setVehiclesData(vehicleData || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addBookingForm),
      });
      if (res.ok) {
        Swal.fire("Added!", "Booking has been created.", "success");
        setIsAddModalOpen(false);
        fetchBookings();
        setAddBookingForm({
          userId: "", vehicleId: "", pickupDate: "", dropOffDate: "",
          pickUpLocation: "", dropOffLocation: "", totalPrice: "", status: "booked"
        });
      } else {
        Swal.fire("Error", "Could not create booking", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Could not create booking", "error");
    }
  };

  const handleStatusChange = (e, params) => {
    const newStatus = e.target.value;
    const bookingId = params.id;

    const changeVehicleStatus = async () => {
      try {
        const isStatusChanged = await fetch("/api/admin/changeStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: bookingId,
            status: newStatus,
          }),
        });

        if (!isStatusChanged.ok) {
          return;
        }
        fetchBookings()

      } catch (error) {
        console.log(error);
      }
    };

    changeVehicleStatus();
  };

  const handleDeleteBooking = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/admin/bookings/${id}`);
        Swal.fire("Deleted!", "The booking has been deleted.", "success");
        fetchBookings();
      } catch (error) {
        Swal.fire("Error", "Could not delete booking", "error");
      }
    }
  };

  //all bookings
  useEffect(() => {
    fetchBookings();
    fetchUsersAndVehicles();
  }, []);

  //columns
  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "5px",
            objectFit: "contain",
          }}
          alt="vehicle"
        />
      ),
    },
    {
      field: "Pickup_Location",
      headerName: " Pickup Location",
      width: 150,
    },
    { field: "Pickup_Date", headerName: "Pickup Date", width: 150 },
    { field: "Dropoff_Location", headerName: "Dropoff Location", width: 150 },
    {
      field: "Dropoff_Date",
      headerName: "Dropoff Date",
      width: 150,
    },
    {
      field: "Vehicle_Status",
      headerName: "Vehicle Status",
      width: 150,
      renderCell: (params) => (
        <div className="bg-green-200 px-[8px] py-[6px] rounded-md mx-auto ">
          {params.value}
        </div>
      ),
    },
    {
      field: "Change_Status",
      headerName: "Change_Status",
      width: 150,
      renderCell: (params) => {
        return (
          <select
          className="px-4 py-2"
          value={params.selectedValue}
          onChange={(e) => {
            handleStatusChange(e, params)
          }}
        >
          {params.value.map((cur, idx) => (
            <option key={idx} value={cur}>
              {cur}
            </option>
          ))}
        </select>
        )
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-2 mt-2">
            <button
              className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-50 transition-colors"
              onClick={() => handleOpenModal(params.row.originalData)}
            >
              <IconEye size={20} />
            </button>
            <button
              className="text-blue-500 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
              onClick={() => handleOpenEditModal(params.row.originalData)}
            >
              <IconEdit size={20} />
            </button>
            <button
              className="text-red-500 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
              onClick={() => handleDeleteBooking(params.row.id)}
            >
              <IconTrash size={20} />
            </button>
          </div>
        );
      },
    },
  ];


  //rows
  const rows =
    bookings?.map((cur) => ({
      id: cur._id,
      bookingId: cur._id,
      image: cur.vehicleDetails.image[0],
      Pickup_Location: cur.pickUpLocation,
      Pickup_Date: new Date(cur.pickupDate),
      Dropoff_Location: cur.dropOffLocation,
      Dropoff_Date: new Date(cur.dropOffDate),
      Vehicle_Status: cur.status,
      Change_Status: [
        "notBooked",
        "booked",
        "onTrip",
        "notPicked",
        "canceled",
        "overDue",
        "tripCompleted",
      ],
      originalData: cur,
    }));

  return (
    <>
      <div className="w-full flex justify-between text-start items-center mb-4 mt-2 px-4 md:px-10">
        <h3 className="text-xl font-bold text-slate-800"></h3>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
        >
          + Add Booking
        </button>
      </div>
      <div className="w-full p-4 md:p-10 border border-slate-100 rounded-2xl shadow-sm bg-white overflow-hidden">
        <Box sx={{ height: "70vh", width: "100%", overflowX: "auto" }}>
          <DataGrid
            rows={rows || []}
            columns={columns.map((c) => ({ ...c, flex: 1, minWidth: c.width }))}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              ".MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                color: "#334155",
                fontWeight: 600,
              },
              ".MuiDataGrid-columnSeparator": {
                display: "none",
              },
              ".MuiDataGrid-row:hover": {
                backgroundColor: "#f1f5f9",
              },
              ".MuiDataGrid-cell": {
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
              },
            }}
          />
        </Box>
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 outline-none">
          {selectedBooking && (
            <div>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-slate-800">Booking Details</h2>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                  <IconX size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Order Info</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl">
                    <div><span className="font-medium text-slate-400 block mb-1">Booking ID</span> {selectedBooking._id}</div>
                    <div><span className="font-medium text-slate-400 block mb-1">Total Amount</span> ₹{selectedBooking.totalPrice}</div>
                    <div><span className="font-medium text-slate-400 block mb-1">Pickup</span> {selectedBooking.pickUpLocation} <br/><span className="text-xs text-slate-500">{new Date(selectedBooking.pickupDate).toLocaleString()}</span></div>
                    <div><span className="font-medium text-slate-400 block mb-1">Dropoff</span> {selectedBooking.dropOffLocation} <br/><span className="text-xs text-slate-500">{new Date(selectedBooking.dropOffDate).toLocaleString()}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Vehicle Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 border border-slate-100 p-4 rounded-xl">
                    <div><span className="font-medium text-slate-400 block mb-1">Vehicle</span> {selectedBooking.vehicleDetails?.company} {selectedBooking.vehicleDetails?.model}</div>
                    <div><span className="font-medium text-slate-400 block mb-1">Reg. Number</span> {selectedBooking.vehicleDetails?.registeration_number}</div>
                    <div><span className="font-medium text-slate-400 block mb-1">Type</span> {selectedBooking.vehicleDetails?.car_type}</div>
                    <div><span className="font-medium text-slate-400 block mb-1">Transmission</span> {selectedBooking.vehicleDetails?.transmition}</div>
                    <div><span className="font-medium text-slate-400 block mb-1">Fuel</span> {selectedBooking.vehicleDetails?.fuel_type}</div>
                    <div><span className="font-medium text-slate-400 block mb-1">Seats</span> {selectedBooking.vehicleDetails?.seats}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onClose={handleCloseModal}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[500px] bg-white rounded-2xl shadow-2xl p-6 outline-none">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-slate-800">Edit Booking</h2>
            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
              <IconX size={20} />
            </button>
          </div>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Date & Time</label>
              <input 
                type="datetime-local" 
                required 
                value={editBookingForm.pickupDate} 
                onChange={(e) => setEditBookingForm({...editBookingForm, pickupDate: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Drop-off Date & Time</label>
              <input 
                type="datetime-local" 
                required 
                value={editBookingForm.dropOffDate} 
                onChange={(e) => setEditBookingForm({...editBookingForm, dropOffDate: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select 
                value={editBookingForm.status} 
                onChange={(e) => setEditBookingForm({...editBookingForm, status: e.target.value})} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="notBooked">notBooked</option>
                <option value="booked">booked</option>
                <option value="onTrip">onTrip</option>
                <option value="notPicked">notPicked</option>
                <option value="canceled">canceled</option>
                <option value="overDue">overDue</option>
                <option value="tripCompleted">tripCompleted</option>
              </select>
            </div>
            <div className="flex justify-end pt-4 mt-6 border-t">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-2">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Add Modal */}
      <Modal open={isAddModalOpen} onClose={handleCloseModal}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 outline-none">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-slate-800">Add New Booking</h2>
            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
              <IconX size={20} />
            </button>
          </div>
          
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">User</label>
                <select required value={addBookingForm.userId} onChange={(e) => setAddBookingForm({...addBookingForm, userId: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                  <option value="">Select a user...</option>
                  {usersData.map((u) => <option key={u._id} value={u._id}>{u.username} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle</label>
                <select required value={addBookingForm.vehicleId} onChange={(e) => setAddBookingForm({...addBookingForm, vehicleId: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                  <option value="">Select a vehicle...</option>
                  {vehiclesData.map((v) => <option key={v._id} value={v._id}>{v.company} {v.model} ({v.registeration_number})</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Date & Time</label>
                <input type="datetime-local" required value={addBookingForm.pickupDate} onChange={(e) => setAddBookingForm({...addBookingForm, pickupDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Drop-off Date & Time</label>
                <input type="datetime-local" required value={addBookingForm.dropOffDate} onChange={(e) => setAddBookingForm({...addBookingForm, dropOffDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Location</label>
                <input type="text" required value={addBookingForm.pickUpLocation} onChange={(e) => setAddBookingForm({...addBookingForm, pickUpLocation: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Drop-off Location</label>
                <input type="text" required value={addBookingForm.dropOffLocation} onChange={(e) => setAddBookingForm({...addBookingForm, dropOffLocation: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Price (₹)</label>
                <input type="number" required value={addBookingForm.totalPrice} onChange={(e) => setAddBookingForm({...addBookingForm, totalPrice: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={addBookingForm.status} onChange={(e) => setAddBookingForm({...addBookingForm, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                  <option value="booked">booked</option>
                  <option value="notBooked">notBooked</option>
                  <option value="onTrip">onTrip</option>
                  <option value="notPicked">notPicked</option>
                  <option value="canceled">canceled</option>
                  <option value="overDue">overDue</option>
                  <option value="tripCompleted">tripCompleted</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-6 border-t">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-2">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Booking</button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default BookingsTable;
