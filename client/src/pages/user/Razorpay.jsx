import { toast } from "sonner";
import {
  setLatestBooking,
  setisPaymentDone,
} from "../../redux/user/LatestBookingsSlice";
import { setIsSweetAlert, setPageLoading } from "../../redux/user/userSlice";

export function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

//function to fetch latest bookings from db and update it to redux
export const fetchLatestBooking = async (user_id, dispatch) => {
  try {
    const response = await fetch("/api/user/latestbookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch latest booking");
    }

    const data = await response.json();
    dispatch(setLatestBooking(data));
    dispatch(setisPaymentDone(true));
    return data;
  } catch (error) {
    console.error("Error fetching latest booking:", error);
    return null;
  }
};

//function related to razorpay payment
export async function displayRazorpay(values, navigate, dispatch) {
  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    let refreshToken = localStorage.getItem("refreshToken");
    let accessToken = localStorage.getItem("accessToken");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // 1. Fetch Dynamic Razorpay API Key from our backend
    const keyResponse = await fetch("/api/user/razorpay-key", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken},${accessToken}`,
        "Content-Type": "application/json",
      }
    });
    
    if (!keyResponse.ok) {
      toast.error("Failed to load payment gateway configuration.");
      return;
    }
    
    const { keyId } = await keyResponse.json();

    // 2. Create a new order on backend
    const result = await fetch("/api/user/razorpay", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken},${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await result.json();

    if (!result.ok) {
      toast.error(data?.message || "Failed to create order");
      return;
    }

    // Getting the order details back
    const { amount, id, currency } = data;

    // 3. Open Razorpay Checkout Modal
    const options = {
      key: keyId, // dynamically fetched key
      amount: amount.toString(),
      currency: currency,
      name: "Rent a Ride",
      description: "Vehicle Rental Booking",
      order_id: id,
      handler: async function (response) {
        // 4. Verify cryptographic signature securely on our backend
        const verifyData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };

        const verifyResult = await fetch("/api/user/verify-payment", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshToken},${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verifyData),
        });

        const verifyStatus = await verifyResult.json();

        if (verifyStatus.success) {
          // If signature matches, save booking to DB
          const dbData = { ...values, ...verifyData };
          const bookingResult = await fetch("/api/user/bookCar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dbData),
          });
          
          const successStatus = await bookingResult.json();
          if (successStatus) {
            dispatch(setIsSweetAlert(true));
            await fetchLatestBooking(values.user_id, dispatch);
            navigate("/");
            dispatch(setPageLoading(false));
          }
        } else {
          toast.error("Payment verification failed! Invalid signature.");
          dispatch(setPageLoading(false));
        }
      },
      prefill: {
        name: values.email || "Customer",
        email: values.email || "",
        contact: values.phoneNumber || "",
      },
      theme: {
        color: "#10b981", // modern green
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    dispatch(setPageLoading(false));
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    dispatch(setPageLoading(false));
  }
}

const Razorpay = () => {
  return <div></div>;
};

export default Razorpay;
