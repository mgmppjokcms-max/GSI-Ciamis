import React, { useState, useEffect } from 'react';
import { Team, Match, Player, Official } from '../types';
import { ChevronLeft, Trophy, Calendar, Users, Zap, Shield, Sparkles, X, Globe } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { store } from '../services/store';
import { FutCard } from './ScoutView';
import { motion, AnimatePresence } from 'motion/react';

interface TeamDetailViewProps {
  team: Team;
  matches: Match[];
  players: Player[];
  allTeams: Team[];
  onBack: () => void;
  onGoToPlayersList?: (teamId: string) => void;
}

export default function TeamDetailView({ team, matches, players, allTeams, onBack, onGoToPlayersList }: TeamDetailViewProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [officials, setOfficials] = useState<Official[]>([]);

  useEffect(() => {
    store.getOfficials().then(allOfficials => {
      setOfficials(allOfficials.filter(o => o.teamId === team.id));
    });
  }, [team.id]);
  const teamMatches = matches
    .filter(m => m.teamAId === team.id || m.teamBId === team.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const teamPlayers = players.filter(p => p.teamId === team.id);

  // Calculate Standing Position
  const groupTeams = allTeams.filter(t => t.group === team.group);
  const sortedGroupTeams = [...groupTeams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    if (diffB !== diffA) return diffB - diffA;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.name.localeCompare(b.name);
  });
  const standingPos = sortedGroupTeams.findIndex(t => t.id === team.id) + 1;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-pitch transition-colors font-bold group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Kembali</span>
      </button>

      {/* Header Profile */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative flex flex-col">
        {team.photoUrl ? (
          <div className="h-56 md:h-72 w-full overflow-hidden relative">
            <img src={team.photoUrl} alt="Team Banner" className="w-full h-full object-cover select-none" referrerPolicy="no-referrer" />
            <div className="absolute inset-x-0 bottom-0 top-1/4 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
            
            <div className="absolute bottom-6 left-8 right-8 flex flex-col md:flex-row items-center md:items-end gap-5 text-white z-10">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-2xl shrink-0">
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-3xl text-slate-300">
                    {team.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-2xl md:text-4xl font-black italic tracking-tight drop-shadow-md text-white">{team.name}</h2>
                <div className="flex items-center justify-center md:justify-start space-x-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-md border border-white/15">
                    Grup {team.group || '-'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-yellow-400 text-slate-900 text-[9px] font-black uppercase tracking-wider">
                    Posisi {standingPos}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 relative flex flex-col md:flex-row items-center gap-8 z-10">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Shield className="w-64 h-64 text-pitch" />
            </div>
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-50 shadow-2xl shrink-0">
              {team.logoUrl ? (
                <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-4xl text-slate-300">
                  {team.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h2 className="text-4xl font-black italic text-pitch-dark tracking-tight">{team.name}</h2>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                    Grup {team.group || '-'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-pitch/10 text-pitch text-[10px] font-black uppercase tracking-widest border border-pitch/20">
                    Posisi {standingPos}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4 justify-center md:justify-start">
           <StatCard label="Poin" value={team.points} icon={Trophy} color="bg-yellow-400" />
           <StatCard label="Menang" value={team.won} icon={Zap} color="bg-green-500" />
           <StatCard label="SG" value={team.goalsFor - team.goalsAgainst} icon={Shield} color="bg-pitch" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match History */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black italic flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-pitch" />
            <span>Riwayat Pertandingan</span>
          </h3>
          
          <div className="space-y-4">
            {teamMatches.length > 0 ? teamMatches.map(match => (
              <HistoryMatchItem key={match.id} match={match} currentTeamId={team.id} allTeams={allTeams} />
            )) : (
              <div className="bg-slate-50 p-12 rounded-2xl text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-200">
                Belum ada data pertandingan.
              </div>
            )}
          </div>
        </div>

        {/* Squad List */}
        <div className="space-y-6">
          <h3 
            onClick={() => onGoToPlayersList && onGoToPlayersList(team.id)}
            className="text-xl font-black italic flex items-center justify-between group cursor-pointer hover:text-pitch transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-pitch animate-pulse" />
              <span>Daftar Pemain</span>
            </div>
            <span className="text-[10px] font-black tracking-wide bg-slate-100 group-hover:bg-pitch/10 group-hover:text-pitch px-2.5 py-1.5 rounded-full border border-slate-200 group-hover:border-pitch/20 not-italic transition-all">
              LIHAT SEMUA ↗
            </span>
          </h3>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {teamPlayers.length > 0 ? teamPlayers.map(player => {
              const rating = player.rating || { pac: 60, sho: 60, pas: 60, dri: 60, def: 60, phy: 60 };
              const overall = Math.round((rating.pac + rating.sho + rating.pas + rating.dri + rating.def + rating.phy) / 6);
              const position = player.position || 'ST';

              const secondaryRating = player.secondaryRating;
              const secondaryOverall = secondaryRating 
                ? Math.round((secondaryRating.pac + secondaryRating.sho + secondaryRating.pas + secondaryRating.dri + secondaryRating.def + secondaryRating.phy) / 6)
                : null;
              const secondaryPosition = player.secondaryPosition;

              return (
                <div 
                  key={player.id} 
                  onClick={() => setSelectedPlayer(player)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col text-left">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-700 group-hover:text-pitch transition-colors">{player.name}</span>
                      {player.jerseyNumber !== undefined && player.jerseyNumber !== null && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[9px] px-1.5 py-0.5 rounded font-black">
                          #{player.jerseyNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{position}</span>
                      {secondaryPosition && (
                        <>
                          <span className="text-slate-350 text-[10px]">•</span>
                          <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200/50 px-1.5 py-0.2 rounded-md uppercase tracking-tight" title="Posisi Tambahan">
                            {secondaryPosition} (TAMBAHAN)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {player.rating && (
                      <span className="bg-yellow-100 text-yellow-800 border border-yellow-300 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase shadow-xs">
                        {overall} OVR
                      </span>
                    )}
                    {secondaryOverall && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300/60 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase shadow-xs" title="Rating Posisi Tambahan">
                        {secondaryOverall} OVR 2
                      </span>
                    )}
                    <span className="bg-pitch text-white text-[10px] px-2.5 py-1 rounded-full font-black">
                      {player.goals} GOL
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-slate-400 text-sm font-medium italic">
                Belum ada data pemain.
              </div>
            )}
          </div>

          {/* Team Officials Section (Located directly beneath list of players) */}
          {officials.length > 0 && (
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-black italic flex items-center space-x-2">
                <Globe className="w-5 h-5 text-pitch" />
                <span>Official Tim</span>
              </h3>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {officials.map(o => (
                  <div key={o.id} className="p-4 flex items-center space-x-4 hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full overflow-hidden flex items-center justify-center text-slate-400 shrink-0">
                      {o.photoUrl ? (
                        <img src={o.photoUrl} alt={o.name} className="w-full h-full object-cover animate-none" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-slate-400 bg-slate-100 text-sm">
                          {o.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-700 leading-tight">{o.name}</p>
                      <p className="text-[10px] font-black text-pitch uppercase tracking-widest mt-0.5">{o.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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
                  team={allTeams.find(t => t.id === selectedPlayer.teamId) || team}
                  globalShowCustom={true} // flip to show custom attributes
                />
              </div>

              <div className="space-y-4 w-full">
                <p className="text-sm font-extrabold text-white tracking-wide uppercase">
                  {selectedPlayer.name}
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Klub: <span className="text-pitch">{(allTeams.find(t => t.id === selectedPlayer.teamId) || team).name}</span>
                </p>
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

function StatCard({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) {
  return (
    <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm", color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">{label}</p>
        <p className="text-xl font-black text-slate-800 leading-none">{value}</p>
      </div>
    </div>
  );
}

function HistoryMatchItem({ match, currentTeamId, allTeams }: { match: Match, currentTeamId: string, allTeams: Team[], key?: string }) {
  const teamA = allTeams.find(t => t.id === match.teamAId);
  const teamB = allTeams.find(t => t.id === match.teamBId);
  const isA = match.teamAId === currentTeamId;
  const opponent = isA ? teamB : teamA;
  const scoreSelf = isA ? match.scoreA : match.scoreB;
  const scoreOpponent = isA ? match.scoreB : match.scoreA;

  const result = match.status !== 'FINISHED' ? 'UPCOMING' : 
                 scoreSelf > scoreOpponent ? 'WIN' : 
                 scoreSelf < scoreOpponent ? 'LOSS' : 'DRAW';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-pitch transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white",
          result === 'WIN' ? "bg-green-500" :
          result === 'LOSS' ? "bg-red-500" :
          result === 'DRAW' ? "bg-slate-400" : "bg-blue-400"
        )}>
          {result === 'WIN' ? 'W' : result === 'LOSS' ? 'L' : result === 'DRAW' ? 'D' : '?'}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400">{formatDate(match.date)}</p>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-500">vs</span>
            <span className="font-black text-slate-800">{opponent?.name}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-4">
        {match.status === 'FINISHED' ? (
          <span className="text-xl font-black">{scoreSelf} - {scoreOpponent}</span>
        ) : (
          <span className="text-xs font-black text-blue-500 uppercase tracking-widest">{match.status}</span>
        )}
      </div>
    </div>
  );
}
