import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Play, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
              CAPTURING <span className="text-orange-500 italic">MOTION</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
              Cinematic videography for those who value moments over memories. 
              Specializing in weddings, automotive, and high-end events.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                BOOK A SHOOT <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/portfolio"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
              >
                VIEW PORTFOLIO <Play className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">OUR SERVICES</h2>
              <p className="text-gray-400 max-w-md">Professional videography tailored to your specific needs and vision.</p>
            </div>
            <Link to="/services" className="text-orange-500 font-bold hover:underline flex items-center gap-2">
              ALL SERVICES <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Wedding Shoot', icon: Star },
              { title: 'Car Shoot', icon: Camera },
              { title: 'Event Coverage', icon: Play },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-orange-500/50 transition-all"
              >
                <service.icon className="w-12 h-12 text-orange-500 mb-6" />
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-400 mb-6">Professional cinematic coverage for your special moments.</p>
                <Link to="/contact" className="text-sm font-bold tracking-widest text-orange-500 hover:text-orange-400">
                  BOOK NOW
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000" 
              alt="About Us" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-orange-500/10" />
          </div>
          <div>
            <span className="text-orange-500 font-bold tracking-widest text-sm mb-4 block">WHY CHOOSE US</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">WE DON'T JUST RECORD, WE TELL STORIES.</h2>
            <div className="space-y-8">
              {[
                { title: 'Cinematic Quality', desc: 'We use industry-standard equipment to deliver 4K cinematic results.' },
                { title: 'Fast Delivery', desc: 'Get your edited videos within 7-14 business days.' },
                { title: 'Custom Packages', desc: 'Flexible options and services tailored to your specific needs.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <span className="text-orange-500 font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
