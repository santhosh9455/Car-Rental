import Booking from "../../models/BookingModel.js";
import Vehicle from "../../models/vehicleModel.js";
import { errorHandler } from "../../utils/error.js";

export const allBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicleDetails",
        },
      },
      {
        $unwind: {
          path: "$vehicleDetails",
        },
      },
    ]);

    if (!bookings) {
      next(errorHandler(404, "no bookings found"));
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in allBookings"));
  }
};

//chnage bookings status

export const changeStatus = async (req, res, next) => {
  try {
    if (!req.body) {
      next(errorHandler(409, "bad request vehicle id and new status needed"));
      return;
    }
    const { id, status } = req.body;

    const statusChanged = await Booking.findByIdAndUpdate(id, {
      status: status,
    });

    if (!statusChanged) {
      next(errorHandler(404, "status not changed or wrong id"));
      return;
    }
    res.status(200).json({ message: "status changed" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in changeStatus"));
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedBooking) {
      return next(errorHandler(404, "Booking not found"));
    }
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error updating booking"));
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    
    if (!deleted) {
      return next(errorHandler(404, "Booking not found"));
    }
    
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error deleting booking"));
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, userId, pickupDate, dropOffDate, pickUpLocation, dropOffLocation, totalPrice, status } = req.body;
    
    if (!vehicleId || !userId || !pickupDate || !dropOffDate || !pickUpLocation || !dropOffLocation || !totalPrice) {
      return next(errorHandler(400, "All fields are required"));
    }

    const newBooking = new Booking({
      vehicleId,
      userId,
      pickupDate,
      dropOffDate,
      pickUpLocation,
      dropOffLocation,
      totalPrice,
      status: status || "booked",
      razorpayOrderId: "admin_manual_order_" + Date.now(),
      razorpayPaymentId: "admin_manual_payment_" + Date.now()
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error creating booking"));
  }
};
