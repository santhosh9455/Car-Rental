import { useDispatch, useSelector } from "react-redux";
import { MdCurrencyRupee } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { MdVerifiedUser } from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { displayRazorpay } from "./Razorpay";
import { setPageLoading } from "../../redux/user/userSlice";
import { setisPaymentDone } from "../../redux/user/LatestBookingsSlice";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import { IconCar, IconMapPin, IconCalendar, IconMail, IconPhone, IconHome, IconTicket, IconArrowRight, IconShieldCheck } from "@tabler/icons-react";

export async function sendBookingDetailsEmail(toEmail, bookingDetails, dispatch) {
  try {
    const sendEamil = await fetch("/api/user/sendBookingDetailsEamil", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toEmail, data: bookingDetails }),
    });
    const response = await sendEamil.json();

    if (!response.ok) {
      dispatch(setisPaymentDone(false));
      console.log("something went wrong while sending email");
      return;
    }
    return "good";
  } catch (error) {
    console.log(error);
  }
}

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  phoneNumber: z.string().min(8, { message: "Phone number required" }),
  adress: z.string().min(4, { message: "Address required" }),
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    pickup_district,
    pickup_location,
    dropoff_location,
    dropofftime,
    pickupDate,
    dropoffDate,
  } = useSelector((state) => state.bookingDataSlice);

  const { data, paymentDone } = useSelector((state) => state.latestBookingsSlice);
  const currentUser = useSelector((state) => state.user.currentUser);
  const singleVehicleDetail = useSelector((state) => state.userListVehicles.singleVehicleDetail);
  const { isPageLoading } = useSelector((state) => state.user);

  // Safe defaults if user is not logged in
  const email = currentUser?.email || "";
  const phoneNumber = currentUser?.phoneNumber || "";
  const adress = currentUser?.adress || "";
  const price = singleVehicleDetail?.price || 0;
  const user_id = currentUser?._id;
  const vehicle_id = singleVehicleDetail?._id;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email,
      phoneNumber,
      adress,
      coupon: "",
    },
  });

  const start = pickupDate?.humanReadable ? new Date(pickupDate?.humanReadable) : new Date();
  const end = dropoffDate?.humanReadable ? new Date(dropoffDate?.humanReadable) : new Date();

  const diffMilliseconds = end - start;
  const rawDays = Math.round(diffMilliseconds / (1000 * 3600 * 24));
  const Days = Math.max(1, rawDays); // Minimum 1 day charge

  const [wrongCoupon, setWrongCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);
  const couponValue = watch("coupon");

  const handleCoupon = () => {
    setWrongCoupon(false);
    if (couponValue === "WELCOME50") {
      setDiscount(50);
      toast.success("Coupon applied successfully!");
    } else {
      setDiscount(0);
      setWrongCoupon(true);
    }
  };

  const totalPrice = (price * Days) + 50 - discount;

  const handlePlaceOrder = async (formData) => {
    if (!currentUser) {
      toast.error("Please sign in to place your order.");
      setTimeout(() => navigate("/signin?redirect=/checkoutPage"), 1500);
      return;
    }

    if (!pickup_district || !pickup_location || !dropoff_location || !pickupDate || !dropoffDate) {
      toast.error("Please go back and select all pickup/dropoff details.");
      return;
    }

    const orderData = {
      user_id,
      vehicle_id,
      totalPrice,
      pickupDate: pickupDate.humanReadable,
      dropoffDate: dropoffDate.humanReadable,
      pickup_district,
      pickup_location,
      dropoff_location,
      ...formData
    };

    try {
      dispatch(setPageLoading(true));
      const displayRazorpayResponse = await displayRazorpay(orderData, navigate, dispatch);

      if (!displayRazorpayResponse || !displayRazorpayResponse?.ok) {
        toast.error(displayRazorpayResponse?.message || "Payment failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during checkout.");
    } finally {
      dispatch(setPageLoading(false));
    }
  };

  useEffect(() => {
    if (paymentDone && data) {
      const sendEmail = async () => {
        await sendBookingDetailsEmail(email, data, dispatch);
        dispatch(setisPaymentDone(false));
      };
      sendEmail();
    }
  }, [paymentDone, data, email, dispatch]);

  if (!singleVehicleDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
        <p className="text-xl text-slate-500">No vehicle selected. Please go back and select a vehicle.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <Toaster position="top-center" richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Checkout</h1>
          <p className="text-slate-500 mt-2">Review your order details and complete payment.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Vehicle Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <IconCar className="text-green-500" /> Vehicle Summary
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="w-full sm:w-1/3 bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100">
                    <img
                      src={singleVehicleDetail.image[0]}
                      alt={singleVehicleDetail.model}
                      className="w-full h-32 object-contain"
                    />
                  </div>
                  <div className="w-full sm:w-2/3 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 capitalize">{singleVehicleDetail.model}</h3>
                        <p className="text-slate-500 font-medium">{singleVehicleDetail.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-green-500 flex items-center justify-end">
                          <MdCurrencyRupee size={22} /> {price}
                        </div>
                        <div className="text-xs text-slate-400">per day</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div><span className="text-slate-400">Package:</span> {singleVehicleDetail.base_package}</div>
                      <div><span className="text-slate-400">Fuel:</span> <span className="capitalize">{singleVehicleDetail.fuel_type}</span></div>
                      <div><span className="text-slate-400">Trans.:</span> <span className="capitalize">{singleVehicleDetail.transmition}</span></div>
                      <div><span className="text-slate-400">Reg:</span> {singleVehicleDetail.registeration_number}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trip Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <IconMapPin className="text-green-500" /> Trip Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-8 relative">
                  
                  {/* Divider line for desktop */}
                  <div className="hidden sm:block absolute left-1/2 top-4 bottom-4 w-px bg-slate-100"></div>

                  {/* Pick Up */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Pick Up</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-600"><span className="font-medium text-slate-800">District:</span> {pickup_district || "Not selected"}</p>
                      <p className="text-slate-600"><span className="font-medium text-slate-800">Location:</span> {pickup_location || "Not selected"}</p>
                      <div className="flex items-center gap-2 text-slate-600 mt-3 bg-slate-50 p-2 rounded-lg">
                        <IconCalendar size={16} className="text-green-500" />
                        <span>
                          {pickupDate?.humanReadable ? new Date(pickupDate.humanReadable).toLocaleDateString() : "No date"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <IoMdTime size={16} className="text-green-500" />
                        <span>
                          {pickupDate?.humanReadable ? new Date(pickupDate.humanReadable).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No time"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Drop Off */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Drop Off</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-600"><span className="font-medium text-slate-800">District:</span> {pickup_district || "Not selected"}</p>
                      <p className="text-slate-600"><span className="font-medium text-slate-800">Location:</span> {dropoff_location || "Not selected"}</p>
                      <div className="flex items-center gap-2 text-slate-600 mt-3 bg-slate-50 p-2 rounded-lg">
                        <IconCalendar size={16} className="text-green-500" />
                        <span>
                          {dropoffDate?.humanReadable ? new Date(dropoffDate.humanReadable).toLocaleDateString() : "No date"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <IoMdTime size={16} className="text-green-500" />
                        <span>
                          {dropofftime ? `${dropofftime.hour}:${dropofftime.minute}` : "No time"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Policy Info */}
            <div className="bg-green-50 rounded-2xl p-4 flex items-start gap-4 border border-green-100">
              <div className="mt-1">
                <IconShieldCheck className="text-green-600" size={24} />
              </div>
              <div className="text-sm text-green-800">
                <p className="font-bold mb-1">Downtime Charges: As per policy</p>
                <p className="opacity-90">Policy excess charges waiver for denting and painting excluding major accident repairs.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Details & Form */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden sticky top-28"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-5 border-b border-slate-700">
                <h2 className="text-lg font-bold text-white">Payment Details</h2>
                <p className="text-slate-400 text-sm mt-1">Complete your booking information</p>
              </div>

              <div className="p-6">
                {!currentUser && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                    <div className="text-amber-500 mt-0.5">⚠️</div>
                    <div className="text-sm text-amber-800">
                      <span className="font-semibold">You are not logged in.</span><br/>
                      You must <button onClick={() => navigate('/signin')} className="underline font-bold text-amber-900 hover:text-amber-700">Sign In</button> to complete this booking.
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit(handlePlaceOrder)} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                    <div className="relative">
                      <IconMail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm bg-slate-50"
                        placeholder="you@example.com"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <div className="relative">
                      <IconPhone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm bg-slate-50"
                        placeholder="9876543210"
                        {...register("phoneNumber")}
                      />
                    </div>
                    {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                    <div className="relative">
                      <IconHome size={18} className="absolute left-3.5 top-3 text-slate-400" />
                      <textarea
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm bg-slate-50 resize-none"
                        placeholder="Your full address..."
                        {...register("adress")}
                      />
                    </div>
                    {errors.adress && <p className="mt-1 text-xs text-red-500">{errors.adress.message}</p>}
                  </div>

                  {/* Coupon */}
                  <div className="pt-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Discount Code</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <IconTicket size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm bg-slate-50 uppercase"
                          placeholder="e.g. WELCOME50"
                          {...register("coupon")}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCoupon}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all shadow-md text-sm"
                      >
                        Apply
                      </button>
                    </div>
                    {wrongCoupon && <p className="mt-1 text-xs text-red-500">Invalid coupon code</p>}
                    {discount > 0 && <p className="mt-1 text-xs text-green-600 font-medium">Coupon applied: ₹{discount} off</p>}
                  </div>

                  {/* Bill Summary */}
                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Rent (₹{price} × {Days} days)</span>
                      <span className="font-semibold text-slate-800">₹{price * Days}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Service & Shipping</span>
                      <span className="font-semibold text-slate-800">₹50</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount Applied</span>
                        <span className="font-semibold">-₹{discount}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Total */}
                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-base font-bold text-slate-800">Total Amount</span>
                    <span className="text-2xl font-black text-green-500 flex items-center">
                      <MdCurrencyRupee size={24} />{totalPrice}
                    </span>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isPageLoading}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isPageLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                      </span>
                    ) : (
                      <>Place Order <IconArrowRight size={20} /></>
                    )}
                  </button>

                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
