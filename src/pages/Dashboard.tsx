import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Calendar, Clock, FileUp, List, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Booking, UserUpload } from '../types';
import { formatDate, cn } from '../lib/utils';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [uploads, setUploads] = useState<UserUpload[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [service, setService] = useState('Wedding Shoot');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (!user) return;

    const bPath = 'bookings';
    const uPath = 'uploads';
    const bQuery = query(collection(db, bPath), where('userId', '==', user.uid));
    const uQuery = query(collection(db, uPath), where('userId', '==', user.uid));

    const unsubB = onSnapshot(bQuery, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, bPath);
    });

    const unsubU = onSnapshot(uQuery, (snapshot) => {
      setUploads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserUpload)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, uPath);
    });

    return () => {
      unsubB();
      unsubU();
    };
  }, [user]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const path = 'bookings';
    try {
      await addDoc(collection(db, path), {
        userId: user.uid,
        userName: profile?.name,
        userEmail: user.email,
        service,
        date,
        notes,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      toast.success('Booking request submitted!');
      setShowBookingForm(false);
      setNotes('');
      setDate('');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const path = 'uploads';
    try {
      await addDoc(collection(db, path), {
        userId: user.uid,
        userName: profile?.name,
        fileUrl,
        fileName,
        createdAt: new Date().toISOString()
      });
      toast.success('File uploaded successfully!');
      setFileUrl('');
      setFileName('');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  if (loading) return <div className="p-12 text-center">Loading your dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome, {profile?.name}</h1>
          <p className="text-gray-400">Manage your bookings and project files here.</p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" /> BOOK A NEW SHOOT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900 rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold">My Bookings</h2>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-black/20 rounded-2xl border border-dashed border-white/10">
                <p className="text-gray-500">No bookings found. Start by booking your first shoot!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{booking.service}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(booking.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.status}</span>
                      </div>
                      {booking.notes && <p className="mt-4 text-sm text-gray-500 italic">"{booking.notes}"</p>}
                    </div>
                    <div className="flex items-center">
                      <span className={cn(
                        "px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                        booking.status === 'Confirmed' ? "bg-green-500/20 text-green-500" :
                        booking.status === 'Completed' ? "bg-blue-500/20 text-blue-500" :
                        "bg-orange-500/20 text-orange-500"
                      )}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Uploads Section */}
        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-8">
              <FileUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold">Project Files</h2>
            </div>

            <form onSubmit={handleUpload} className="mb-8 space-y-4">
              <input
                type="text"
                placeholder="File Name (e.g. Reference Image)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
                className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-orange-500 outline-none transition-colors"
              />
              <input
                type="url"
                placeholder="File URL (Link to your reference)"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                required
                className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-orange-500 outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-colors"
              >
                UPLOAD FILE
              </button>
            </form>

            <div className="space-y-4">
              {uploads.map((upload) => (
                <div key={upload.id} className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="truncate pr-4">
                    <p className="font-medium truncate">{upload.fileName}</p>
                    <p className="text-xs text-gray-500">{formatDate(upload.createdAt)}</p>
                  </div>
                  <a 
                    href={upload.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 text-sm font-bold"
                  >
                    VIEW
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowBookingForm(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-zinc-900 rounded-3xl p-8 border border-white/10 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Book a Shoot</h2>
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Select Service</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-orange-500 outline-none"
                >
                  <option>Wedding Shoot</option>
                  <option>Pre-Wedding Shoot</option>
                  <option>Car Shoot</option>
                  <option>Event Coverage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Tell us about your vision..."
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-orange-500 outline-none resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
