import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Calendar, Clock, FileUp, List, Plus, MapPin } from 'lucide-react';
import { Booking } from '../types';
import { formatDate, cn } from '../lib/utils';
import BookingModal from '../components/BookingModal';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const bPath = 'bookings';
    const bQuery = query(collection(db, bPath), where('userId', '==', user.uid));

    const unsubB = onSnapshot(bQuery, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, bPath);
    });

    return () => {
      unsubB();
    };
  }, [user]);

  if (loading) return <div className="p-12 text-center">Loading your dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome, {profile?.name}</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage your cinematic shoot bookings here.</p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" /> BOOK A NEW SHOOT
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Bookings Section */}
        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-bold">My Bookings</h2>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-black/20 rounded-2xl border border-dashed border-white/10">
                <p className="text-gray-500">No bookings found. Start by booking your first shoot!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-4 sm:p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold mb-1">{booking.service}</h3>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 sm:w-4 sm:h-4" /> {formatDate(booking.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 sm:w-4 sm:h-4" /> {booking.time || 'N/A'}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 sm:w-4 sm:h-4" /> {booking.location || 'N/A'}</span>
                        <span className="flex items-center gap-1"><List className="w-3 h-3 sm:w-4 sm:h-4" /> {booking.status}</span>
                      </div>
                      {booking.notes && <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 italic">"{booking.notes}"</p>}
                    </div>
                    <div className="flex items-center sm:justify-end">
                      <span className={cn(
                        "px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest",
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
      </div>

      <BookingModal 
        isOpen={showBookingForm} 
        onClose={() => setShowBookingForm(false)} 
      />
    </div>
  );
}
