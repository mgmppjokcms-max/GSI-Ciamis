import React, { useState } from 'react';
import { Player, Team } from '../types';
import { User, Medal, Trophy, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ScorersView({ players, teams }: { players: Player[], teams: Team[] }) {
  const [teamFilter, setTeamFilter] = useState<string>('ALL');

  const filteredPlayers = teamFilter === 'ALL' 
    ? players 
    : players.filter(p => p.teamId === teamFilter);

  const sortedPlayers = [...filteredPlayers].sort((a, b) => b.goals - a.goals);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-black italic text-pitch-dark underline decoration-yellow-400 decoration-4 underline-offset-8">TOP SKORER</h2>
          <p className="text-slate-500 font-medium">Pencetak Gol Terbanyak GSI Ciamis 2026</p>
        </div>

        <div className="flex justify-center">
          <div className="relative group/filter w-full max-w-xs">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/filter:text-pitch transition-colors">
              <Filter className="w-4 h-4" />
            </div>
            <select 
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-pitch/20 focus:border-pitch transition-all appearance-none cursor-pointer shadow-sm hover:shadow-md"
            >
              <option value="ALL">Semua Tim</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-pitch-dark text-white px-8 py-6">
          <div className="flex items-center space-x-3">
            <Medal className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-bold">Papan Skor Individu</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                <th className="px-8 py-4 text-left w-20">Rank</th>
                <th className="px-8 py-4 text-left">Pemain</th>
                <th className="px-8 py-4 text-left">Asal Sekolah / Tim</th>
                <th className="px-8 py-4 text-right">Gol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedPlayers.length > 0 ? sortedPlayers.map((player, idx) => {
                const team = teams.find(t => t.id === player.teamId);
                return (
                  <tr key={player.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                        idx === 0 ? "bg-yellow-400 text-yellow-900" :
                        idx === 1 ? "bg-slate-300 text-slate-700" :
                        idx === 2 ? "bg-amber-600 text-white" :
                        "bg-slate-100 text-slate-400"
                      )}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-pitch group-hover:text-white transition-colors">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800 text-lg">{player.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                          {team?.logoUrl && <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide">
                          {team?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-2xl font-black text-pitch">{player.goals}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">GOL</span>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">
                    Belum ada data pencetak gol terpantau.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl text-yellow-950 flex items-center justify-between">
            <div>
               <p className="text-xs font-black uppercase opacity-80 mb-1">Golden Boot Leader</p>
               <p className="text-2xl font-black">{sortedPlayers[0]?.name || '-'}</p>
            </div>
            <Trophy className="w-12 h-12 opacity-30" />
         </div>
         <div className="bg-slate-800 p-6 rounded-2xl text-white flex items-center justify-between">
            <div>
               <p className="text-xs font-black uppercase opacity-60 mb-1">Total Goal Kompetisi</p>
               <p className="text-2xl font-black">{sortedPlayers.reduce((acc, p) => acc + p.goals, 0)} GOL</p>
            </div>
            <Medal className="w-12 h-12 opacity-20 text-white" />
         </div>
      </div>
    </div>
  );
}
