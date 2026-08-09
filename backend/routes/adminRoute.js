import express from "express"
import { adminAuth ,adminProfiile } from "../controllers/adminControllers/adminController.js"
import { signIn } from "../controllers/authController.js"
import { signOut  } from "../controllers/userControllers/userController.js"
import { addProduct, deleteVehicle, editVehicle,  } from "../controllers/adminControllers/dashboardController.js"
import { showVehicles } from "../controllers/adminControllers/dashboardController.js"
import { multerUploads } from "../utils/multer.js"
import { insertDummyData } from "../controllers/adminControllers/masterCollectionController.js"
import { getCarModelData } from "../controllers/adminControllers/masterCollectionController.js"
import { approveVendorVehicleRequest, fetchVendorVehilceRequests, rejectVendorVehicleRequest } from "../controllers/adminControllers/vendorVehilceRequests.js"
import { allBookings, changeStatus, updateBooking, deleteBooking } from "../controllers/adminControllers/bookingsController.js"
import { getSettings, updateSettings } from "../controllers/adminControllers/settingsController.js"
import { getPayments, updatePaymentStatus, reconcilePayment, createPayment, updatePayment, deletePayment } from "../controllers/adminControllers/paymentController.js"
import { verifyToken } from "../utils/verifyUser.js"
import { getAllUsers, getUserById, updateUser, deleteUser, createUser } from "../controllers/adminControllers/adminUserController.js"
import { getDashboardStats } from "../controllers/adminControllers/dashboardStatsController.js"





const router = express.Router()

router.post('/dashboard',signIn,adminAuth)
router.post('/profile',adminProfiile)
router.get('/signout',signOut)
router.post('/addProduct',multerUploads,addProduct)
router.get('/showVehicles',showVehicles)
router.delete('/deleteVehicle/:id',deleteVehicle)
router.put('/editVehicle/:id',editVehicle)
router.get('/dummyData',insertDummyData)
router.get('/getVehicleModels',getCarModelData)
router.get('/fetchVendorVehilceRequests',fetchVendorVehilceRequests)
router.post('/approveVendorVehicleRequest',approveVendorVehicleRequest)
router.post('/rejectVendorVehicleRequest',rejectVendorVehicleRequest)
router.get('/allBookings',allBookings)
router.post('/changeStatus',changeStatus)
router.put('/bookings/:id', updateBooking)
router.delete('/bookings/:id', deleteBooking)
router.get('/settings', getSettings)
router.put('/settings', updateSettings)
router.get('/payments', getPayments)
router.post('/payments', createPayment)
router.put('/payments/:id', updatePayment)
router.delete('/payments/:id', deletePayment)
router.put('/payments/:id/status', updatePaymentStatus)
router.get('/payments/:id/reconcile', reconcilePayment)

// User Management Routes
router.get('/users', getAllUsers)
router.post('/users', multerUploads, createUser)
router.get('/users/:id', getUserById)
router.put('/users/:id', multerUploads, updateUser)
router.delete('/users/:id', deleteUser)

// Dashboard Stats
router.get('/dashboard-stats', getDashboardStats)

export default router