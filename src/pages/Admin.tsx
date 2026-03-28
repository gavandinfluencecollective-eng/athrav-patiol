import React, { useState, useEffect, useRef } from 'react';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, updateDoc, doc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Users, Calendar, Camera, FileUp, MessageSquare, 
  Check, X, Trash2, Plus, Edit2, LayoutDashboard, Upload, Loader2, Play
} from 'lucide-react';
import { toast } from 'sonner';
import { Booking, UserProfile, Service, PortfolioItem, UserUpload, ContactMessage } from '../types';
import { formatDate, cn } from '../lib/utils';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'users' | 'services' | 'portfolio' | 'uploads' | 'messages'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [uploads, setUploads] = useState<UserUpload[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Portfolio Management State
  const [uploading, setUploading] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<{ id: string, name: string }[]>([]);
  const [portfolioCategory, setPortfolioCategory] = useState<'Wedding' | 'Cars' | 'Events'>('Wedding');
  const [portfolioType, setPortfolioType] = useState<'image' | 'video'>('video');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubB = onSnapshot(collection(db, 'bookings'), (s) => setBookings(s.docs.map(d => ({ id: d.id, ...d.data() } as Booking))), (e) => handleFirestoreError(e, OperationType.GET, 'bookings'));
    const unsubU = onSnapshot(collection(db, 'users'), (s) => setUsers(s.docs.map(d => ({ ...d.data() } as UserProfile))), (e) => handleFirestoreError(e, OperationType.GET, 'users'));
    const unsubS = onSnapshot(collection(db, 'services'), (s) => setServices(s.docs.map(d => ({ id: d.id, ...d.data() } as Service))), (e) => handleFirestoreError(e, OperationType.GET, 'services'));
    const unsubP = onSnapshot(collection(db, 'portfolio'), (s) => setPortfolio(s.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioItem))), (e) => handleFirestoreError(e, OperationType.GET, 'portfolio'));
    const unsubUp = onSnapshot(query(collection(db, 'uploads'), orderBy('createdAt', 'desc')), (s) => setUploads(s.docs.map(d => ({ id: d.id, ...d.data() } as UserUpload))), (e) => handleFirestoreError(e, OperationType.GET, 'uploads'));
    const unsubM = onSnapshot(query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc')), (s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage))), (e) => handleFirestoreError(e, OperationType.GET, 'contact_messages'));

    return () => {
      unsubB(); unsubU(); unsubS(); unsubP(); unsubUp(); unsubM();
    };
  }, []);

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadId = Math.random().toString(36).substring(7);
    setPendingUploads(prev => [...prev, { id: uploadId, name: file.name }]);
    setUploading(true);
    
    try {
      const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'portfolio'), {
        mediaUrl: url,
        category: portfolioCategory,
        type: portfolioType,
        createdAt: new Date().toISOString()
      });

      toast.success('Portfolio item added successfully!');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setPendingUploads(prev => prev.filter(p => p.id !== uploadId));
    }
  };

  const clearPortfolio = async () => {
    if (!confirm('Are you sure you want to delete ALL portfolio items? This cannot be undone.')) return;
    try {
      const deletePromises = portfolio.map(item => deleteDoc(doc(db, 'portfolio', item.id!)));
      await Promise.all(deletePromises);
      toast.success('Portfolio cleared successfully');
    } catch (e: any) {
      handleFirestoreError(e, OperationType.DELETE, 'portfolio');
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      toast.success(`Booking marked as ${status}`);
    } catch (e: any) { handleFirestoreError(e, OperationType.UPDATE, `bookings/${id}`); }
  };

  const deleteItem = async (col: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, col, id));
      toast.success('Deleted successfully');
    } catch (e: any) { handleFirestoreError(e, OperationType.DELETE, `${col}/${id}`); }
  };

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'services', label: 'Services', icon: Edit2 },
    { id: 'portfolio', label: 'Portfolio', icon: Camera },
    { id: 'uploads', label: 'Uploads', icon: FileUp },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Admin Panel</h1>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-12 no-scrollbar gap-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap shrink-0",
              activeTab === tab.id 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "bg-zinc-900 text-gray-400 hover:bg-zinc-800"
            )}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden">
        {activeTab === 'bookings' && (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full text-left hidden md:table">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400">USER</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400">SERVICE</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400">DATE & TIME</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400">LOCATION</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400">STATUS</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No bookings found</td>
                  </tr>
                ) : bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold">{b.userName}</p>
                      <p className="text-xs text-gray-500">{b.userEmail}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">{b.service}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">{formatDate(b.date)}</p>
                      <p className="text-xs text-gray-500">{b.time || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{b.location || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        b.status === 'Confirmed' ? "bg-green-500/20 text-green-500" :
                        b.status === 'Completed' ? "bg-blue-500/20 text-blue-500" :
                        "bg-orange-500/20 text-orange-500"
                      )}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateBookingStatus(b.id!, 'Confirmed')} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20"><Check className="w-4 h-4" /></button>
                        <button onClick={() => updateBookingStatus(b.id!, 'Completed')} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20"><LayoutDashboard className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem('bookings', b.id!)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-white/5">
              {bookings.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No bookings found</div>
              ) : bookings.map((b) => (
                <div key={b.id} className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{b.userName}</p>
                      <p className="text-xs text-gray-500">{b.userEmail}</p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      b.status === 'Confirmed' ? "bg-green-500/20 text-green-500" :
                      b.status === 'Completed' ? "bg-blue-500/20 text-blue-500" :
                      "bg-orange-500/20 text-orange-500"
                    )}>
                      {b.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-1">Service</p>
                      <p className="font-medium">{b.service}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-1">Date & Time</p>
                      <p className="font-medium">{formatDate(b.date)}</p>
                      <p className="text-xs text-gray-500">{b.time || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-1">Location</p>
                      <p className="font-medium">{b.location || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      onClick={() => updateBookingStatus(b.id!, 'Confirmed')} 
                      className="flex-1 py-2 bg-green-500/10 text-green-500 rounded-lg font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> CONFIRM
                    </button>
                    <button 
                      onClick={() => updateBookingStatus(b.id!, 'Completed')} 
                      className="flex-1 py-2 bg-blue-500/10 text-blue-500 rounded-lg font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" /> COMPLETE
                    </button>
                    <button 
                      onClick={() => deleteItem('bookings', b.id!)} 
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {users.map((u) => (
              <div key={u.uid} className="p-6 bg-black/40 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 font-bold shrink-0">
                    {u.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{u.name}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="p-4 sm:p-8 space-y-6">
            {messages.map((m) => (
              <div key={m.id} className="p-6 bg-black/40 rounded-2xl border border-white/5">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                  <div>
                    <h3 className="font-bold text-lg">{m.name}</h3>
                    <p className="text-xs sm:text-sm text-orange-500 break-all">{m.email} • {m.phone}</p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">{formatDate(m.createdAt)}</span>
                </div>
                <p className="text-gray-300 bg-black/20 p-4 rounded-xl italic text-sm sm:text-base">"{m.message}"</p>
                <button onClick={() => deleteItem('contact_messages', m.id!)} className="mt-4 text-red-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  <Trash2 className="w-3 h-3" /> DELETE MESSAGE
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Portfolio Management</h2>
              {portfolio.length > 0 && (
                <button 
                  onClick={clearPortfolio}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm border border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" /> CLEAR ALL PORTFOLIO
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Upload Form */}
              <div className="lg:col-span-1 bg-black/40 p-6 rounded-2xl border border-white/5 h-fit">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-orange-500" /> ADD TO PORTFOLIO
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      value={portfolioCategory} 
                      onChange={(e) => setPortfolioCategory(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-orange-500"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Cars">Cars</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Type</label>
                    <select 
                      value={portfolioType} 
                      onChange={(e) => setPortfolioType(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-orange-500"
                    >
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handlePortfolioUpload}
                      className="hidden" 
                      accept={portfolioType === 'video' ? 'video/*' : 'image/*'}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {uploading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> UPLOADING...</>
                      ) : (
                        <><Upload className="w-5 h-5" /> SELECT & UPLOAD</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Portfolio List */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pending Uploads */}
                  {pendingUploads.map((pending) => (
                    <div key={pending.id} className="aspect-video bg-zinc-800 rounded-2xl flex flex-col items-center justify-center border border-dashed border-white/20 animate-pulse">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-[80%]">
                        Uploading {pending.name}
                      </span>
                    </div>
                  ))}

                  {portfolio.map((item) => (
                    <div key={item.id} className="group relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/5">
                      {item.type === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                          <Play className="w-12 h-12 text-white/20" />
                        </div>
                      ) : (
                        <img src={item.mediaUrl} alt="" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-orange-500">{item.category}</span>
                        <button 
                          onClick={() => deleteItem('portfolio', item.id!)}
                          className="p-2 sm:p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {uploads.map((up) => (
              <div key={up.id} className="p-6 bg-black/40 rounded-2xl border border-white/5">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{up.fileName}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">By {up.userName}</p>
                  </div>
                  <a href={up.fileUrl} target="_blank" rel="noreferrer" className="p-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 shrink-0">
                    <FileUp className="w-4 h-4" />
                  </a>
                </div>
                <button onClick={() => deleteItem('uploads', up.id!)} className="text-red-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  <Trash2 className="w-3 h-3" /> DELETE FILE
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="p-12 text-center text-gray-500">
            <p>Services management is available via Firestore. Prices have been removed from the application.</p>
          </div>
        )}
      </div>
    </div>
  );
}
