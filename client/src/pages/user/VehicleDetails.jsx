import { GrSecure } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaCalendarAlt, FaCog, FaCarSide, FaBuilding } from "react-icons/fa";
import { MdAirlineSeatReclineExtra, MdCurrencyRupee } from "react-icons/md";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { showVehicles } from "../../redux/user/listAllVehicleSlice";
import { motion } from "framer-motion";
import { IconArrowLeft, IconShieldCheck, IconRefresh, IconMapPinFilled, IconCalendarEvent } from "@tabler/icons-react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { setSelectedData } from "../../redux/user/BookingDataSlice";
import { setLocationsOfDistrict, setSelectedDistrict } from "../../redux/user/selectRideSlice";
import useFetchLocationsLov from "../../hooks/useFetchLocationsLov";
import { toast } from "sonner";

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

const schema = z.object({
  dropoff_location: z.string().min(1, { message: "Dropoff location needed" }),
  pickup_district: z.string().min(1, { message: "Pickup District needed" }),
  pickup_location: z.string().min(1, { message: "Pickup Location needed" }),
  pickuptime: z.object({
    $d: z.instanceof(Date).refine((date) => date !== null && date !== undefined, {
      message: "Date is not selected",
    }),
  }).nullable(),
  dropofftime: z.object({
    $d: z.instanceof(Date).refine((date) => date !== null && date !== undefined, {
      message: "Date is not selected",
    }),
  }).nullable(),
});

const VehicleDetails = () => {
  const { singleVehicleDetail } = useSelector((state) => state.userListVehicles);
  const { districtData } = useSelector((state) => state.modelDataSlice);
  const { selectedDistrict, wholeData, locationsOfDistrict } = useSelector((state) => state.selectRideSlice);
  
  // Also load currently selected booking data so they don't have to re-select if coming from search
  const bookingData = useSelector((state) => state.bookingDataSlice);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchLov, isLoading } = useFetchLocationsLov();

  const [selectedImage, setSelectedImage] = useState(0);
  const [pickup, setPickup] = useState(null);

  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  // Format existing redux date to Dayjs for MUI
  const defaultPickupTime = bookingData.pickupDate?.humanReadable ? dayjs(bookingData.pickupDate.humanReadable) : null;
  const defaultDropoffTime = bookingData.dropoffDate?.humanReadable ? dayjs(bookingData.dropoffDate.humanReadable) : null;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pickup_district: bookingData.pickup_district || "",
      pickup_location: bookingData.pickup_location || "",
      dropoff_location: bookingData.dropoff_location || "",
      pickuptime: defaultPickupTime,
      dropofftime: defaultDropoffTime,
    },
  });

  const uniqueDistrict = districtData?.filter((cur, idx) => {
    return cur !== districtData[idx + 1];
  });

  useEffect(() => {
    fetchLov();
    if (!singleVehicleDetail || !singleVehicleDetail._id) {
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
    }
  }, []);

  useEffect(() => {
    if (selectedDistrict !== null) {
      const showLocationInDistrict = wholeData
        .filter((cur) => cur.district === selectedDistrict)
        .map((cur) => cur.location);
      dispatch(setLocationsOfDistrict(showLocationInDistrict));
    }
  }, [selectedDistrict, wholeData]);

  // Make sure we initialize locations if user came with a pre-selected district
  useEffect(() => {
    if (bookingData.pickup_district && !selectedDistrict) {
      dispatch(setSelectedDistrict(bookingData.pickup_district));
    }
  }, [bookingData.pickup_district]);

  const handleBook = async (data) => {
    // Save to redux booking slice so checkout page has it
    dispatch(setSelectedData(data));
    navigate("/checkoutPage");
  };

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
  const oneDayGap = pickup ? pickup.add(1, "day") : dayjs().add(1, "day");

  return (
    <div className="min-h-screen mt-16 bg-slate-50">
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
          
          {/* ─── Left: Image Gallery & Specs ─── */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 h-72 sm:h-96 p-8">
                <img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={v.name}
                  className="h-full w-full object-contain"
                />
              </div>
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

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h3 className="font-bold text-slate-800 mb-4">Vehicle Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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

            {v.car_description && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 text-lg mb-3">
                  {v.car_title || "About this vehicle"}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">{v.car_description}</p>
              </div>
            )}
          </div>

          {/* ─── Right: Details & Booking Form ─── */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden sticky top-28"
            >
              <div className="p-6 border-b border-slate-100">
                <h1 className="text-2xl font-extrabold text-slate-800 capitalize mb-1">{v.name}</h1>
                <div className="flex items-center gap-1 text-amber-400 text-sm mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <FaStar key={s} className={s <= (v.rating || 5) ? "text-amber-400" : "text-slate-200"} />
                  ))}
                  <span className="text-slate-400 ml-1 text-xs">({v.rating || 5}/5)</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <div className="flex items-center text-3xl font-black text-green-600">
                    <MdCurrencyRupee size={24} />
                    {v.price}
                  </div>
                  <span className="text-slate-400 text-sm">/ day</span>
                </div>
              </div>

              <div className="p-6 bg-slate-50">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <IconCalendarEvent size={20} className="text-green-500" />
                  Trip Details
                </h3>
                
                <form onSubmit={handleSubmit(handleBook)} className="space-y-4">
                  
                  {/* District */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Pick-up District</label>
                    <Controller
                      name="pickup_district"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          size="small"
                          error={Boolean(errors.pickup_district)}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            dispatch(setSelectedDistrict(e.target.value));
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.75rem', backgroundColor: 'white' } }}
                        >
                          {isLoading ? (
                            <MenuItem value=""><span className="animate-pulse">Loading...</span></MenuItem>
                          ) : (
                            <MenuItem value="">Select District</MenuItem>
                          )}
                          {uniqueDistrict?.map((cur, idx) => (
                            <MenuItem value={cur} key={idx} className="capitalize">{cur}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    {errors.pickup_district && <p className="text-xs text-red-500">{errors.pickup_district.message}</p>}
                  </div>

                  {/* Locations Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">Pick-up Location</label>
                      <Controller
                        name="pickup_location"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            size="small"
                            error={Boolean(errors.pickup_location)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.75rem', backgroundColor: 'white' } }}
                          >
                            <MenuItem value="">Select</MenuItem>
                            {locationsOfDistrict && locationsOfDistrict.map((loc, idx) => (
                              <MenuItem value={loc} key={idx} className="capitalize">{loc}</MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                      {errors.pickup_location && <p className="text-xs text-red-500">{errors.pickup_location.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">Drop-off Location</label>
                      <Controller
                        name="dropoff_location"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            size="small"
                            error={Boolean(errors.dropoff_location)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.75rem', backgroundColor: 'white' } }}
                          >
                            <MenuItem value="">Select</MenuItem>
                            {locationsOfDistrict && locationsOfDistrict.map((loc, idx) => (
                              <MenuItem value={loc} key={idx} className="capitalize">{loc}</MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                      {errors.dropoff_location && <p className="text-xs text-red-500">{errors.dropoff_location.message}</p>}
                    </div>
                  </div>

                  {/* Dates Row */}
                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-sm font-semibold text-slate-700">Pick-up Date & Time</label>
                    <Controller
                      name="pickuptime"
                      control={control}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            {...field}
                            minDate={dayjs()}
                            onChange={(newValue) => {
                              field.onChange(newValue);
                              setPickup(newValue);
                            }}
                            slotProps={{ textField: { size: 'small', fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: '0.75rem', backgroundColor: 'white' } } } }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    {errors.pickuptime && <p className="text-xs text-red-500">{errors.pickuptime.message}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Drop-off Date & Time</label>
                    <Controller
                      name="dropofftime"
                      control={control}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            {...field}
                            minDate={oneDayGap}
                            onChange={(newValue) => field.onChange(newValue)}
                            slotProps={{ textField: { size: 'small', fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: '0.75rem', backgroundColor: 'white' } } } }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    {errors.dropofftime && <p className="text-xs text-red-500">{errors.dropofftime.message}</p>}
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-200">
                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg transition-all shadow-xl shadow-green-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <GrSecure />
                      Proceed to Checkout
                    </button>
                    
                    <div className="flex gap-3 mt-4 text-xs text-slate-500 justify-center">
                      <div className="flex items-center gap-1"><IconShieldCheck size={14} className="text-green-500" /> Fully Insured</div>
                      <div className="flex items-center gap-1"><IconRefresh size={14} className="text-green-500" /> Free Cancellation</div>
                    </div>
                  </div>

                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
