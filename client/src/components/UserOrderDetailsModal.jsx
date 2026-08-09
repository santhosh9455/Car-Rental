import { useDispatch, useSelector } from "react-redux";
import { setIsOrderModalOpen } from "../redux/user/userSlice";
import { IconX } from "@tabler/icons-react";

const UserOrderDetailsModal = () => {
  const { isOrderModalOpen, singleOrderDetails: cur } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  const pickupDate = cur ? new Date(cur.bookingDetails.pickupDate) : null;
  const dropOffDate = cur ? new Date(cur.bookingDetails.dropOffDate) : null;

  const closeModal = () => {
    dispatch(setIsOrderModalOpen(false));
  };

  if (!isOrderModalOpen || !cur) return null;

  return (
    <div
      className="fixed inset-0 z-[999] grid place-items-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 overflow-y-auto p-4"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Booking Details</h2>
          <button
            onClick={closeModal}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Left Column: Image & Basic Info */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-100 aspect-[4/3] bg-slate-50">
              {cur.vehicleDetails.image && cur.vehicleDetails.image[0] ? (
                <img
                  src={cur.vehicleDetails.image[0]}
                  alt={cur.vehicleDetails.model}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-emerald-700">₹{cur.bookingDetails.totalPrice}</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Booking ID</p>
              <p className="text-sm font-mono text-slate-700 break-all">{cur.bookingDetails._id}</p>
            </div>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="w-full md:w-2/3 space-y-8">
            
            {/* Trip Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Trip Schedule</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-medium text-slate-700">Pick-up</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{cur.bookingDetails.pickUpLocation}</p>
                  <p className="text-xs font-medium text-slate-500 bg-slate-50 inline-block px-2 py-1 rounded">
                    {pickupDate?.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-medium text-slate-700">Drop-off</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{cur.bookingDetails.dropOffLocation}</p>
                  <p className="text-xs font-medium text-slate-500 bg-slate-50 inline-block px-2 py-1 rounded">
                    {dropOffDate?.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Vehicle Specs</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Make & Model</span>
                  <span className="text-sm font-medium text-slate-700">{cur.vehicleDetails.company} {cur.vehicleDetails.model}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Reg. Number</span>
                  <span className="text-sm font-medium text-slate-700">{cur.vehicleDetails.registeration_number}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Vehicle Type</span>
                  <span className="text-sm font-medium text-slate-700">{cur.vehicleDetails.car_type}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Transmission</span>
                  <span className="text-sm font-medium text-slate-700">{cur.vehicleDetails.transmition}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Fuel Type</span>
                  <span className="text-sm font-medium text-slate-700">{cur.vehicleDetails.fuel_type}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Seats</span>
                  <span className="text-sm font-medium text-slate-700">{cur.vehicleDetails.seats}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={closeModal}
            className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetailsModal;
