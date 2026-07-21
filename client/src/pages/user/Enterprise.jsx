import { Link } from "react-router-dom";
import Footers from "../../components/Footer";
import { FiTrendingUp, FiShield, FiUsers, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";

const enterpriseBenefits = [
  {
    id: 1,
    title: "Maximize Your Earnings",
    description: "Turn your idle fleet into a consistent revenue stream. Our dynamic pricing engine ensures you get the best rates.",
    icon: <FiDollarSign className="w-8 h-8 text-blue-600" />
  },
  {
    id: 2,
    title: "Complete Insurance Coverage",
    description: "Every trip is backed by our comprehensive insurance policy, protecting your assets from pickup to drop-off.",
    icon: <FiShield className="w-8 h-8 text-blue-600" />
  },
  {
    id: 3,
    title: "Access to Verified Renters",
    description: "We strictly vet our customers, ensuring your vehicles are only driven by verified, responsible drivers.",
    icon: <FiUsers className="w-8 h-8 text-blue-600" />
  },
  {
    id: 4,
    title: "Real-time Analytics",
    description: "Track your fleet's performance, earnings, and maintenance schedules through our advanced vendor dashboard.",
    icon: <FiTrendingUp className="w-8 h-8 text-blue-600" />
  }
];

const stepsToJoin = [
  { step: "01", title: "Sign up as a Vendor", description: "Create your vendor account with basic details." },
  { step: "02", title: "List Your Vehicles", description: "Upload details and photos of your vehicles for admin approval." },
  { step: "03", title: "Get Approved", description: "Our team verifies your vehicles and activates them on the platform." },
  { step: "04", title: "Start Earning", description: "Receive bookings directly and get paid securely every week." }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function Enterprise() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col pt-20 overflow-hidden">
        
        {/* Hero Section */}
        <div className="bg-blue-900 text-white py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-blue-900 to-black"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Partner with Rent-a-Ride
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-10 max-w-3xl mx-auto">
              Join India's fastest-growing car rental network. List your vehicles with us and unlock a seamless, secure, and highly profitable enterprise partnership.
            </p>
            <Link 
              to={'/vendorSignin'} 
              className="inline-block bg-white text-blue-900 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-blue-50 transition-transform transform hover:scale-105"
            >
              Login as Vendor to Start
            </Link>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose Our Enterprise Program?</h2>
            <div className="mt-2 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {enterpriseBenefits.map((benefit) => (
              <motion.div variants={itemVariants} key={benefit.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 text-left group">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* How it works */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
              <div className="mt-2 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </motion.div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-4 gap-8"
            >
              {stepsToJoin.map((item, index) => (
                <motion.div variants={itemVariants} key={index} className="relative text-center px-4 group">
                  <div className="text-6xl font-black text-gray-100 mb-4 group-hover:text-blue-100 transition-colors duration-300">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">{item.title}</h3>
                  <p className="text-gray-600 relative z-10">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Call to action */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 shadow-2xl text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to scale your business?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Whether you have a single car or an entire fleet, our platform provides the tools and audience you need to succeed.
            </p>
            <Link 
              to={'/vendorsignup'} 
              className="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              Register Your Fleet Today
            </Link>
            <p className="mt-4 text-sm text-blue-200">
              Already have a vendor account? <Link to={'/vendorSignin'} className="underline hover:text-white">Sign In here</Link>
            </p>
          </motion.div>
        </div>

      </div>
      <Footers />
    </>
  );
}

export default Enterprise;