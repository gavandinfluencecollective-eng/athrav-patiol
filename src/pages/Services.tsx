import { motion } from 'motion/react';
import { Star, Check, Camera, Play, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import BookingModal from '../components/BookingModal';

export default function Services() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Wedding Shoot');

  const handleBookClick = (serviceName: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedService(serviceName);
    setIsBookingOpen(true);
  };

  const services = [
    {
      title: 'Wedding Shoot',
      icon: Star,
      description: 'Complete cinematic coverage of your special day, including highlights and a full-length film.',
      features: ['2 Cinematographers', '4K Resolution', 'Drone Shots', '15-min Highlight Film', 'Full Event Coverage']
    },
    {
      title: 'Pre-Wedding Shoot',
      icon: Camera,
      description: 'Romantic and creative storytelling sessions at beautiful locations before your big day.',
      features: ['1 Day Shoot', 'Multiple Locations', 'Creative Direction', '3-min Music Video', 'Digital Delivery']
    },
    {
      title: 'Car Shoot',
      icon: Car,
      description: 'High-octane automotive videography capturing the soul and performance of your vehicle.',
      features: ['Rolling Shots', 'Exhaust Audio Recording', 'Color Grading', 'Instagram Reel Edit', '4K Quality']
    },
    {
      title: 'Event Coverage',
      icon: Play,
      description: 'Professional coverage for corporate events, parties, and concerts with quick turnaround.',
      features: ['Single Camera Setup', 'Audio Recording', 'Event Highlights', 'Fast Delivery', '4K Resolution']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16 sm:mb-24">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6">SERVICES</h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">
          We offer a range of professional videography services designed to capture 
          your vision with cinematic precision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 md:p-12 bg-zinc-900 rounded-[30px] sm:rounded-[40px] border border-white/10 hover:border-orange-500/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500">
                <service.icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="text-right">
                <span className="text-[10px] sm:text-sm text-gray-500 font-bold tracking-widest block mb-1">BOOKING</span>
                <span className="text-xl sm:text-3xl font-black text-white uppercase">AVAILABLE</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-4">{service.title}</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-8 leading-relaxed">{service.description}</p>

            <ul className="space-y-3 sm:space-y-4 mb-10">
              {service.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-center gap-3 text-gray-300 text-sm sm:text-base">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleBookClick(service.title)}
              className="block w-full py-4 bg-white text-black font-black text-center rounded-xl sm:rounded-2xl hover:bg-orange-500 hover:text-white transition-all transform group-hover:scale-[1.02] text-sm sm:text-base"
            >
              BOOK THIS SERVICE
            </button>
          </motion.div>
        ))}
      </div>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        initialService={selectedService}
      />
    </div>
  );
}
