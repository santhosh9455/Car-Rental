import { GrSecure } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaCalendarAlt, FaCog, FaCarSide, FaBuilding } from "react-icons/fa";
import { MdAirlineSeatReclineExtra, MdCurrencyRupee } from "react-icons/md";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { showVehicles } from "../../redux/user/listAllVehicleSlice";
import { motion } from "framer-motion";
import { IconArrowLeft, IconShieldCheck, IconRefresh } from "@tabler/icons-react";

const specItem = (icon, label, value) => (
  <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0 text-sm">
      {icon}
    </div>
    <div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold text-slate-800 capitalize">{value || "—"}</div>
    </div>
  </div>
);

const VehicleDetails = () => {
  const { singleVehicleDetail } = useSelector((state) => state.userListVehicles);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);

  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/listAllVehicles", {
          headers: { Authorization: `Bearer ${refreshToken},${accessToken}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        dispatch(showVehicles(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleBook = () => navigate("/checkoutPage");

  if (!singleVehicleDetail || !singleVehicleDetail._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Vehicle details not found.</p>
          <Link to="/vehicles" className="text-green-500 font-semibold underline">
            Browse Vehicles
          </Link>
        </div>
      </div>
    );
  }

  const v = singleVehicleDetail;
  const images = v.image || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link
            to="/vehicles"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors font-medium"
          >
            <IconArrowLeft size={16} />
            Back to Fleet
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-700 font-semibold capitalize">{v.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ─── Left: Image Gallery ─── */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
            >
              {/* Main Image */}
              <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 h-72 sm:h-96 p-8">
                <img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={v.name}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 p-4 border-t border-slate-100 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === selectedImage ? "border-green-500 shadow-md" : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Description */}
            {v.car_description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mt-6"
              >
                <h3 className="font-bold text-slate-800 text-lg mb-3">
                  {v.car_title || "About this vehicle"}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">{v.car_description}</p>
              </motion.div>
            )}
          </div>

          {/* ─── Right: Details & Booking ─── */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Name + Rating */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h1 className="text-3xl font-extrabold text-slate-800 capitalize mb-1">{v.name}</h1>
                <div className="flex items-center gap-1 text-amber-400 text-sm mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <FaStar key={s} className={s <= (v.rating || 5) ? "text-amber-400" : "text-slate-200"} />
                  ))}
                  <span className="text-slate-400 ml-1 text-xs">({v.rating || 5}/5)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-5">
                  <div className="flex items-center text-3xl font-extrabold text-green-600">
                    <MdCurrencyRupee size={24} />
                    {v.price}
                  </div>
                  <span className="text-slate-400 text-sm">/ day</span>
                </div>

                <button
                  onClick={handleBook}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-xl shadow-green-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <GrSecure />
                  Book This Ride
                </button>

                <div className="flex gap-3 mt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1"><IconShieldCheck size={14} className="text-green-500" /> Fully Insured</div>
                  <div className="flex items-center gap-1"><IconRefresh size={14} className="text-green-500" /> Free Cancellation</div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Vehicle Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {specItem(<FaBuilding />, "Company", v.company)}
                  {specItem(<FaCarSide />, "Model", v.model)}
                  {specItem(<FaCalendarAlt />, "Year", v.year_made)}
                  {specItem(<FaCog />, "Transmission", v.transmition)}
                  {specItem(<FaCarSide />, "Type", v.car_type)}
                  {specItem(<MdAirlineSeatReclineExtra />, "Seats", v.seats)}
                  {specItem(<BsFillFuelPumpFill />, "Fuel", v.fuel_type)}
                  {specItem(<span className="text-xs font-bold">REG</span>, "Reg. Number", v.registeration_number)}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
