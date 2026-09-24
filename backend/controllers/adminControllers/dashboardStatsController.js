import Booking from "../../models/BookingModel.js";
import User from "../../models/userModel.js";
import Vehicle from "../../models/vehicleModel.js";
import { errorHandler } from "../../utils/error.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    // Basic Counts
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalVehicles = await Vehicle.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Total Earnings (sum of all completed or active bookings)
    const earningsAggr = await Booking.aggregate([
      { $match: { status: { $in: ["tripCompleted", "onTrip", "booked"] } } },
      { $group: { _id: null, totalEarnings: { $sum: "$totalPrice" } } }
    ]);
    const totalEarnings = earningsAggr.length > 0 ? earningsAggr[0].totalEarnings : 0;

    // Booking Status Breakdown for Pie Chart
    const bookingStatusAggr = await Booking.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } }
    ]);
    const bookingStatusChartData = bookingStatusAggr.map(item => ({
      id: item._id,
      label: item._id,
      value: item.value
    }));

    // Monthly Earnings for Line/Bar Chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEarningsAggr = await Booking.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ["tripCompleted", "onTrip", "booked"] }
        } 
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          earnings: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyEarningsChartData = monthlyEarningsAggr.map(item => ({
      x: monthNames[item._id - 1],
      y: item.earnings
    }));

    // Recent Transactions
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'username')
      .populate('vehicleId', 'company model');
    
    const recentTransactions = recentBookings.map(b => ({
      id: `#TX-${b._id.toString().substring(0, 6).toUpperCase()}`,
      user: b.userId?.username || "Unknown",
      vehicle: b.vehicleId ? `${b.vehicleId.company} ${b.vehicleId.model}` : "Unknown",
      amount: `₹${b.totalPrice}`,
      date: new Date(b.createdAt).toLocaleDateString(),
      status: b.status === "tripCompleted" ? "Completed" : b.status === "canceled" ? "Cancelled" : "Pending"
    }));

    // Vehicle Performance Bar Chart
    const vehiclePerformanceAggr = await Booking.aggregate([
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicle"
        }
      },
      { $unwind: "$vehicle" },
      { $group: { _id: "$vehicle.car_type", bookings: { $sum: 1 } } }
    ]);
    const vehiclePerformanceChartData = vehiclePerformanceAggr.map(item => ({
      type: item._id || "Unknown",
      bookings: item.bookings
    }));

    res.status(200).json({
      totalUsers,
      totalVehicles,
      totalBookings,
      totalEarnings,
      bookingStatusChartData,
      vehiclePerformanceChartData,
      recentTransactions,
      monthlyEarningsChartData: [
        {
          id: "earnings",
          color: "hsl(210, 70%, 50%)",
          data: monthlyEarningsChartData
        }
      ]
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error fetching dashboard stats"));
  }
};
