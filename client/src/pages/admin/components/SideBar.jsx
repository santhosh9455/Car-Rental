import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { links } from "../data/SidebarContents.jsx";
import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../../redux/user/userSlice.jsx";
import { showSidebarOrNot } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice.jsx";

const SideBar = () => {
  const { activeMenu, screenSize } = useSelector(
    (state) => state.adminDashboardSlice
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeLink =
    "flex items-center gap-4 pl-4 pt-3 pb-2.5 rounded-xl text-emerald-900 bg-emerald-50 shadow-md text-md font-bold mx-2 my-1 transition-all";
  const normalLink =
    "flex items-center gap-4 pl-4 pt-3 pb-2.5 rounded-xl text-md text-emerald-100 hover:text-white hover:bg-emerald-700 font-medium mx-2 my-1 transition-all";

  //SignOut
  const handleSignout = async () => {
    const res = await fetch("/api/admin/signout", {
      method: "GET",
    });
    const data = await res.json();
    if (data) {
      dispatch(signOut());
      navigate("/signin");
    }
  };

  return (
    <div className="h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 bg-emerald-900 shadow-xl border-r border-emerald-800">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to={`/adminDashboard`}
              onClick={() => {}}
              className="items-center flex gap-3 mt-6 ml-6 text-2xl font-extrabold text-white tracking-tight"
            >
              <SiShopware className="text-emerald-400" />
              <span>Rent<span className="text-emerald-400">a</span>Ride</span>
            </Link>
            <TooltipComponent content={"menu"} position="BottomCenter">
              <button
                className="text-xl rounded-full p-3 mt-4 block md:hidden hover:bg-gray-500"
                onClick={() => {}}
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            {links.map((cur, idx) => (
              <div key={idx}>
                <p className="text-emerald-400/80 font-bold text-xs uppercase tracking-widest mx-6 mt-8 mb-3">{cur.title}</p>
                {cur.links.map((link) => (
                  <NavLink
                    to={`/adminDashboard/${link.name}`}
                    key={link.name}
                    onClick={() => {
                      if (screenSize <= 900 && activeMenu) {
                        dispatch(showSidebarOrNot(false));
                      }
                    }}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
            <div className="flex items-center mt-12 mx-4 gap-3 text-emerald-100 hover:text-white hover:bg-red-500/20 p-3 rounded-xl cursor-pointer transition-all font-medium border border-transparent hover:border-red-500/30" onClick={handleSignout}>
              <CiLogout size={22} className="text-red-400" />
              <span>Sign Out</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
