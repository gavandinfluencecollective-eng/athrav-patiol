import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">GET IN <span className="text-orange-500">TOUCH</span></h1>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Ready to bring your vision to life? Fill out the form or reach out 
            directly via our contact details. We're excited to work with you!
          </p>

          <div className="space-y-8">
            {[
              { icon: Mail, label: 'Email Us', value: 'atharvpatil8899@gmail.com' },
              { icon: Phone, label: 'Call Us', value: '+91 95279 88366' },
              { icon: MapPin, label: 'Location', value: 'At.Washi, Pen, Raighar, Maharastra (402107)' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-6">
                <div className="w-14 h-14 bg-zinc-900 rounded-2xl border border-white/10 flex items-center justify-center text-orange-500">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-1">{item.label}</p>
                  <p className="text-xl font-bold text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900 p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 focus:border-orange-500 outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 focus:border-orange-500 outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 focus:border-orange-500 outline-none transition-colors"
                placeholder="+91 00000 00000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Your Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 focus:border-orange-500 outline-none transition-colors resize-none"
                placeholder="Tell us about your project..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'SENDING...' : 'SEND MESSAGE'} <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
