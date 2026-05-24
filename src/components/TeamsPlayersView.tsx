import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Team, Player } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Trophy, 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Sparkles,
  Zap,
  Activity,
  Award,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { FutCard } from './ScoutView';

interface TeamsPlayersViewProps {
  teams: Team[];
  players: Player[];
  onTeamClick: (teamId: string) => void;
  initialSegment?: 'teams' | 'players';
  initialFilter?: string;
}

export default function TeamsPlayersView({ 
  teams, 
  players, 
  onTeamClick,
  initialSegment = 'teams',
  initialFilter = 'ALL'
}: TeamsPlayersViewProps) {
  const [activeSegment, setActiveSegment] = useState<'teams' | 'players'>(initialSegment);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>(initialFilter);

  // Sync state when navigation initial choices change
  useEffect(() => {
    setActiveSegment(initialSegment);
  }, [initialSegment]);

  useEffect(() => {
    setSelectedTeamFilter(initialFilter);
  }, [initialFilter]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // List of player positions for category styling
  const getPositionCategory = (pos?: string) => {
    const p = (pos || 'ST').toUpperCase();
    if (['GK'].includes(p)) return 'Kiper';
    if (['CB', 'LCB', 'RCB', 'LB', 'RB', 'LWB', 'RWB'].includes(p)) return 'Bek';
    if (['CM', 'CDM', 'CAM', 'LM', 'RM', 'LCM', 'RCM', 'LDM', 'RDM'].includes(p)) return 'Gelandang';
    return 'Penyerang';
  };

  const getPositionColor = (pos?: string) => {
    const cat = getPositionCategory(pos);
    switch (cat) {
      case 'Kiper': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Bek': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Gelandang': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getOverallRating = (player: Player) => {
    const r = player.rating || { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 };
    return Math.round((r.pac + r.sho + r.pas + r.dri + r.def + r.phy) / 6);
  };

  // Filtered teams
  const filteredTeams = useMemo(() => {
    return teams.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  }, [teams, searchTerm]);

  // Filtered players
  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTeam = selectedTeamFilter === 'ALL' || p.teamId === selectedTeamFilter;
      return matchSearch && matchTeam;
    }).sort((a, b) => {
      const ovrA = getOverallRating(a);
      const ovrB = getOverallRating(b);
      return ovrB - ovrA || b.goals - a.goals || a.name.localeCompare(b.name);
    });
  }, [players, searchTerm, selectedTeamFilter]);

  const teamOfSelectedPlayer = selectedPlayer 
    ? teams.find(t => t.id === selectedPlayer.teamId)
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner and Navigation Segment */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black italic text-slate-800 flex items-center space-x-2">
            <Users className="w-8 h-8 text-pitch" />
            <span>TIM & PEMAIN</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Eksplorasi profil tim dan rating keterampilan pemain bintang GSI Ciamis 2026</p>
        </div>
        
        {/* Toggle Segment */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto relative border border-slate-200/50">
          <button
            onClick={() => {
              setActiveSegment('teams');
              setSearchTerm('');
            }}
            className={cn(
              "flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 relative z-10",
              activeSegment === 'teams' ? "bg-white text-pitch shadow-md" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Trophy className="w-4 h-4" />
            <span>Profil Tim ({teams.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveSegment('players');
              setSearchTerm('');
              setSelectedTeamFilter('ALL');
            }}
            className={cn(
              "flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 relative z-10",
              activeSegment === 'players' ? "bg-white text-pitch shadow-md" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Award className="w-4 h-4" />
            <span>Profil Pemain ({players.length})</span>
          </button>
        </div>
      </div>

      {/* Control Bars: Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={activeSegment === 'teams' ? "Cari nama tim..." : "Cari nama pemain..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-12 pr-6 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pitch shadow-sm font-bold text-slate-700"
          />
        </div>

        {/* Team filter (Only for players view) */}
        {activeSegment === 'players' && (
          <div className="flex items-center space-x-2 min-w-[200px]">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2 w-full">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-700 text-sm focus:outline-none w-full cursor-pointer"
              >
                <option value="ALL">Semua Tim</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid Content */}
      <AnimatePresence mode="wait">
        {activeSegment === 'teams' ? (
          <motion.div
            key="teams-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTeams.length === 0 ? (
              <div className="col-span-full bg-white p-20 text-center rounded-3xl border border-slate-100 italic text-slate-400 font-bold">
                Tidak ada tim yang cocok dengan pencarian Anda.
              </div>
            ) : (
              filteredTeams.map((team, idx) => {
                const teamPlayersCount = players.filter(p => p.teamId === team.id).length;
                return (
                  <motion.div
                    key={team.id}
                    onClick={() => onTeamClick(team.id)}
                    className="group bg-white rounded-3xl border border-slate-205 p-6 flex flex-col justify-between hover:border-pitch hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0">
                          {team.logoUrl ? (
                            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="font-black text-slate-300 text-2xl">{team.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-black text-xl text-slate-800 tracking-tight leading-tight group-hover:text-pitch transition-colors">{team.name}</h3>
                          <div className="flex items-center space-x-1.5 mt-1.5">
                            <span className="inline-flex text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                              GRUP {team.group || '-'}
                            </span>
                            {team.points > 0 && (
                              <span className="inline-flex items-center text-[10px] font-black text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200/50">
                                <Trophy className="w-2.5 h-2.5 mr-0.5 fill-current" />
                                {team.points} PTS
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-slate-305 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                          #{idx + 1}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mt-6 text-center">
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Main / POIN</p>
                        <p className="font-black text-slate-700 text-sm mt-0.5">{team.played} / <span className="text-pitch">{team.points}</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Menang</p>
                        <p className="font-black text-green-600 text-sm mt-0.5">{team.won}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Skuad</p>
                        <p className="font-black text-slate-705 text-sm mt-0.5">{teamPlayersCount} Pemain</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 text-xs font-bold text-slate-400 group-hover:text-pitch transition-colors">
                      <span>Lihat Roster & Jadwal</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        ) : (
          <motion.div
            key="players-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 min-[375px]:gap-3 sm:gap-6 justify-items-center"
          >
            {filteredPlayers.length === 0 ? (
              <div className="col-span-full bg-white p-20 text-center rounded-3xl border border-slate-100 italic text-slate-400 font-bold">
                Tidak ada pemain yang cocok dengan pencarian / filter Anda.
              </div>
            ) : (
              filteredPlayers.map((player) => {
                const team = teams.find(t => t.id === player.teamId);
                return (
                  <FutCard
                    key={player.id}
                    player={player}
                    team={team}
                    onClick={() => setSelectedPlayer(player)}
                  />
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FUT Card Details Modal Popup */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedPlayer(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700/60 p-6 rounded-3xl relative text-center flex flex-col items-center justify-center max-w-sm w-full cursor-default shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-yellow-400 text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-1.5 justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" /> Detail Kartu FUT Pemain
              </h3>

              {/* FutCard itself */}
              <div className="flex justify-center mb-6">
                <FutCard 
                  player={selectedPlayer} 
                  team={teamOfSelectedPlayer || undefined}
                  globalShowCustom={true} // flip to show custom attributes
                />
              </div>

              <div className="space-y-4 w-full">
                <p className="text-sm font-extrabold text-white tracking-wide uppercase">
                  {selectedPlayer.name}
                </p>
                {teamOfSelectedPlayer && (
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Klub: <span className="text-pitch">{teamOfSelectedPlayer.name}</span>
                  </p>
                )}
                <div className="bg-slate-800/80 border border-slate-700/50 p-3.5 rounded-2xl text-[11px] font-bold text-slate-300 text-left space-y-1">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Posisi Utama:</span>
                    <span className="text-yellow-400 uppercase font-extrabold">{selectedPlayer.position}</span>
                  </div>
                  {selectedPlayer.secondaryPosition && (
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Posisi Tambahan:</span>
                      <span className="text-amber-500 uppercase font-extrabold">{selectedPlayer.secondaryPosition}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Jumlah Gol:</span>
                    <span className="text-green-400 font-extrabold">{selectedPlayer.goals || 0} GOL</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedPlayer(null)}
                className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-755 hover:text-white active:bg-slate-950 text-slate-200 rounded-xl font-bold uppercase text-[11.5px] tracking-widest transition-all border border-slate-700"
              >
                Tutup Kartu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
