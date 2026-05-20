import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import { store } from '../services/store';
import { Calendar, User, Newspaper, ChevronRight, X, Clock, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function NewsView() {
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await store.getNews();
      setNewsList(data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="news-section">
      {/* Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-black uppercase text-amber-400 tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Kabar GSI Ciamis</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-black leading-tight italic uppercase tracking-tight">
            BERITA & <span className="text-amber-400">PENGUMUMAN</span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed">
            Dapatkan informasi terkini, laporan eksklusif pertandingan, analisis bakat pemain, dan kabar official resmi langsung dari turnamen Gala Siswa Indonesia Kabupaten Ciamis 2026.
          </p>
        </div>
      </section>

      {/* Main Grid / News List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="text-lg font-black uppercase text-slate-800 tracking-wider flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-pitch" />
            <span>Artikel Terbaru</span>
          </h3>
          <span className="text-xs font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-widest">
            {newsList.length} Berita
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-pitch border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Memuat Berita...</p>
          </div>
        ) : newsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((article, idx) => {
              const dateString = new Date(article.date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              
              const isFirst = idx === 0;

              return (
                <div 
                  key={article.id}
                  id={`article-card-${article.id}`}
                  className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group ${
                    isFirst ? 'md:col-span-2 lg:col-span-2 lg:flex-row' : ''
                  }`}
                >
                  {/* Article Image */}
                  <div className={`relative overflow-hidden bg-slate-100 ${
                    isFirst ? 'w-full lg:w-1/2 h-56 lg:h-full min-h-[220px]' : 'h-48'
                  }`}>
                    <img 
                      src={article.imageUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Badge */}
                    <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-white/10">
                      {isFirst ? 'Berita Utama' : 'Kabar Terkini'}
                    </span>
                  </div>

                  {/* Article Content Area */}
                  <div className={`p-6 flex flex-col justify-between flex-1 ${
                    isFirst ? 'lg:py-8 lg:px-8' : ''
                  }`}>
                    <div className="space-y-3">
                      {/* Meta */}
                      <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dateString || article.date}</span>
                        </span>
                        {article.author && (
                          <span className="flex items-center space-x-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[100px]">{article.author}</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className={`font-black text-slate-800 tracking-tight group-hover:text-pitch transition-colors line-clamp-2 leading-snug ${
                        isFirst ? 'text-lg md:text-2xl' : 'text-base'
                      }`}>
                        {article.title}
                      </h4>

                      {/* Description preview */}
                      <p className={`text-slate-500 text-xs font-medium leading-relaxed line-clamp-3 ${
                        isFirst ? 'pb-4' : ''
                      }`}>
                        {article.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <button 
                        onClick={() => setSelectedArticle(article)}
                        id={`btn-read-${article.id}`}
                        className="text-xs font-black text-pitch hover:text-pitch-dark flex items-center space-x-1 uppercase tracking-wider transition-colors"
                      >
                        <span>Baca Selengkapnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Newspaper className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm uppercase">Belum ada berita yang diterbitkan</h4>
              <p className="text-slate-400 text-xs px-6 mt-1 leading-relaxed">
                Silakan tambahkan artikel berita baru melalui panel Admin → Pengaturan Berita.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Article Detail Dialogue / Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cover Image Banner */}
              <div className="relative h-64 md:h-80 bg-slate-100 overflow-hidden flex-shrink-0">
                <img 
                  src={selectedArticle.imageUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"} 
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                
                {/* Close Button Inside Image Area */}
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md text-white p-2 rounded-full border border-white/10 transition-colors cursor-pointer"
                  title="Tutup"
                  id="btn-close-article"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Cover info */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-300 uppercase tracking-wildest">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{new Date(selectedArticle.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </span>
                    {selectedArticle.author && (
                      <span className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>Penulis: {selectedArticle.author}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl md:text-3xl font-black italic tracking-tight uppercase leading-snug drop-shadow-md text-white">
                    {selectedArticle.title}
                  </h3>
                </div>
              </div>

              {/* Core Content View */}
              <div className="p-6 md:p-8 space-y-6 max-h-[50vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200">
                <p className="text-slate-700 text-sm md:text-base font-semibold leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content}
                </p>
              </div>

              {/* Footer navigation */}
              <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-200 transition-colors flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>GSI Ciamis Official</span>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
