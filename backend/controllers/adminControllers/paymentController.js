import Payment from "../../models/PaymentModel.js";
import SystemSettings from "../../models/SystemSettingsModel.js";
import { errorHandler } from "../../utils/error.js";
import Razorpay from "razorpay";

export const getPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;
    const status = req.query.status;

    const query = {};
    if (status) {
      query.systemStatus = status;
    }

    const totalCount = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate("userId", "username email")
      .populate("vehicleId", "model company")
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: payments,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error fetching payments"));
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { systemStatus } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) return next(errorHandler(404, "Payment not found"));

    payment.systemStatus = systemStatus;
    await payment.save();

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error updating payment status"));
  }
};

export const reconcilePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findById(id);
    if (!payment) return next(errorHandler(404, "Payment not found"));
    
    if (payment.systemStatus === "paid") {
      return res.status(200).json({ success: true, message: "Payment is already paid", data: payment });
    }

    const settings = await SystemSettings.findOne();
    if (!settings || !settings.razorpayKeyId || !settings.razorpaySecret) {
      return next(errorHandler(500, "Razorpay is not configured on the server."));
    }

    const instance = new Razorpay({
      key_id: settings.razorpayKeyId,
      key_secret: settings.razorpaySecret,
    });

    const order = await instance.orders.fetch(payment.razorpayOrderId);
    
    // Check if order is paid
    if (order && order.status === "paid") {
      payment.status = "captured";
      payment.systemStatus = "paid";
      payment.reconciled = true;
      await payment.save();
      return res.status(200).json({ success: true, message: "Payment reconciled and marked as paid", data: payment });
    } else if (order && order.status === "attempted") {
      return res.status(200).json({ success: true, message: "Payment is attempted but not yet captured", data: payment });
    } else {
       payment.status = order.status || payment.status;
       if (order.status === "failed") {
          payment.systemStatus = "failed";
       }
       await payment.save();
       return res.status(200).json({ success: true, message: `Payment is ${order.status}`, data: payment });
    }
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error reconciling payment"));
  }
};

export const createPayment = async (req, res, next) => {
  try {
    // Allows admin to manually create a payment record
    const { amount, systemStatus, userId, vehicleId } = req.body;
    const newPayment = new Payment({
      amount,
      systemStatus: systemStatus || "pending",
      userId,
      vehicleId,
      status: "created" // Default Razorpay status for manual records
    });
    
    await newPayment.save();
    res.status(201).json({ success: true, data: newPayment, message: "Payment request created successfully." });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error creating payment"));
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, systemStatus, userId, vehicleId } = req.body;
    
    const payment = await Payment.findById(id);
    if (!payment) return next(errorHandler(404, "Payment not found"));
    
    if (amount !== undefined) payment.amount = amount;
    if (systemStatus !== undefined) payment.systemStatus = systemStatus;
    if (userId !== undefined) payment.userId = userId;
    if (vehicleId !== undefined) payment.vehicleId = vehicleId;
    
    await payment.save();
    res.status(200).json({ success: true, data: payment, message: "Payment updated successfully." });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error updating payment"));
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndDelete(id);
    
    if (!payment) return next(errorHandler(404, "Payment not found"));
    
    res.status(200).json({ success: true, message: "Payment deleted successfully." });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error deleting payment"));
  }
};
