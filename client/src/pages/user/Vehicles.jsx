import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setVariants,
  setVehicleDetail,
  showVehicles,
} from "../../redux/user/listAllVehicleSlice";
import { FaCarSide, FaGasPump, FaUserAlt } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Filter from "../../components/Filter";
import Sort from "../../components/Sort";
import { signOut } from "../../redux/user/userSlice";
import Footers from "../../components/Footer";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import { IconAdjustmentsHorizontal, IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const ITEMS_PER_PAGE = 9;

export const onVehicleDetail = async (id, dispatch, navigate) => {
  try {
    const res = await fetch("/api/user/showVehicleDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.statusCode === 401 || data.statusCode === 403) {
      dispatch(signOut());
    }
    dispatch(setVehicleDetail(data));
    navigate("/vehicleDetails");
  } catch (error) {
    console.log(error);
  }
};

const VehicleCard = ({ cur, dispatch, navigate, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 24 }}
    transition={{ duration: 0.35, delay: (idx % ITEMS_PER_PAGE) * 0.05 }}
    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col"
  >
    {/* Image */}
    <div className="bg-slate-50 flex items-center justify-center h-48 overflow-hidden border-b border-slate-100 p-2">
      <img
        src={cur.image[0]}
        alt={cur.name}
        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
      />
    </div>

    {/* Body */}
    <div className="p-5 flex flex-col flex-1">
      {/* Name & Price */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-base font-bold text-slate-800 capitalize">{cur.name}</h2>
        <div className="text-right">
          <div className="flex items-center justify-end text-green-600 font-extrabold text-lg">
            <MdCurrencyRupee size={16} className="mr-0.5" />
            {cur.price}
          </div>
          <div className="text-[10px] text-slate-400 -mt-0.5">per day</div>
        </div>
      </div>

      {/* Specs */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1.5">
          <FaCarSide className="text-green-500" /> {cur.company}
        </span>
        <span className="flex items-center gap-1.5">
          <FaUserAlt className="text-green-500" /> {cur.seats} Seats
        </span>
        <span className="flex items-center gap-1.5">
          <FaCarSide className="text-slate-400" /> {cur.car_type}
        </span>
        <span className="flex items-center gap-1.5 capitalize">
          <FaGasPump className="text-slate-400" /> {cur.fuel_type}
        </span>
      </div>

      <div className="border-t border-slate-100 pt-4 mt-auto flex gap-3">
        <button
          onClick={() => onVehicleDetail(cur._id, dispatch, navigate)}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-green-500/20 hover:-translate-y-0.5"
        >
          Book Ride
        </button>
        <button
          onClick={() => onVehicleDetail(cur._id, dispatch, navigate)}
          className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
        >
          Details
        </button>
      </div>
    </div>
  </motion.div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 mt-10 mb-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-slate-200 hover:border-green-400 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <IconChevronLeft size={18} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
            p === currentPage
              ? "bg-green-500 text-white shadow-md shadow-green-500/30"
              : "border border-slate-200 text-slate-600 hover:border-green-400 hover:bg-green-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-slate-200 hover:border-green-400 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <IconChevronRight size={18} />
      </button>
    </div>
  );
};

const Vehicles = () => {
  const { userAllVehicles } = useSelector((state) => state.userListVehicles);
  const { data, filterdData } = useSelector((state) => state.sortfilterSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || "";
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    dispatch(setVariants(null));
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/user/listAllVehicles`, {
          headers: { Authorization: `Bearer ${refreshToken},${accessToken}` },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          dispatch(showVehicles(data));
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, data]);

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [filterdData]);

  const activeVehicles = (
    filterdData && filterdData.length > 0 ? filterdData : userAllVehicles || []
  ).filter((v) => v.isDeleted === "false" && v.isAdminApproved);

  const totalPages = Math.max(1, Math.ceil(activeVehicles.length / ITEMS_PER_PAGE));
  const paginated = activeVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {/* Page Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 mt-24 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Our <span className="text-green-400">Fleet</span>
          </h1>
          <p className="text-slate-400 mt-2">
            {activeVehicles.length} vehicles available for rent
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ─── Sidebar Filter: always visible on lg ─── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Filters</h2>
              <Filter />
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <div className="flex-1 min-w-0">
            {/* Sort + Mobile filter toggle */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex-1">
                <Sort />
              </div>
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-md"
              >
                <IconAdjustmentsHorizontal size={18} />
                Filters
              </button>
            </div>

            {/* Cards grid */}
            {isLoading ? (
              <SkeletonLoader />
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <FaCarSide className="text-6xl mb-4 text-slate-200" />
                <p className="text-xl font-semibold">No vehicles found</p>
                <p className="text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginated.map((cur, idx) => (
                      <VehicleCard
                        key={cur._id || idx}
                        cur={cur}
                        idx={idx}
                        dispatch={dispatch}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                </AnimatePresence>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile Filter Drawer ─── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Filters</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <IconX size={20} />
                </button>
              </div>
              <div className="p-5">
                <Filter />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footers />
    </>
  );
};

export default Vehicles;
