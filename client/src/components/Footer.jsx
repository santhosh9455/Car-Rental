import {
  FooterCopyright,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import { BsGithub, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import { Link } from "react-router-dom";

const Footers = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 px-6 sm:px-10 lg:px-20 mt-20 lg:mt-32 border-t border-slate-800">
      <div className="w-full max-w-[1500px] mx-auto">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1 gap-y-12 pb-12">
          
          <div className="max-w-sm">
            <Link to="/" className="inline-block py-2 mb-4 font-extrabold text-[24px] lg:text-[28px] text-white tracking-tight">
              Rent a <span className="text-green-500">Ride</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Experience the best car rental service with unbeatable prices, flexible options, and unlimited miles. Your journey begins here.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-12">
            <div>
              <FooterTitle title="About" className="text-white font-semibold mb-4" />
              <FooterLinkGroup col className="text-slate-400">
                <FooterLink href="#" className="hover:text-green-400 transition-colors">Rent a Ride</FooterLink>
                <FooterLink href="#" className="hover:text-green-400 transition-colors">Car rental</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Follow us" className="text-white font-semibold mb-4" />
              <FooterLinkGroup col className="text-slate-400">
                <FooterLink href="https://github.com/jeevan-aj" className="hover:text-green-400 transition-colors">Github</FooterLink>
                <FooterLink href="#" className="hover:text-green-400 transition-colors">Discord</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Legal" className="text-white font-semibold mb-4" />
              <FooterLinkGroup col className="text-slate-400">
                <FooterLink href="#" className="hover:text-green-400 transition-colors">Privacy Policy</FooterLink>
                <FooterLink href="#" className="hover:text-green-400 transition-colors">Terms &amp; Conditions</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        
        <hr className="border-slate-800 sm:mx-auto my-8" />
        
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright href="#" by="Rent a Ride™" year={2024} className="text-slate-400" />
          <div className="mt-6 flex space-x-6 sm:mt-0 sm:justify-center">
            <FooterIcon href="https://www.linkedin.com/in/jeevan-joji-25b799275/" icon={BsLinkedin} className="text-slate-400 hover:text-green-400 transition-colors" />
            <FooterIcon href="https://github.com/jeevan-aj" icon={BsGithub} className="text-slate-400 hover:text-green-400 transition-colors" />
            <FooterIcon href="#" icon={BsInstagram} className="text-slate-400 hover:text-green-400 transition-colors" />
            <FooterIcon href="#" icon={BsTwitter} className="text-slate-400 hover:text-green-400 transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footers;