import styles from "../../index";
import Herocar from "../../Assets/homepage_car_copy.jpeg";
import CarSearch from "./CarSearch";
import { HeroParallax } from "../../components/ui/Paralax";
import { useRef } from "react";
import { IconMapPin, IconCalendarEvent, IconCar, IconShieldCheck, IconClock, IconInfinity } from "@tabler/icons-react";

import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsSweetAlert } from "../../redux/user/userSlice";
import Footers from "../../components/Footer";


function Home() {
  const ref = useRef(null);
  const { isSweetAlert } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sweetalert = () => {
    Swal.fire({
      show: true,
      title: "",
      text: "Vehicle Booked Successfully",
      icon: "success",
      showDenyButton: true,
      confirmButtonText: "Go to Home",
      confirmButtonColor:"#22c55e",
      denyButtonColor:'black',
      denyButtonText: `See Orders`,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/')
      }
      else if(result.isDenied){
        navigate('/profile/orders')
      }
    });
    dispatch(setIsSweetAlert(false));
  };

  return (
    <>
      {isSweetAlert && sweetalert()}

      {/* Hero Section Container */}
      <div className="relative min-h-[100vh] w-full mx-auto bg-slate-50 overflow-hidden flex items-center justify-center pt-24 pb-20">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-emerald-300/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 sm:px-12 md:px-18 lg:px-28 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 max-w-2xl flex flex-col justify-center mt-10 md:mt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/60 border border-green-200 text-green-700 font-semibold text-sm mb-6 w-fit backdrop-blur-sm shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
              </span>
              Plan your trip now
            </div>
            
            <h1 className="font-extrabold text-[42px] leading-[1.1] sm:text-[52px] lg:text-[72px] text-slate-800 mb-6 tracking-tight font-poppins">
              Save <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">big</span> with our <br />
              premium rentals
            </h1>
            
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Rent the car of your dreams. Unbeatable prices, unlimited miles, flexible pick-up options, and much more. Experience the journey in comfort.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="bg-green-500 hover:bg-green-600 text-white text-[16px] md:text-lg py-4 px-8 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Book a Ride
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              
              <button
                onClick={() => {
                  ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-800 hover:border-green-500 hover:text-green-500 text-[16px] md:text-lg py-4 px-8 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                Learn More
              </button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="flex-1 hidden sm:flex justify-end items-center relative mt-10 md:mt-0">
             <div className="relative w-full max-w-[600px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-green-300/40 to-emerald-200/40 rounded-full blur-3xl opacity-80 mix-blend-multiply pointer-events-none"></div>
                <img 
                  src={Herocar} 
                  alt="Premium car for rent" 
                  className="relative z-10 w-full h-auto object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                />
             </div>
          </div>
          
        </div>
      </div>

      <div ref={ref} className="scroll-mt-24 pt-10">
        <CarSearch />
      </div>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight font-poppins">How It <span className="text-green-500">Works</span></h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Rent your dream car in three simple steps. It's fast, easy, and completely hassle-free.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                <IconMapPin size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Choose Location</h3>
              <p className="text-slate-600">Select your preferred pick-up and drop-off locations from our wide network of stations.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                <IconCalendarEvent size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Pick-up Date</h3>
              <p className="text-slate-600">Choose your desired rental dates and times. We offer flexible scheduling to fit your plans.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                <IconCar size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Book Your Car</h3>
              <p className="text-slate-600">Select the perfect vehicle for your journey and complete your booking in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-28">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <img src="https://img.freepik.com/premium-photo/luxury-car-rental-car-sale-social-media-instagram-post-template-design_1126722-2530.jpg" alt="Why choose us" className="rounded-3xl shadow-2xl object-cover h-[500px] w-full" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight font-poppins mb-6">Why Choose <span className="text-green-500">Us</span></h2>
              <p className="text-lg text-slate-600 mb-10">We are dedicated to providing the best car rental experience with unmatched quality, safety, and customer satisfaction.</p>
              
              <div className="flex flex-col gap-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                    <IconInfinity size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Unlimited Miles</h4>
                    <p className="text-slate-600">Drive as far as you want without worrying about extra mileage charges. Your journey has no limits.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                    <IconShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Fully Insured</h4>
                    <p className="text-slate-600">Travel with peace of mind. All our vehicles come with comprehensive insurance coverage.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                    <IconClock size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">24/7 Support</h4>
                    <p className="text-slate-600">Our dedicated customer support team is available around the clock to assist you anywhere.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HeroParallax />
      <Footers/>
    </>
  );
}

export default Home;
