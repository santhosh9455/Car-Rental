import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setEditData } from "../../../redux/adminSlices/actions";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Button } from "@mui/material";
import { Header } from "../components";
import toast, { Toaster } from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import { showVehicles } from "../../../redux/user/listAllVehicleSlice";
import { Modal } from "@mui/material";
import { IconEye, IconX, IconPlus } from "@tabler/icons-react";
import AddProductModal from "../components/AddProductModal";
import EditProductComponent from "../components/EditProductComponent";
import { clearAdminVehicleToast } from "../../../redux/adminSlices/adminDashboardSlice/StatusSlice";

function AllVehicles() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const { adminEditVehicleSuccess, adminAddVehicleSuccess, adminCrudError } = useSelector((state) => state.statusSlice);

  const [allVehicles, setVehicles] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);

  const handleView = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewModalOpen(true);
  };

  //show vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/admin/showVehicles", {
          method: "GET",
        });
        if (res.ok) {
          const data = await res.json();
          setVehicles(data);
          dispatch(showVehicles(data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchVehicles();
  }, [isAddVehicleClicked]);

  //add product (open modal)
  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  //delete a vehicle
  const handleDelete = async (vehicle_id) => {
    try {
      setVehicles(allVehicles.filter((cur) => cur._id !== vehicle_id));
      const res = await fetch(`/api/admin/deleteVehicle/${vehicle_id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("deleted", {
          duration: 800,

          style: {
            color: "white",
            background: "#c48080",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //edit (open modal)
  const handleEditVehicle = (id) => {
    setEditVehicleId(id);
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => (
        <img
          src={params.value}
          style={{
            width: "50px",
            height: "40px",
            borderRadius: "5px",
            objectFit: "cover",
          }}
          alt="vehicle"
        />
      ),
    },
    {
      field: "registeration_number",
      headerName: "Register Number",
      width: 150,
    },
    { field: "company", headerName: "Company", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center gap-2 mt-2">
          <Button onClick={() => handleView(params.row.originalData)}>
            <IconEye size={20} className="text-slate-500" />
          </Button>
          <Button onClick={() => handleEditVehicle(params.row.id)}>
            <ModeEditOutlineIcon className="text-blue-500" />
          </Button>
          <Button onClick={() => handleDelete(params.row.id)}>
            <DeleteForeverIcon className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const rows = allVehicles
    .filter(
      (vehicle) => vehicle.isDeleted === "false" && vehicle.isAdminApproved
    )
    .map((vehicle) => ({
      id: vehicle._id,
      image: vehicle.image[0],
      registeration_number: vehicle.registeration_number,
      company: vehicle.company,
      name: vehicle.name,
      originalData: vehicle,
    }));

  //edit success
  useEffect(() => {
    if (adminEditVehicleSuccess) {
      toast.success("success");
    }
    else if (adminAddVehicleSuccess) {
      toast.success("success");
    }
    else if(adminCrudError){
     toast.error("error")
    }
  }, [adminEditVehicleSuccess, adminAddVehicleSuccess,adminCrudError,dispatch]);

  useEffect(() => {
    const clearNotificationsTimeout = setTimeout(() => {
      dispatch(clearAdminVehicleToast());
    }, 3000);
  
    return () => clearTimeout(clearNotificationsTimeout);
  }, [adminEditVehicleSuccess, adminAddVehicleSuccess, adminCrudError, dispatch]);

  return (
    <>

      {adminEditVehicleSuccess ? <Toaster /> : ''} 
        {adminAddVehicleSuccess ? <Toaster /> : ''}
        {adminCrudError ? <Toaster/> : ""}     
        
      <div className="w-full flex flex-col p-4 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <Header title="All Vehicles" />
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm font-medium"
          >
            <IconPlus size={20} />
            <span>Add Vehicle</span>
          </button>
        </div>
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Box sx={{ height: "70vh", width: "100%", overflowX: "auto", overflowY: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                  },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
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
              ".MuiDataGrid-cell": { borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center" },
            }}
          />
        </Box>
        </div>
      </div>

      <Modal open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 outline-none">
          {selectedVehicle && (
            <div>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-slate-800">Vehicle Details</h2>
                <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                  <IconX size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {selectedVehicle.image && selectedVehicle.image[0] && (
                  <img src={selectedVehicle.image[0]} alt="vehicle" className="w-full h-48 object-cover rounded-xl shadow-sm" />
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div><span className="font-medium text-slate-400 block mb-1">Make & Model</span> {selectedVehicle.company} {selectedVehicle.model}</div>
                  <div><span className="font-medium text-slate-400 block mb-1">Name</span> {selectedVehicle.name}</div>
                  <div><span className="font-medium text-slate-400 block mb-1">Reg. Number</span> {selectedVehicle.registeration_number}</div>
                  <div><span className="font-medium text-slate-400 block mb-1">Vehicle Type</span> {selectedVehicle.car_type}</div>
                  <div><span className="font-medium text-slate-400 block mb-1">Transmission</span> {selectedVehicle.transmition}</div>
                  <div><span className="font-medium text-slate-400 block mb-1">Fuel Type</span> {selectedVehicle.fuel_type}</div>
                  <div><span className="font-medium text-slate-400 block mb-1">Seats</span> {selectedVehicle.seats}</div>
                  <div><span className="font-medium text-slate-400 block mb-1">Location</span> {selectedVehicle.location}, {selectedVehicle.district}</div>
                  <div><span className="font-medium text-slate-400 block mb-1">Base Price</span> ₹{selectedVehicle.base_price}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[1000px] max-h-[95vh] overflow-y-auto outline-none">
          <AddProductModal onClose={() => {
            setIsAddModalOpen(false);
            // Refresh data after adding
            const fetchVehicles = async () => {
              try {
                const res = await fetch("/api/admin/showVehicles", { method: "GET" });
                const data = await res.json();
                if (data) dispatch(showVehicles(data));
              } catch (error) { console.log(error); }
            };
            fetchVehicles();
          }} />
        </div>
      </Modal>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[1000px] max-h-[95vh] overflow-y-auto outline-none">
          {editVehicleId && (
            <EditProductComponent 
              vehicleIdProp={editVehicleId} 
              onClose={() => {
                setIsEditModalOpen(false);
                setEditVehicleId(null);
                // Refresh data after editing
                const fetchVehicles = async () => {
                  try {
                    const res = await fetch("/api/admin/showVehicles", { method: "GET" });
                    const data = await res.json();
                    if (data) dispatch(showVehicles(data));
                  } catch (error) { console.log(error); }
                };
                fetchVehicles();
              }} 
            />
          )}
        </div>
      </Modal>
    </>
  );
}

export default AllVehicles;
