import { useSelector, useDispatch } from "react-redux";
import UserProfileSidebar from "../../components/UserProfileSidebar";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Orders from "./Orders";
import UserProfileContent from "../../components/UserProfileContent";
import Favorites from "./Favorites";
import { showSidebarOrNot } from "../../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { IconMenu2, IconArrowLeft, IconUser, IconShoppingBag, IconHeart, IconX } from "@tabler/icons-react";

const navLinks = [
  { to: "/profile/profiles", label: "My Profile", icon: <IconUser size={18} /> },
  { to: "/profile/orders", label: "My Orders", icon: <IconShoppingBag size={18} /> },
  { to: "/profile/favorites", label: "Favorites", icon: <IconHeart size={18} /> },
];

function Profile() {
  const { isError } = useSelector((state) => state.user);
  const { activeMenu } = useSelector((state) => state.adminDashboardSlice);
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors font-medium">
            <IconArrowLeft size={16} />
            Back to Home
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-bold text-slate-700">My Account</span>
          {isError && (
            <span className="ml-auto text-xs text-red-500">{isError.message}</span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ─── Sidebar: always visible on lg ─── */}
          <aside className="hidden lg:flex flex-col gap-2 w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sticky top-24">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">Navigation</p>
              {navLinks.map(({ to, label, icon }) => {
                const active = location.pathname === to || location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                      active
                        ? "bg-green-50 text-green-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className={active ? "text-green-600" : "text-slate-400"}>{icon}</span>
                    {label}
                  </Link>
                );
              })}

              {/* Hidden syncfusion sidebar for mobile compat */}
              <div className="hidden">
                <UserProfileSidebar />
              </div>
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <main className="flex-1 min-w-0">
            {/* Mobile top nav */}
            <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto pb-1">
              {navLinks.map(({ to, label, icon }) => {
                const active = location.pathname === to || location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                      active
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-600"
                    }`}
                  >
                    {icon}
                    {label}
                  </Link>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 min-h-[60vh] p-6">
              <Routes>
                <Route path="/" element={<UserProfileContent />} />
                <Route path="/profiles" element={<UserProfileContent />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile;
