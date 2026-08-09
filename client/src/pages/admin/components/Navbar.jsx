import { useDispatch, useSelector } from "react-redux";
import {
  openPages,
  setScreenSize,
  showSidebarOrNot,
  toggleSidebar,
} from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Chat, Notification, UserProfile } from ".";
import profiile from "../../../Assets/profile dummy image.png";
import { useEffect } from "react";
import PropTypes from "prop-types";

const Navbar = () => {
  const dispatch = useDispatch();
  const { chat, notification, userProfile, screenSize } = useSelector(
    (state) => state.adminDashboardSlice
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      dispatch(showSidebarOrNot(false));
    } else {
      dispatch(showSidebarOrNot(true));
    }
  }, [screenSize]);

  const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
    <TooltipComponent content={title} position={"BottomCenter"}>
      <button
        type="button"
        onClick={customFunc}
        style={{ color, dotColor }}
        className="relative text-xl p-3  hover:bg-gray-100  rounded-full mb-2"
      >
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full right-[8px] top-2  h-2 w-2"
        ></span>
        {icon}
      </button>
    </TooltipComponent>
  );

  NavButton.propTypes = {
    title: PropTypes.string.isRequired,
    customFunc: PropTypes.func.isRequired,
    icon: PropTypes.node, // assuming icon can be any renderable component
    color: PropTypes.string,
    dotColor: PropTypes.string,
  };

  return (
    <div className="flex justify-between max-w-[100%] p-2 relative border-b shadow-sm shadow-slate-100 bg-white">
      <div className="flex ">
        <NavButton
          title="Menu"
          customFunc={() => dispatch(toggleSidebar())}
          color={"#0f172a"}
          icon={<AiOutlineMenu />}
        />
      </div>

      <div className="flex justify-between text-slate-800">

        <NavButton
          title="Chat"
          customFunc={() => dispatch(openPages("chat"))}
          color={"#0f172a"}
          dotColor={"#0ea5e9"}
          icon={<BsChatLeft />}
        />

        <NavButton
          title="Notification"
          customFunc={() => dispatch(openPages("notification"))}
          color={"#0f172a"}
          dotColor={"#f59e0b"}
          icon={<RiNotification3Line />}
        />
        <TooltipComponent content="profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg mt-1"
            onClick={() => dispatch(openPages("userProfile"))}
          >
            <img 
              src={currentUser?.profilePicture || profiile} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover border border-slate-200" 
            />
            <p className="hidden md:block">
              <span className="text-[14px] text-slate-500">Hi,</span>{" "}
              <span className="text-slate-800 font-semibold text-[14px] ml-1">
                {currentUser?.username || "Admin"}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-slate-500" size={20} />
          </div>
        </TooltipComponent>


        {chat && <div className="relative top-9 right-0"><Chat /></div>}
        {notification && <div className="relative top-9 right-0"><Notification /></div>}
        {userProfile && <div className="relative top-9 right-0"><UserProfile /></div>}
      </div>
    </div>
  );
};

export default Navbar;
