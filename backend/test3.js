import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Booking = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const user = await User.findOne({ username: 'normalUser' });
  const bookings = await Booking.aggregate([
    { $match: { userId: user._id } },
    { $lookup: { from: 'vehicles', localField: 'vehicleId', foreignField: '_id', as: 'result' } },
    { $project: { _id: 0, bookingDetails: '$$ROOT', vehicleDetails: { $arrayElemAt: ['$result', 0] } } }
  ]);
  console.log('Bookings length for normalUser:', bookings.length);
  process.exit();
}).catch(console.log);
