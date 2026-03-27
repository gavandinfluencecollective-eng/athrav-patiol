import { Camera, Instagram, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Camera className="w-8 h-8 text-orange-500" />
              <span className="text-xl font-bold tracking-tighter text-white">
                ATHARV PATIL <span className="text-orange-500">VIDEOGRAPHY</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Capturing your most precious moments with cinematic excellence. 
              Specializing in weddings, automotive, and event coverage.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/portfolio" className="hover:text-orange-500 transition-colors">Portfolio</a></li>
              <li><a href="/services" className="hover:text-orange-500 transition-colors">Services</a></li>
              <li><a href="/contact" className="hover:text-orange-500 transition-colors">Book Now</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>atharvpatil8899@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>+91 95279 88366</span>
              </li>
              <li className="flex items-center space-x-4 pt-4">
                <a href="#" className="hover:text-orange-500 transition-colors"><Instagram className="w-6 h-6" /></a>
                <a href="#" className="hover:text-orange-500 transition-colors"><Youtube className="w-6 h-6" /></a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Atharv Patil Videography. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
