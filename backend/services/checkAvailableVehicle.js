import Booking from "../models/BookingModel.js";
import Vehicle from "../models/vehicleModel.js";

//returning vehicles that are not booked in selected Date
export async function availableAtDate(pickupDate, dropOffDate) {
  try {
    //this condition only checked vehicles without booking it only checked dates it dose not checked status of trip

    // const existingBookings = await Booking.find({
    //   $or: [
    //     { pickupDate: { $lt: dropOffDate }, dropOffDate: { $gt: pickupDate } }, // Overlap condition
    //     { pickupDate: { $gte: pickupDate, $lt: dropOffDate } }, // Start within range
    //     { dropOffDate: { $gt: pickupDate, $lte: dropOffDate } }, // End within range
    //     { pickupDate: { $lte: pickupDate }, dropOffDate: { $gte: dropOffDate } }, // Booking includes the entire time range
    //   ],
    // });

    // const vehicleIds = existingBookings.map(booking => booking.vehicleId);
    // const uniqueVehicleIds = [...new Set(vehicleIds)];

    // const vehiclesWithoutBookings = await Vehicle.find({ _id: { $nin: uniqueVehicleIds } });
    // return vehiclesWithoutBookings || [];

    const overlappingActiveBookings = await Booking.find({
      status: { $in: ["booked", "onTrip", "notPicked", "overDue"] },
      $or: [
        { pickupDate: { $lt: dropOffDate }, dropOffDate: { $gt: pickupDate } },
        { pickupDate: { $gte: pickupDate, $lt: dropOffDate } },
        { dropOffDate: { $gt: pickupDate, $lte: dropOffDate } },
        { pickupDate: { $lte: pickupDate }, dropOffDate: { $gte: dropOffDate } },
      ],
    });

    const activeVehicleIds = overlappingActiveBookings.map((b) => b.vehicleId);
    const uniqueActiveVehicleIds = [...new Set(activeVehicleIds)];

    const vehiclesWithoutActiveBookings = await Vehicle.find({
      _id: { $nin: uniqueActiveVehicleIds },
    });

    return vehiclesWithoutActiveBookings || [];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
