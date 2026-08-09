import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdCurrencyRupee } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import api from "../../utils/api";
import UserOrderDetailsModal from "../../components/UserOrderDetailsModal";
import { setIsOrderModalOpen, setSingleOrderDetails } from "../../redux/user/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { IconShoppingBag, IconCalendar, IconMapPin, IconChevronRight } from "@tabler/icons-react";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()} · ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const statusColor = {
  booked: "bg-green-100 text-green-700",
  onTrip: "bg-blue-100 text-blue-700",
  notPicked: "bg-yellow-100 text-yellow-700",
  canceled: "bg-red-100 text-red-700",
  overDue: "bg-orange-100 text-orange-700",
  tripCompleted: "bg-slate-100 text-slate-600",
  notBooked: "bg-slate-100 text-slate-500",
};

export default function Orders() {
  const { _id } = useSelector((state) => state.user.currentUser);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchBookings = async () => {
    try {
        const res = await api.post("/api/user/findBookingsOfUser", { userId: _id });
      const data = res.data;
      if (Array.isArray(data)) setBookings(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDetailsModal = (cur) => {
    dispatch(setIsOrderModalOpen(true));
    dispatch(setSingleOrderDetails(cur));
  };

  return (
    <div>
      <UserOrderDetailsModal />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <IconShoppingBag size={20} className="text-green-600" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Your Bookings</h1>
          <p className="text-sm text-slate-500">
            {bookings.length > 0 ? `${bookings.length} booking${bookings.length > 1 ? "s" : ""} found` : "Track all your rides"}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <IconShoppingBag size={52} className="mb-4 text-slate-200" />
          <p className="text-lg font-semibold text-slate-500">No bookings yet</p>
          <p className="text-sm mt-1">Your booked rides will appear here</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {bookings.map((cur, idx) => {
              const vehicle = cur.vehicleDetails;
              const booking = cur.bookingDetails;
              const status = booking?.status || "booked";

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-0">
                    {/* Car Image */}
                    <div className="bg-slate-50 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-slate-100">
                      <img
                        src={vehicle?.image?.[0]}
                        alt={vehicle?.name}
                        className="h-24 w-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="sm:col-span-3 p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-bold text-slate-800 capitalize">{vehicle?.name || "Unknown Vehicle"}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Booking ID: {booking?._id?.slice(-8)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${statusColor[status] || statusColor.booked}`}>
                            {status}
                          </span>
                          <div className="flex items-center text-green-600 font-bold text-lg">
                            <MdCurrencyRupee />
                            {booking?.totalPrice}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                        <div className="flex items-start gap-2">
                          <IconMapPin size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-slate-400 mb-0.5">Pick-up</div>
                            <div className="capitalize">{booking?.pickUpLocation}</div>
                            <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                              <IconCalendar size={11} />
                              {formatDate(booking?.pickupDate)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <IconMapPin size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-slate-400 mb-0.5">Drop-off</div>
                            <div className="capitalize">{booking?.dropOffLocation}</div>
                            <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                              <IconCalendar size={11} />
                              {formatDate(booking?.dropOffDate)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => handleDetailsModal(cur)}
                          className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-green-600 transition-colors"
                        >
                          View Details <IconChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
