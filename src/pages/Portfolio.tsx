import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioItem } from '../types';
import { Play, Maximize2, Trash2, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export default function Portfolio() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filter, setFilter] = useState<'All' | 'Wedding' | 'Cars' | 'Events'>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'portfolio'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
      setItems(data);
    }, (e) => handleFirestoreError(e, OperationType.GET, 'portfolio'));
    return () => unsub();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    try {
      await deleteDoc(doc(db, 'portfolio', id));
      toast.success('Portfolio item deleted');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.DELETE, `portfolio/${id}`);
    }
  };

  const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">PORTFOLIO</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A collection of our finest cinematic works across different categories. 
          Quality that speaks for itself.
        </p>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-12 no-scrollbar gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
        {['All', 'Wedding', 'Cars', 'Events'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={cn(
              "px-8 py-2 rounded-full font-bold transition-all border whitespace-nowrap shrink-0",
              filter === cat 
                ? "bg-orange-500 border-orange-500 text-white" 
                : "bg-transparent border-white/20 text-gray-400 hover:border-white"
            )}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900/50 rounded-[40px] border border-white/5">
          <Play className="w-16 h-16 text-gray-600 mx-auto mb-6 opacity-20" />
          <h3 className="text-2xl font-bold text-gray-500">No projects to show yet.</h3>
          <p className="text-gray-600 mt-2">Check back soon for our latest cinematic works.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white/20" />
                  </div>
                ) : (
                  <img 
                    src={item.mediaUrl} 
                    alt={item.category} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <span className="text-orange-500 font-black tracking-widest text-xs mb-2">{item.category.toUpperCase()}</span>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Cinematic Story</h3>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button 
                          onClick={(e) => handleDelete(e, item.id!)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {item.type === 'video' ? <Play className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedItem(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black"
          >
            {selectedItem.type === 'video' ? (
              <video 
                src={selectedItem.mediaUrl} 
                controls 
                autoPlay 
                className="w-full h-full"
              />
            ) : (
              <img 
                src={selectedItem.mediaUrl} 
                alt="Full View" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            )}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Utility function for conditional classes (since I can't import it easily in this block without repeating)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
