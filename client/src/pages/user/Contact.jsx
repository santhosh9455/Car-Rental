import Footers from "../../components/Footer";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";

const contactDetails = [
  {
    id: 1,
    title: "Headquarters",
    description: "123 Main Street, Info Park,\nTrivandrum, Kerala 695581",
    icon: <FiMapPin className="w-8 h-8 text-blue-500" />,
    linkText: "Get Directions",
  },
  {
    id: 2,
    title: "Phone Support",
    description: "+91 8086240993\nMon-Fri from 9am to 6pm",
    icon: <FiPhone className="w-8 h-8 text-blue-500" />,
    linkText: "Call Now",
  },
  {
    id: 3,
    title: "Email Us",
    description: "support@rentaride.com\nWe'll respond within 24 hours.",
    icon: <FiMail className="w-8 h-8 text-blue-500" />,
    linkText: "Send an Email",
  },
  {
    id: 4,
    title: "Working Hours",
    description: "Available 24/7 for emergency\nroadside assistance and support.",
    icon: <FiClock className="w-8 h-8 text-blue-500" />,
    linkText: "Learn More",
  },
];

function Contact() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
              Get in Touch with Us
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help and answer any question you might have. We look forward to hearing from you.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactDetails.map((contact, index) => (
              <motion.div 
                key={contact.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {contact.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{contact.title}</h3>
                <p className="text-gray-600 mb-6 whitespace-pre-line flex-grow">{contact.description}</p>
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  {contact.linkText} &rarr;
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col lg:flex-row"
          >
            <div className="lg:w-1/2 p-12 bg-blue-600 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-700 opacity-20 transform -skew-x-12"></div>
              <h2 className="text-3xl font-bold mb-6 relative z-10">Send us a message</h2>
              <p className="text-blue-100 mb-8 text-lg relative z-10">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center space-x-4">
                  <FiPhone className="w-6 h-6 text-blue-200" />
                  <span className="text-lg">+91 8086240993</span>
                </div>
                <div className="flex items-center space-x-4">
                  <FiMail className="w-6 h-6 text-blue-200" />
                  <span className="text-lg">support@rentaride.com</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 p-12">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg">
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <Footers />
    </>
  );
}

export default Contact;
