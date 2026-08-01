import styles from "../index";
import { navLinks } from "../constants";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdMenuOpen } from "react-icons/md";
import { useState, useEffect } from "react";
import { Drawer } from "antd";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="w-full flex justify-between items-center px-6 sm:px-12 md:px-18 lg:px-28 max-w-[1500px] mx-auto">
        <Link to="/">
          <div className="text-[20px] md:text-[24px] font-poppins font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            Rent a <span className="text-green-500">Ride</span>
          </div>
        </Link>

        <div className="hidden lg:block">
          <ul className="flex list-none gap-8">
            {navLinks.map((navlink, index) => {
              const isActive = location.pathname === navlink.path;
              return (
                <li key={index}>
                  <Link
                    to={navlink.path}
                    className={`font-poppins cursor-pointer font-medium text-[15px] transition-colors duration-300 hover:text-green-500 ${
                      isActive ? "text-green-500" : "text-slate-600"
                    }`}
                  >
                    {navlink.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex gap-4 items-center">
          <div className="hidden md:flex items-center gap-4">
            {currentUser && !currentUser.isAdmin && !currentUser.isVendor ? (
              <Link to={"/profile"}>
                <img
                  src={`${currentUser.profilePicture}`}
                  alt="profile"
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-green-500 ring-offset-2 transition-transform hover:scale-105"
                />
              </Link>
            ) : (
              <>
                <Link to={"/signIn"}>
                  <button className="text-slate-600 font-medium hover:text-green-500 transition-colors px-4 py-2">
                    Sign In
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:-translate-y-0.5">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setNav(!nav)}
              className="text-slate-800 text-2xl hover:text-green-500 transition-colors"
            >
              {nav ? <MdMenuOpen /> : <RxHamburgerMenu />}
            </button>
            <Drawer
              destroyOnClose={true}
              onClose={() => setNav(false)}
              open={nav}
              placement="right"
              width={280}
            >
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((navlink, index) => {
                    const isActive = location.pathname === navlink.path;
                    return (
                      <Link
                        key={index}
                        to={navlink.path}
                        className={`text-xl font-semibold transition-colors ${
                          isActive ? "text-green-500" : "text-slate-700 hover:text-green-500"
                        }`}
                        onClick={() => setNav(false)}
                      >
                        {navlink.title}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-auto pt-8 flex flex-col gap-4">
                  {currentUser && !currentUser.isAdmin && !currentUser.isVendor ? (
                    <Link to={"/profile"} onClick={() => setNav(false)}>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <img
                          src={`${currentUser.profilePicture}`}
                          alt="profile"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-800">My Profile</span>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link to={"/signIn"} onClick={() => setNav(false)}>
                        <button className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-green-500 hover:text-green-500 transition-colors">
                          Sign In
                        </button>
                      </Link>
                      <Link to={"/signup"} onClick={() => setNav(false)}>
                        <button className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 transition-colors">
                          Sign Up
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
