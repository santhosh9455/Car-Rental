
const Footer = () => {
  return (
    <div className="mt-12 w-full flex flex-col items-center justify-center py-6 px-4 bg-white border-t border-gray-200">
      <p className="text-sm text-gray-500 mb-2 font-medium">
        © {new Date().getFullYear()} Rent-a-Ride Admin Dashboard
      </p>
      <div className="flex space-x-4 text-xs text-gray-400">
        <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
        <span>•</span>
        <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
        <span>•</span>
        <a href="#" className="hover:text-blue-500 transition-colors">Support</a>
      </div>
    </div>
  );
};

export default Footer;